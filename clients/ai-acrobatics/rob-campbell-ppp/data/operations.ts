export const portalStandardStatus = [
  {
    label: "Portal assistant",
    status: "live",
    detail: "Text, image metadata, and short voice notes route through /api/client-message into Convex portalMessages, Linear, and portalFeed.",
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
    status: "live",
    detail: "Client ideas, blockers, questions, and custom upsell requests create Linear issues in the Rob project when LINEAR_API_KEY and LINEAR_PROJECT_ID are configured.",
  },
  {
    label: "Internal notifications",
    status: "live",
    detail: "Client messages and upsell intent events send Julian an internal Telegram alert when PORTAL_NOTIFY_TELEGRAM_BOT_TOKEN and PORTAL_NOTIFY_TELEGRAM_CHAT_ID are configured.",
  },
  {
    label: "Convex portal data",
    status: "live",
    detail: "The portal reads portalClients, portalFeed, portalActionItems, portalChangelog, portalMessages, portalUpsellOffers, and portalUpsellIntents.",
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
    lastRun: "2026-05-30",
    nextRun: "After HubSpot access or new meeting notes",
    evidence: "Hermes workspace, PPP source map, Linear AI-10321",
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
    name: "hubspot-hygiene-agent",
    role: "Audits HubSpot stages, stale contacts, duplicate patterns, and manual handoff points.",
    status: "blocked",
    lastRun: "Not run against live HubSpot",
    nextRun: "After Rob resends or confirms the HubSpot invite to julian@aiacrobatics.com",
    evidence: "Drive HubSpot inspection plan and Linear AI-10493",
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
    status: "ready",
    lastRun: "Retainer ladder defined",
    nextRun: "At first active retainer month",
    evidence: "Billing page and retainer operations table",
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
