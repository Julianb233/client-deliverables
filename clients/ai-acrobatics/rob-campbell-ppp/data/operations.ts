import { workspaceAgentProfiles } from "./workspace";

export const portalStandardStatus = [
  {
    label: "Portal assistant",
    status: "blocked-by-backend",
    detail: "UI is present, but live Convex request/feed behavior remains blocked by AI-10564 until the configured deployment exposes the PPP portal functions.",
  },
  {
    label: "Meeting notes",
    status: "review-gated",
    detail: "May 27 Fireflies notes are visible now. June 3 Fireflies is still missing from the connector, so the portal links the Drive onboarding brief and source index after Julian review.",
  },
  {
    label: "HubSpot inspection plan",
    status: "review-gated",
    detail: "Agents have a read-only checklist for access proof, object inventory, data segmentation, field hygiene, duplicate/stale records, workflow risk, integrations, and reporting readiness.",
  },
  {
    label: "Linear routing",
    status: "partial",
    detail: "Linear project routing is configured, but production request flow is not considered live until the Convex portal backend passes verification.",
  },
  {
    label: "Internal notifications",
    status: "partial",
    detail: "Notification env is part of the required stack, but request/upsell notification proof waits on the Convex backend repair and production smoke test.",
  },
  {
    label: "Convex portal data",
    status: "blocked",
    detail: "AI-10564: the configured Convex URL does not expose portalClients, portalFeed, portalActionItems, portalChangelog, portalMessages, portalUpsellOffers, or portalUpsellIntents functions.",
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
  lastRun: agent.status.includes("active") ? "2026-06-21" : agent.status.includes("ready") ? "Ready after review" : "Staged",
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
