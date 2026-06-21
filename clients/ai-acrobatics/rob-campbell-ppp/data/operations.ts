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

export const agentRunStatuses = [
  {
    name: "rob-chief-of-staff",
    role: "Orchestrates Rob's workspace, keeps source map current, and decides which swarm should run next.",
    status: "active",
    lastRun: "2026-06-21",
    nextRun: "Coordinate workspace review, HubSpot access, retainer choice, and next swarm selection",
    evidence: "Hermes workspace, PPP source map, Linear AI-10321 and AI-10493",
  },
  {
    name: "signal-radar-agent",
    role: "Tracks public employer, liquidity, and equity-event signals for prospecting context.",
    status: "ready",
    lastRun: "Dry-run scope prepared",
    nextRun: "After target employer list review",
    evidence: "Game plan: Public signal radar",
  },
  {
    name: "compliance-boundary-agent",
    role: "Reviews all Rob-facing outputs before external use and blocks regulated advice or client-data handling.",
    status: "active",
    lastRun: "Boundary applied to PPP and follow-up copy",
    nextRun: "Before any workspace recommendation, retainer recommendation, or outbound client reply",
    evidence: "Compliance boundary docs and financial-services copy rules",
  },
  {
    name: "hubspot-hygiene-agent",
    role: "Audits HubSpot stages, stale contacts, duplicate patterns, and manual handoff points.",
    status: "active",
    lastRun: "Read-only aggregate audit started",
    nextRun: "Map Rob's June 17 pipeline rundown against approved read-only HubSpot data",
    evidence: "Drive HubSpot inspection plan, June 17 pipeline rundown, and Linear AI-10493",
  },
  {
    name: "prospect-brief-agent",
    role: "Turns public information into short prep briefs and recommended first-meeting questions.",
    status: "ready",
    lastRun: "Template prepared",
    nextRun: "After first public signal queue item",
    evidence: "Prospect brief template and compliance boundary",
  },
  {
    name: "hearsay-content-agent",
    role: "Drafts Hearsay-ready content for manual approval, not direct publishing.",
    status: "review-gated",
    lastRun: "Scope mapped",
    nextRun: "After compliance language confirmation",
    evidence: "No external sends without approval",
  },
  {
    name: "retainer-ops-agent",
    role: "Tracks monthly deliverables, credits, dev hours, consulting hours, blockers, and recommendations.",
    status: "active",
    lastRun: "Retainer ladder defined",
    nextRun: "After Rob chooses Operator, Growth, or Build Partner",
    evidence: "Billing page and retainer operations table",
  },
  {
    name: "reporting-agent",
    role: "Produces daily, weekly, and monthly proof reports with blockers, usage, and next recommendations.",
    status: "ready",
    lastRun: "Report templates prepared",
    nextRun: "After first workspace review, HubSpot read-only update, or signal run",
    evidence: "Daily, weekly, and monthly report templates",
  },
];

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
