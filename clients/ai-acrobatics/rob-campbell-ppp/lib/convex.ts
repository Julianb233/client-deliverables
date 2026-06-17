import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { actionItems as staticActionItems } from "../data/action-items";
import { changelog as staticChangelog } from "../data/changelog";
import { wizardServiceOffers } from "../data/wizard-services";
import { DEFAULT_CONVEX_URL, PORTAL_CLIENT_SLUG } from "./portal-config";
import { isClientVisiblePortalRecord } from "./portal-visibility";

type ConvexClient = {
  name?: string;
  ppp_url?: string;
  deployed_url?: string;
  fanbasis_payment_url?: string;
  linear_project_id?: string;
  health_score?: number;
  onboarding_status?: string;
  metadata?: {
    paymentStatus?: string;
    depositAmount?: number;
    depositReceived?: boolean;
    complianceGuardrails?: string[];
    dataSource?: string;
    syncedAt?: string;
  };
};

type ConvexFeedItem = {
  _id?: string;
  type: string;
  title: string;
  body?: string;
  url?: string;
  agent?: string;
  createdAt: number;
};

type ConvexActionItem = {
  _id?: string;
  linearIssueId: string;
  title: string;
  why?: string;
  howTo?: string;
  impact?: string;
  estimatedTime?: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "waiting" | "resolved";
  linearUrl?: string;
  createdAt: number;
  updatedAt: number;
};

type ConvexChangelogItem = {
  _id?: string;
  title: string;
  description?: string;
  category: string;
  items?: string[];
  deployUrl?: string;
  agent?: string;
  createdAt: number;
};

type ConvexMessage = {
  _id?: string;
  category: "suggestion" | "improvement" | "idea" | "bug" | "question";
  topic: string;
  message: string;
  page?: string;
  priority: "low" | "medium" | "high";
  status: "submitted" | "reviewing" | "converted_to_task" | "closed";
  linearIssueId?: string;
  linearUrl?: string;
  createdAt: number;
};

type ConvexUpsellOffer = {
  _id?: string;
  offerSlug: string;
  title: string;
  category: "growth-agent" | "support-agent" | "operations" | "content-visibility" | "data-reporting" | "retainer" | "custom";
  outcome: string;
  whyItFits: string;
  setupEstimate?: string;
  priceLabel?: string;
  checkoutUrl?: string;
  requestOnly?: boolean;
  status: "recommended" | "available" | "active" | "hidden";
  sortOrder?: number;
};

type ConvexUpsellIntent = {
  _id?: string;
  offerSlug: string;
  title: string;
  intentType: "checkout" | "request" | "learn_more";
  note?: string;
  status: "submitted" | "checkout_returned" | "review_required" | "converted_to_task" | "closed";
  checkoutUrl?: string;
  linearIssueId?: string;
  linearUrl?: string;
  createdAt: number;
};

export type PortalRuntimeData = {
  source: "convex" | "static-fallback";
  client: ConvexClient | null;
  feed: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    source: string;
    url?: string;
  }>;
  actionItems: Array<{
    id: string;
    title: string;
    description: string;
    status: "pending" | "submitted" | "approved" | "overdue";
    type: "brand-assets" | "copy-approval" | "credentials" | "content-review" | "information" | "document-signing" | "payment" | "feedback";
    priority: "high" | "medium" | "low";
    createdAt: string;
    dueDate?: string;
    instructions: string[];
    url?: string;
  }>;
  changelog: Array<{
    date: string;
    title: string;
    description: string;
    type: string;
  }>;
  messages: Array<{
    id: string;
    date: string;
    category: string;
    topic: string;
    message: string;
    status: string;
    priority: string;
    linearUrl?: string;
  }>;
  upsellOffers: Array<{
    id: string;
    offerSlug: string;
    title: string;
    category: string;
    outcome: string;
    whyItFits: string;
    setupEstimate?: string;
    priceLabel?: string;
    checkoutUrl?: string;
    requestOnly?: boolean;
    status: string;
    sortOrder: number;
  }>;
  upsellIntents: Array<{
    id: string;
    date: string;
    offerSlug: string;
    title: string;
    intentType: string;
    status: string;
    checkoutUrl?: string;
    linearUrl?: string;
  }>;
  lastSyncedLabel: string;
};

