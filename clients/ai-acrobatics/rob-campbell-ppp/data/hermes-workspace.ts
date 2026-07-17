export const hermesWorkspaceOverview = {
  title: "Rob Campbell Hermes Agency Workspace",
  subtitle: "AI Prospect Engine command center",
  profile: "rob-campbell",
  workspace: "rob-campbell-ai-prospect-engine",
  status: "live on dedicated Hetzner server",
  mode: "AI Acrobatics operated",
  clientSurface: "authenticated live command center",
  summary:
    "This is the Rob-facing map of the live Hermes agency: 12 business-role agents, 7 active swarms, 12 configured skills, public-signal research, HubSpot aggregate status, current Fireflies decisions, and approval gates.",
  proof:
    "The public authenticated workspace passed desktop and 390 px mobile checks; Rob and Stephanie login canaries, agent chat, HubSpot aggregate status, private report intake, and compliance rejection tests passed.",
};

export const hermesWorkspaceStats = [
  { label: "Hermes profile", value: "rob-campbell", detail: "Client-specific profile" },
  { label: "Agents", value: "12", detail: "Client-visible business roles" },
  { label: "Swarms", value: "7", detail: "Active operating dispatch lanes" },
  { label: "Skills", value: "12", detail: "Configured workspace instructions" },
  { label: "Runtime", value: "live", detail: "Hetzner production canary passed" },
  { label: "Review gate", value: "on", detail: "No external sends without Julian" },
];

export const hermesTopology = [
  {
    name: "Hermes Profile",
    value: "rob-campbell",
    status: "ready",
    description: "Profile identity, memory routing, source-map rules, and Rob-specific runtime defaults.",
    evidence: "/Users/julianbradley/.hermes/profiles/rob-campbell",
  },
  {
    name: "Hermes Workspace",
    value: "rob-campbell-ai-prospect-engine",
    status: "deployed",
    description: "Agents, swarms, skills, data artifacts, runbooks, compliance boundary, and source map.",
    evidence: "/Users/julianbradley/.hermes/workspaces/rob-campbell-ai-prospect-engine",
  },
  {
    name: "Agent OS",
    value: "rob.aiacrobatics.com/rob-os",
    status: "client live",
    description: "Authenticated role-agent command center served from Rob's dedicated Hetzner VPS through the existing access edge.",
    evidence: "Every public dashboard route returned 200 after authentication; direct origin requests returned 404.",
  },
  {
    name: "PPP Review Surface",
    value: "rob-campbell-ppp.vercel.app",
    status: "client visible",
    description: "The client-safe portal view where Rob can review the agency workspace, profiles, next actions, and proof.",
    evidence: "/login, /workspace, /agents, and /agency-workspace route checks.",
  },
];

export const hermesSwarmDispatch = [
  {
    name: "ceo-morning-brief-swarm",
    status: "ready to test",
    trigger: "Rob opens the Executive view or asks for the current operating picture.",
    purpose: "Consolidate priorities, activity, blockers, decisions, and next actions into one CEO brief.",
    agents: ["rob-chief-of-staff", "analytics-agent", "activity-metrics-agent", "compliance-boundary-agent"],
    flow: ["Collect approved aggregate state", "Rank priorities", "Review boundaries", "Publish dashboard brief"],
    output: "Morning brief, decision queue, and weekly game plan",
  },
  {
    name: "follow-up-call-swarm",
    status: "ready to test",
    trigger: "Rob requests the next HubSpot follow-up call queue.",
    purpose: "Prepare a prioritized prospect follow-up queue without changing HubSpot records.",
    agents: ["hubspot-hygiene-agent", "meeting-intelligence-agent", "compliance-boundary-agent"],
    flow: ["Confirm aggregate scope", "Identify follow-up criteria", "Prepare call context", "Human review"],
    output: "Reviewed follow-up call queue and call-prep checklist",
  },
  {
    name: "lead-response-swarm",
    status: "waiting on access",
    trigger: "LinkedIn and Meet Alfred are connected and a synthetic response canary passes.",
    purpose: "Classify inbound prospect replies, draft safe responses, and route qualified interest for review.",
    agents: ["lead-response-agent", "hubspot-hygiene-agent", "compliance-boundary-agent"],
    flow: ["Receive response", "Classify intent", "Draft reply", "Route to Stephanie and Rob"],
    output: "Response queue, reviewed reply draft, and booking handoff",
  },
  {
    name: "planning-report-swarm",
    status: "waiting on assets",
    trigger: "Rob's final HTML template, sample PDF, Claude skill, and approved inputs are present.",
    purpose: "Assemble a private annual-review report package with human review before release.",
    agents: ["planning-report-agent", "compliance-boundary-agent", "analytics-agent"],
    flow: ["Validate approved files", "Assemble template", "Check completeness", "Human release review"],
    output: "Private intake manifest, review package, and approved PDF",
  },
  {
    name: "meeting-intelligence-swarm",
    status: "live",
    trigger: "A new Fireflies meeting is available.",
    purpose: "Turn each meeting into decisions, owner-assigned tasks, game-plan updates, and follow-up gaps.",
    agents: ["meeting-intelligence-agent", "rob-chief-of-staff", "onboarding-concierge-agent", "compliance-boundary-agent"],
    flow: ["Review transcript", "Extract decisions", "Assign owners", "Update dashboard and PPP"],
    output: "Meeting game plan, decisions, tasks, and follow-up gaps",
  },
  {
    name: "weekly-hubspot-swarm",
    status: "active read-only",
    trigger: "The approved aggregate HubSpot audit cadence runs.",
    purpose: "Audit aggregate HubSpot hygiene and identify safe next actions.",
    agents: ["hubspot-hygiene-agent", "analytics-agent", "compliance-boundary-agent", "access-security-agent"],
    flow: ["Confirm access mode", "Run aggregate checks", "Review pipeline health", "Produce manual next-action list"],
    output: "Weekly pipeline report and HubSpot hygiene map",
  },
  {
    name: "content-swarm",
    status: "review gated",
    trigger: "Rob approves content themes and compliance language.",
    purpose: "Convert public themes into Hearsay-ready draft content.",
    agents: ["signal-radar-agent", "hearsay-content-agent", "compliance-boundary-agent"],
    flow: ["Select public theme", "Draft educational copy", "Review compliance", "Save Hearsay-ready draft"],
    output: "Educational content draft for Hearsay/manual review",
  },
];

