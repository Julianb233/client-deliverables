import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { NextResponse } from "next/server";
import { DEFAULT_CONVEX_URL, PORTAL_CLIENT_SLUG } from "../../../lib/portal-config";
import { createLinearIssue } from "../../../lib/linear";
import { notifyInternalPortalRequest } from "../../../lib/internal-notify";

const categories = ["suggestion", "improvement", "idea", "bug", "question"] as const;
const priorities = ["low", "medium", "high"] as const;
const assistantModes = ["question", "feedback", "idea", "blocker"] as const;
const attachmentKinds = ["image", "audio", "file"] as const;
const MAX_ATTACHMENT_BYTES = 750_000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const topic = cleanText(body?.topic, 120);
  const message = cleanText(body?.message, 3000);
  const page = cleanText(body?.page, 240, true);
  const category = categories.includes(body?.category) ? body.category : "idea";
  const priority = priorities.includes(body?.priority) ? body.priority : "medium";
  const assistantMode = assistantModes.includes(body?.assistantMode) ? body.assistantMode : "question";
  const attachments = normalizeAttachments(body?.attachments);

  if (!topic || !message) {
    return NextResponse.json({ ok: false, error: "Topic and message are required." }, { status: 400 });
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || DEFAULT_CONVEX_URL);
  const saved = await convex.mutation(makeFunctionReference<"mutation">("portalMessages:submit"), {
    clientSlug: PORTAL_CLIENT_SLUG,
    category,
    topic,
    message,
    page,
    priority,
    source: "ppp-quick-assistant",
    metadata: {
      assistantMode,
      attachments,
      attachmentCount: attachments.length,
      hasInlineAttachmentData: attachments.some((attachment) => Boolean(attachment.dataUrl)),
      userAgent: request.headers.get("user-agent") ?? undefined,
    },
  }) as { _id: string };

  const linear = await createLinearIssue({
    title: `[${PORTAL_CLIENT_SLUG}] Client assistant ${category}: ${topic}`,
    description: [
      `Client portal assistant message from ${PORTAL_CLIENT_SLUG}.`,
      "",
      `Assistant mode: ${assistantMode}`,
      `Category: ${category}`,
      `Priority: ${priority}`,
      page ? `Page: ${page}` : null,
      attachments.length > 0 ? `Attachments: ${attachments.map((attachment) => `${attachment.kind}:${attachment.name} (${attachment.size} bytes${attachment.dataUrl ? ", inline Convex metadata" : ", metadata only"})`).join(", ")}` : null,
      "",
      message,
      "",
      "Review gate: do not send client-facing replies without Julian approval. If an attachment is metadata-only, ask Julian before requesting a larger upload path.",
    ].filter(Boolean).join("\n"),
    priority: priority === "high" ? 2 : priority === "low" ? 4 : 3,
  });

  if (linear) {
    await convex.mutation(makeFunctionReference<"mutation">("portalMessages:markLinearRouted"), {
      id: saved._id,
      linearIssueId: linear.identifier,
      linearUrl: linear.url,
    });
  } else {
    await convex.mutation(makeFunctionReference<"mutation">("portalMessages:markLinearRouted"), {
      id: saved._id,
    });
  }

  await convex.mutation(makeFunctionReference<"mutation">("portalFeed:insertFromHttp"), {
    clientSlug: PORTAL_CLIENT_SLUG,
    type: "review",
    title: `Client assistant message: ${topic}`,
    body: `A ${category} was submitted from the PPP quick assistant${attachments.length > 0 ? ` with ${attachments.length} attachment${attachments.length === 1 ? "" : "s"}` : ""}${linear ? ` and routed to ${linear.identifier}` : " and is waiting in the portal review queue"}.`,
    url: linear?.url,
    icon: "message",
    agent: "PPP",
  });

  const notification = await notifyInternalPortalRequest({
    title: `[${PORTAL_CLIENT_SLUG}] New portal assistant message`,
    body: [
      `Topic: ${topic}`,
      `Category: ${category}`,
      `Priority: ${priority}`,
      page ? `Page: ${page}` : null,
      attachments.length > 0 ? `Attachments: ${attachments.length}` : null,
      "",
      message,
    ].filter(Boolean).join("\n"),
    linearUrl: linear?.url,
    portalUrl: `https://${request.headers.get("host") ?? "rob-campbell-ppp.vercel.app"}/request`,
    priority,
  });

  return NextResponse.json({
    ok: true,
    status: linear ? "converted_to_task" : "reviewing",
    linear,
    notification,
    message: "Thanks — this was logged in the portal and sent to Julian's review queue.",
  });
}

function cleanText(value: unknown, max: number, optional = false): string | undefined {
  if (typeof value !== "string") return optional ? undefined : "";
  const cleaned = value.replace(/\s+/g, " ").trim().slice(0, max);
  return cleaned || (optional ? undefined : "");
}

function normalizeAttachments(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 3).map((item) => {
    const kind = attachmentKinds.includes(item?.kind) ? item.kind : "file";
    const size = typeof item?.size === "number" && Number.isFinite(item.size) ? Math.max(0, Math.floor(item.size)) : 0;
    const dataUrl = typeof item?.dataUrl === "string" && size <= MAX_ATTACHMENT_BYTES && item.dataUrl.startsWith("data:")
      ? item.dataUrl.slice(0, MAX_ATTACHMENT_BYTES * 2)
      : undefined;
    return {
      name: cleanText(item?.name, 160) || "attachment",
      type: cleanText(item?.type, 120, true) || "application/octet-stream",
      size,
      kind,
      stored: dataUrl ? "inline-convex-metadata" : "metadata-only",
      dataUrl,
    };
  });
}
