import { workspaceAgentProfiles } from "./workspace";

export const portalStandardStatus = [
  {
    label: "Portal assistant",
    status: "production-convex",
    detail: "Requests, submitted ideas, feed records, and upsell intents route through server APIs to the production Convex deployment and then to Linear or checkout handling.",
  },
  {
    label: "Meeting notes",
    status: "review-gated",
    detail: "The July 16 Fireflies meeting was reviewed and translated into the live game plan, workflows, blockers, task owners, and next actions.",
  },
  {
    label: "HubSpot inspection plan",
    status: "review-gated",
    detail: "HubSpot is connected in aggregate read-only mode; the first visible workflow is the follow-up call queue, with record-level data and mutations blocked pending approval.",
  },
  {
    label: "Linear routing",
    status: "active",
    detail: "The Rob project is the internal work router for implementation evidence, access blockers, and client-submitted portal requests.",
  },
  {
    label: "Internal notifications",
    status: "review-gated",
    detail: "Portal requests and interest are stored and routed internally; no client-facing reply or outbound message is sent automatically.",
  },
  {
    label: "Convex portal data",
    status: "production",
    detail: "The PPP targets graceful-snake-473 and uses the standard portalClients, portalFeed, portalActionItems, portalChangelog, portalMessages, portalUpsellOffers, and portalUpsellIntents interfaces.",
  },
  {
    label: "Outbound client sends",
    status: "blocked-by-review",
    detail: "No automatic email, text, social, or custom pricing response is sent from the portal without Julian approval.",
  },
];

export const agentRunStatuses = workspaceAgentProfiles.map((agent) => ({
  name: agent.name,
  role: agent.profile,
  status: agent.status,
  lastRun: agent.status.includes("active") || agent.status.includes("live") ? "2026-07-16" : agent.status.includes("ready") ? "Ready after review" : "Staged",
  nextRun: agent.next,
  evidence: agent.evidence,
}));

export const retainerOperations = [
  {
    tier: "Operator",
    price: "$1,500/mo",
    cadence: "Monthly report plus light monitoring",
    includes: ["Agent monitoring", "AI credit allowance", "Light HubSpot hygiene", "Monthly value report"],
    bestFor: "Keeping the engine alive after the initial build without heavy weekly iteration.",
  },
  {
    tier: "Growth",
    price: "$2,500/mo",
    cadence: "Weekly signal review plus monthly report",
    includes: ["Operator coverage", "Weekly signal queue review", "More dev or consulting time", "Content/template refreshes"],
    bestFor: "When Rob wants the prospect engine tuned and expanded as new signals appear.",
  },
  {
    tier: "Build Partner",
    price: "$4,500/mo",
    cadence: "Priority build and optimization loop",
    includes: ["Growth coverage", "Advanced experiments", "Priority response", "Quarterly strategy", "Deeper workflow iteration"],
    bestFor: "When the engine becomes a core operating system and needs faster experiments.",
  },
];

export const meetingSyncPipeline = [
  "Agent checks Fireflies first, then Google Drive if the transcript is missing.",
  "Agent pulls or receives the meeting summary and writes an internal review packet.",
  "Julian-reviewed summary is published to the PPP through /api/meeting-sync or a source-map update.",
  "Portal feed and changelog update from Convex so Rob sees what changed.",
  "Any action item creates or updates a Linear task before it becomes client-facing work.",
];