export async function getPortalRuntimeData(): Promise<PortalRuntimeData> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || DEFAULT_CONVEX_URL;

  try {
    const client = new ConvexHttpClient(convexUrl);
    const [portalClient, feed, actions, changelog, messages, offers, intents] = await Promise.all([
      client.query(makeFunctionReference<"query">("tenants:getBySlug"), { slug: PORTAL_CLIENT_SLUG }) as Promise<ConvexClient | null>,
      client.query(makeFunctionReference<"query">("feedEntries:listForTenant"), { tenantSlug: PORTAL_CLIENT_SLUG, limit: 50 }) as Promise<ConvexFeedItem[]>,
      client.query(makeFunctionReference<"query">("actionItems:listForTenant"), { tenantSlug: PORTAL_CLIENT_SLUG }) as Promise<ConvexActionItem[]>,
      client.query(makeFunctionReference<"query">("changelog:listForTenant"), { tenantSlug: PORTAL_CLIENT_SLUG, limit: 50 }) as Promise<ConvexChangelogItem[]>,
      client.query(makeFunctionReference<"query">("portalMessages:listForClient"), { clientSlug: PORTAL_CLIENT_SLUG, limit: 25 }) as Promise<ConvexMessage[]>,
      client.query(makeFunctionReference<"query">("portalUpsellOffers:listForClient"), { clientSlug: PORTAL_CLIENT_SLUG }) as Promise<ConvexUpsellOffer[]>,
      client.query(makeFunctionReference<"query">("portalUpsellIntents:listForClient"), { clientSlug: PORTAL_CLIENT_SLUG, limit: 25 }) as Promise<ConvexUpsellIntent[]>,
    ]);

    return {
      source: "convex",
      client: portalClient,
      feed: feed.filter(isVisiblePortalFeedItem).map(mapConvexFeedItem),
      actionItems: actions.length > 0 ? actions.map(mapConvexActionItem) : staticActionItems,
      changelog: changelog.length > 0 ? changelog.map(mapConvexChangelogItem) : staticChangelog,
      messages: messages.filter(isVisiblePortalMessage).map(mapConvexMessage),
      upsellOffers: offers.length > 0 ? offers.map(mapConvexUpsellOffer) : wizardServiceOffers.map(mapStaticUpsellOffer),
      upsellIntents: intents.filter(isVisibleUpsellIntent).map(mapConvexUpsellIntent),
      lastSyncedLabel: latestTimestampLabel([
        ...((feed ?? []).filter(isVisiblePortalFeedItem)),
        ...(actions ?? []),
        ...(changelog ?? []),
        ...((messages ?? []).filter(isVisiblePortalMessage)),
        ...((intents ?? []).filter(isVisibleUpsellIntent)),
      ]),
    };
  } catch (error) {
    console.warn("[rob-ppp] Convex unavailable; using static fallback", error);
    return {
      source: "static-fallback",
      client: null,
      feed: [],
      actionItems: staticActionItems,
      changelog: staticChangelog,
      messages: [],
      upsellOffers: wizardServiceOffers.map(mapStaticUpsellOffer),
      upsellIntents: [],
      lastSyncedLabel: "Static fallback",
    };
  }
}

function mapConvexFeedItem(item: ConvexFeedItem): PortalRuntimeData["feed"][number] {
  return {
    id: item._id ?? `${item.createdAt}-${item.title}`,
    date: toDate(item.createdAt),
    title: item.title,
    description: item.body ?? "Portal activity synced from Convex.",
    source: item.agent ? `Convex · ${item.agent}` : "Convex portal feed",
    url: item.url,
  };
}

function isVisiblePortalFeedItem(item: ConvexFeedItem) {
  if (item.title.toLowerCase().startsWith("checkout opened:")) return false;
  return isClientVisiblePortalRecord([item.title, item.body, item.url, item.agent]);
}

function isVisiblePortalMessage(item: ConvexMessage) {
  return isClientVisiblePortalRecord([item.topic, item.message, item.page, item.linearIssueId, item.linearUrl]);
}

