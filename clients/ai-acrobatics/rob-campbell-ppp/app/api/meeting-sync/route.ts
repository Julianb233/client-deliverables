import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { NextResponse } from "next/server";
import { createLinearIssue } from "../../../lib/linear";
import { DEFAULT_CONVEX_URL, PORTAL_CLIENT_SLUG } from "../../../lib/portal-config";

type MeetingSyncBody = {
  title?: unknown;
  meetingDate?: unknown;
  transcriptId?: unknown;
  source?: unknown;
  summary?: unknown;
  decisions?: unknown;
  nextActions?: unknown;
  reviewStatus?: unknown;
};

export async function POST(request: Request) {
  const configuredSecret = process.env.MEETING_SYNC_SECRET;
  if (configuredSecret) {
    const suppliedSecret = request.headers.get("x-meeting-sync-secret");
    if (suppliedSecret !== configuredSecret) {
      return NextResponse.json({ ok: false, error: "Unauthorized meeting sync." }, { status: 401 });
    }
  }

  const body = await request.json().catch(() => null) as MeetingSyncBody | null;
  const title = cleanText(body?.title, 160) || "Meeting notes ready for review";
  const meetingDate = cleanText(body?.meetingDate, 40, true) || new Date().toISOString().slice(0, 10);
  const transcriptId = cleanText(body?.transcriptId, 120, true);
  const source = cleanText(body?.source, 120, true) || "Fireflies";
  const summary = cleanText(body?.summary, 4000);
  const reviewStatus = cleanText(body?.reviewStatus, 80, true) || "julian-review-required";
  const decisions = normalizeStringList(body?.decisions, 12);
  const nextActions = normalizeStringList(body?.nextActions, 12);

  if (!summary) {
    return NextResponse.json({ ok: false, error: "Meeting summary is required." }, { status: 400 });
  }

  const bodyLines = [
    summary,
    "",
    decisions.length > 0 ? "Decisions:" : null,
    ...decisions.map((item) => `- ${item}`),
    decisions.length > 0 ? "" : null,
    nextActions.length > 0 ? "Next actions:" : null,
    ...nextActions.map((item) => `- ${item}`),
    "",
    transcriptId ? `Source transcript: ${transcriptId}` : null,
    `Review status: ${reviewStatus}`,
  ].filter(Boolean).join("\n");

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || DEFAULT_CONVEX_URL);

  const linear = await createLinearIssue({
    title: `[${PORTAL_CLIENT_SLUG}] Review meeting notes: ${title}`,
    description: [
      `Meeting notes submitted for PPP publication review.`,
      "",
      `Client: ${PORTAL_CLIENT_SLUG}`,
      `Meeting date: ${meetingDate}`,
      `Source: ${source}`,
      transcriptId ? `Transcript ID: ${transcriptId}` : null,
      `Review status: ${reviewStatus}`,
      "",
      bodyLines,
      "",
      "Review gate: publish only client-safe summary, decisions, and next actions. Do not expose raw transcript text unless Julian approves it.",
    ].filter(Boolean).join("\n"),
    priority: 3,
  });

  const changelog = await convex.mutation(makeFunctionReference<"mutation">("portalChangelog:insertFromHttp"), {
    clientSlug: PORTAL_CLIENT_SLUG,
    title,
    description: summary,
    category: "strategy",
    items: [
      `Meeting date: ${meetingDate}`,
      `Source: ${source}`,
      transcriptId ? `Transcript: ${transcriptId}` : "Transcript: not supplied",
      `Review status: ${reviewStatus}`,
      ...decisions.slice(0, 5).map((item) => `Decision: ${item}`),
      ...nextActions.slice(0, 5).map((item) => `Next action: ${item}`),
    ],
    linearIssueIds: linear ? [linear.identifier] : [],
    repo: "rob-campbell-ppp",
    agent: "PPP meeting sync",
  }).catch((error) => ({ error: String(error) })) as unknown;

  await convex.mutation(makeFunctionReference<"mutation">("portalFeed:insertFromHttp"), {
    clientSlug: PORTAL_CLIENT_SLUG,
    type: "meeting-notes",
    title: `Meeting notes posted: ${title}`,
    body: `Reviewed meeting notes from ${meetingDate} were synced from ${source}${linear ? ` and routed to ${linear.identifier}` : ""}.`,
    url: linear?.url,
    icon: "notes",
    agent: "PPP meeting sync",
  });

  return NextResponse.json({
    ok: true,
    status: "synced-review-gated",
    meetingDate,
    transcriptId,
    linear,
    changelog,
    message: "Meeting notes were synced to the PPP review pipeline.",
  });
}

function cleanText(value: unknown, max: number, optional = false): string | undefined {
  if (typeof value !== "string") return optional ? undefined : "";
  const cleaned = value.replace(/\s+/g, " ").trim().slice(0, max);
  return cleaned || (optional ? undefined : "");
}

function normalizeStringList(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanText(item, 500, true))
    .filter((item): item is string => Boolean(item))
    .slice(0, maxItems);
}