export const hermesSkills = [
  {
    name: "rob-compliance-boundary",
    lane: "Safety",
    purpose: "Defines NWM/NMIS/Dynamics/Hearsay-safe behavior and blocked actions.",
  },
  {
    name: "qwm-ceo-dashboard",
    lane: "Executive",
    purpose: "Shapes aggregate operating state into Rob's customizable CEO dashboard.",
  },
  {
    name: "hubspot-follow-up-call-queue",
    lane: "CRM",
    purpose: "Prepares the aggregate read-only follow-up call workflow and review checklist.",
  },
  {
    name: "linkedin-meetalfred-response-intake",
    lane: "Lead response",
    purpose: "Classifies replies and routes reviewed drafts without automatic sending.",
  },
  {
    name: "planning-report-intake",
    lane: "Reports",
    purpose: "Stages approved planning files locally and enforces the human review package.",
  },
  {
    name: "composio-connection-audit",
    lane: "Integrations",
    purpose: "Checks approved read connections while blocking mutations by default.",
  },
  {
    name: "meeting-intelligence-summary",
    lane: "Meetings",
    purpose: "Turns Fireflies sessions into decisions, tasks, coaching notes, and game plans.",
  },
  {
    name: "daily-operator-reporting",
    lane: "Operations",
    purpose: "Produces daily and weekly proof, blocker, usage, and next-action summaries.",
  },
  {
    name: "safe-financial-services-copy",
    lane: "Copy",
    purpose: "Keeps language educational, non-advice, and ready for human review.",
  },
  {
    name: "tech-equity-signal-research",
    lane: "Research",
    purpose: "Finds public employer, equity, liquidity, hiring, funding, and market signals.",
  },
  {
    name: "hearsay-ready-content",
    lane: "Content",
    purpose: "Drafts educational content for later Hearsay/manual review.",
  },
  {
    name: "access-security-tool-matrix",
    lane: "Security",
    purpose: "Maintains connection state, secure credential routing, and data-flow controls.",
  },
];

export const publicSignalSearchPlan = {
  objective:
    "Find public prospect-side signals around San Diego technology employers without using NMIS, Dynamics, private client records, or AI suitability scoring.",
  highestPriorityTargets: ["Qualcomm", "Intuit", "ServiceNow", "Illumina", "ResMed", "Dexcom", "Teradata", "Viasat"],
  signalTypes: [
    "SEC filings and insider-sale/public equity events",
    "Hiring surges and San Diego office expansion",
    "Funding rounds, IPO rumors, acquisitions, and liquidity events",
    "Executive moves and public company announcements",
    "Local San Diego tech and biotech news",
    "Public compensation and equity-education themes",
  ],
  allowedSources: [
    "SEC EDGAR",
    "Google News and verified local news",
    "Built In San Diego",
    "Public LinkedIn company pages",
    "Crunchbase public pages",
    "Company career pages",
    "Levels.fyi and Glassdoor public pages",
  ],
  reviewGatedSources: ["LinkedIn Sales Navigator", "Company career pages at scale", "Reddit or anecdotal community signals"],
  excludedSources: ["NMIS", "Dynamics", "NWM internal systems", "Client referral lists", "Private client records", "Unapproved Apollo/ZoomInfo-style enrichment"],
};

export const hermesRuntimeProof = [
  "The July 16 agent-profile manifest exposes 12 business-role agents, 7 active swarms, and 12 configured skills.",
  "rob.aiacrobatics.com/rob-os passed authenticated desktop and 390 px mobile route checks.",
  "Rob and Stephanie login canaries passed through the existing seven-account access edge.",
  "HubSpot status returns aggregate counts only; record-level data and all mutations remain blocked.",
  "Agent chat rejected investment advice and private-account prompts before model execution.",
  "Private report intake passed file validation and restrictive permission checks without automatic AI ingestion.",
  "PPP runtime now targets graceful-snake-473 through the production portal interfaces.",
];

export const hermesApprovalGates = [
  "Rob can review the agency workspace, but cannot directly trigger external sends from this page.",
  "No Dynamics writes, NMIS writes, client-record ingestion, or AI-generated investment/product advice.",
  "HubSpot writes, merges, sequences, workflow activations, and enrichment actions require explicit scope approval.",
  "Hearsay, social, email, SMS, and client/prospect-facing content require Julian/human review before use.",
  "The search plan is public-signal-first and must stay on employer/company context, not private financial inference.",
];