function isVisibleUpsellIntent(item: ConvexUpsellIntent) {
  return isClientVisiblePortalRecord([item.title, item.note, item.offerSlug, item.linearIssueId, item.linearUrl]);
}

function mapConvexActionItem(item: ConvexActionItem): PortalRuntimeData["actionItems"][number] {
  return {
    id: item.linearIssueId,
    title: item.title,
    description: item.why ?? item.impact ?? "Client action item from Convex.",
    status: item.status === "resolved" ? "approved" : item.status === "in_progress" ? "submitted" : "pending",
    type: inferActionType(item.title),
    priority: item.priority === "critical" ? "high" : item.priority,
    createdAt: toDate(item.createdAt),
    instructions: splitInstructions(item.howTo),
    url: item.linearUrl,
  };
}

function mapConvexChangelogItem(item: ConvexChangelogItem): PortalRuntimeData["changelog"][number] {
  return {
    date: toDate(item.createdAt),
    title: item.title,
    description: item.description ?? item.items?.join(" ") ?? "Portal activity synced from Convex.",
    type: item.category,
  };
}

function mapConvexMessage(item: ConvexMessage): PortalRuntimeData["messages"][number] {
  return {
    id: item._id ?? `${item.createdAt}-${item.topic}`,
    date: toDate(item.createdAt),
    category: item.category,
    topic: item.topic,
    message: item.message,
    priority: item.priority,
    status: item.status,
    linearUrl: item.linearUrl,
  };
}

function mapConvexUpsellOffer(item: ConvexUpsellOffer): PortalRuntimeData["upsellOffers"][number] {
  return {
    id: item._id ?? item.offerSlug,
    offerSlug: item.offerSlug,
    title: item.title,
    category: item.category,
    outcome: item.outcome,
    whyItFits: item.whyItFits,
    setupEstimate: item.setupEstimate,
    priceLabel: item.priceLabel,
    checkoutUrl: item.checkoutUrl,
    requestOnly: item.requestOnly,
    status: item.status,
    sortOrder: item.sortOrder ?? 999,
  };
}

function mapStaticUpsellOffer(item: typeof wizardServiceOffers[number]): PortalRuntimeData["upsellOffers"][number] {
  return {
    id: item.offerSlug,
    offerSlug: item.offerSlug,
    title: item.title,
    category: item.category,
    outcome: item.outcome,
    whyItFits: item.whyItFits,
    setupEstimate: item.setupEstimate,
    priceLabel: item.priceLabel,
    checkoutUrl: item.checkoutUrl,
    requestOnly: item.requestOnly,
    status: item.status,
    sortOrder: item.sortOrder,
  };
}

function mapConvexUpsellIntent(item: ConvexUpsellIntent): PortalRuntimeData["upsellIntents"][number] {
  return {
    id: item._id ?? `${item.createdAt}-${item.offerSlug}`,
    date: toDate(item.createdAt),
    offerSlug: item.offerSlug,
    title: item.title,
    intentType: item.intentType,
    status: item.status,
    checkoutUrl: item.checkoutUrl,
    linearUrl: item.linearUrl,
  };
}

function inferActionType(title: string): PortalRuntimeData["actionItems"][number]["type"] {
  const normalized = title.toLowerCase();
  if (normalized.includes("hubspot") || normalized.includes("access")) return "credentials";
  if (normalized.includes("retainer") || normalized.includes("payment")) return "payment";
  if (normalized.includes("compliance") || normalized.includes("approve")) return "content-review";
  return "information";
}

function splitInstructions(value?: string): string[] {
  if (!value) return ["Review the request.", "Reply to Julian with the needed update."];
  return value
    .split(/\n+|;\s*/)
    .map((step) => step.replace(/^[-*\d.]+\s*/, "").trim())
    .filter(Boolean);
}

function latestTimestampLabel(items: Array<{ createdAt?: number; updatedAt?: number }>): string {
  const latest = Math.max(0, ...items.flatMap((item) => [item.createdAt ?? 0, item.updatedAt ?? 0]));
  return latest ? `Convex live · ${toDate(latest)}` : "Convex live · no rows yet";
}

function toDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}
