import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { NextResponse } from "next/server";
import { wizardServiceOffers } from "../../../data/wizard-services";
import { createLinearIssue } from "../../../lib/linear";
import { DEFAULT_CONVEX_URL, PORTAL_CLIENT_SLUG } from "../../../lib/portal-config";

const intentTypes = ["checkout", "request", "learn_more"] as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const offerSlug = cleanText(body?.offerSlug, 120);
  const note = cleanText(body?.note, 1000, true);
  const intentType = intentTypes.includes(body?.intentType) ? body.intentType : "request";
  if (!offerSlug) {
    return NextResponse.json({ ok: false, error: "Offer is required." }, { status: 400 });
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || DEFAULT_CONVEX_URL);
  const liveOffer = await convex.query(makeFunctionReference<"query">("portalUpsellOffers:getByClientOffer"), {
    clientSlug: PORTAL_CLIENT_SLUG,
    offerSlug,
  }).catch(() => null) as null | {
    offerSlug: string;
    title: string;
    checkoutUrl?: string;
    requestOnly?: boolean;
    outcome?: string;
    priceLabel?: string;
  };
  const fallback = wizardServiceOffers.find((offer) => offer.offerSlug === offerSlug);
  const offer = liveOffer ?? fallback;
  if (!offer) {
    return NextResponse.json({ ok: false, error: "Offer not found." }, { status: 404 });
  }

  const checkoutUrl = !offer.requestOnly && offer.checkoutUrl ? offer.checkoutUrl : undefined;
  const finalIntentType = checkoutUrl && intentType === "checkout" ? "checkout" : "request";
  const saved = await convex.mutation(makeFunctionReference<"mutation">("portalUpsellIntents:submit"), {
    clientSlug: PORTAL_CLIENT_SLUG,
    offerSlug: offer.offerSlug,
    title: offer.title,
    intentType: finalIntentType,
    note,
    checkoutUrl,
    metadata: {
      source: "ppp-upsell-panel",
      priceLabel: offer.priceLabel,
      userAgent: request.headers.get("user-agent") ?? undefined,
    },
  }) as { _id: string; status: string; checkoutUrl?: string };

  let linear: { identifier: string; url: string } | null = null;
  if (!checkoutUrl) {
    linear = await createLinearIssue({
      title: `[${PORTAL_CLIENT_SLUG}] Upsell request: ${offer.title}`,
      description: [
        `Client requested the ${offer.title} upsell from the PPP.`,
        "",
        `Offer slug: ${offer.offerSlug}`,
        offer.outcome ? `Outcome: ${offer.outcome}` : null,
        offer.priceLabel ? `Price label: ${offer.priceLabel}` : null,
        note ? `Client note: ${note}` : null,
        "",
        "Review gate: scope and approve before sending a quote or checkout link.",
      ].filter(Boolean).join("\n"),
      priority: 3,
    });
    if (linear) {
      await convex.mutation(makeFunctionReference<"mutation">("portalUpsellIntents:markLinearRouted"), {
        id: saved._id,
        linearIssueId: linear.identifier,
        linearUrl: linear.url,
      });
    }
  }

  await convex.mutation(makeFunctionReference<"mutation">("portalFeed:insertFromHttp"), {
    clientSlug: PORTAL_CLIENT_SLUG,
    type: "review",
    title: checkoutUrl ? `Checkout opened: ${offer.title}` : `Upsell requested: ${offer.title}`,
    body: checkoutUrl
      ? `The PPP returned the configured checkout link for ${offer.title}.`
      : `The PPP logged a custom upsell request for Julian review${linear ? ` and routed it to ${linear.identifier}` : ""}.`,
    url: checkoutUrl ?? linear?.url,
    icon: "sparkles",
    agent: "PPP",
  });

  return NextResponse.json({
    ok: true,
    status: checkoutUrl ? "checkout_returned" : "review_required",
    checkoutUrl,
    linear,
    message: checkoutUrl ? "Checkout is ready." : "This request was sent to Julian's review queue.",
  });
}

function cleanText(value: unknown, max: number, optional = false): string | undefined {
  if (typeof value !== "string") return optional ? undefined : "";
  const cleaned = value.replace(/\s+/g, " ").trim().slice(0, max);
  return cleaned || (optional ? undefined : "");
}

