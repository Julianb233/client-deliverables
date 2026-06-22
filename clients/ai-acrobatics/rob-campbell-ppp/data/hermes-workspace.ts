export const hermesWorkspaceOverview = {
  title: "Rob Campbell Hermes Agency Workspace",
  subtitle: "AI Prospect Engine command center",
  profile: "rob-campbell",
  workspace: "rob-campbell-ai-prospect-engine",
  status: "deployed ready internal",
  mode: "AI Acrobatics operated",
  clientSurface: "review gated",
  summary:
    "This is the Rob-facing map of the actual Hermes agency: profile, workspace, agents, swarms, skills, public-signal search plan, runtime proof, and approval gates.",
  proof:
    "Agency canary passed with 22 agents, 5 operating swarms, 7 core skills, compliance smoke, and Agent OS HTTP 200.",
};

export const hermesWorkspaceStats = [
  { label: "Hermes profile", value: "rob-campbell", detail: "Client-specific profile" },
  { label: "Agents", value: "22", detail: "Optimus-adapted roster" },
  { label: "Swarms", value: "5", detail: "Operating dispatch lanes" },
  { label: "Skills", value: "7", detail: "Workspace-local instructions" },
  { label: "Runtime", value: "ready", detail: "Internal agency canary passed" },
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
    value: "private internal runtime",
    status: "internal only",
    description: "Visual shell and private runner for Rob's Agent OS source package. Not exposed as Rob's public login.",
    evidence: "http://127.0.0.1:3742/ returned 200 in internal verification.",
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
    name: "meeting-prep-swarm",
    status: "ready",
    trigger: "New Rob meeting, new availability, or fresh Fireflies/Fathom recap.",
    purpose: "Prepare Rob for prospect or project meetings from approved public context.",
    agents: ["rob-chief-of-staff", "compliance-boundary-agent", "retainer-ops-agent", "reporting-agent", "meeting-intelligence-agent"],
    flow: ["Confirm meeting context", "Draft concise brief", "Add non-advice questions", "Mark manual review status"],
    output: "Meeting prep brief and reviewed next-action list",
  },
  {
    name: "weekly-hubspot-swarm",
    status: "active read-only",
    trigger: "HubSpot access and read-only scope are confirmed.",
    purpose: "Audit HubSpot hygiene and identify safe next actions.",
    agents: ["hubspot-hygiene-agent", "compliance-boundary-agent", "reporting-agent", "access-security-agent"],
    flow: ["Confirm access mode", "Run aggregate checks", "Review stages and stale fields", "Produce manual next-action list"],
    output: "Weekly pipeline report and HubSpot hygiene map",
  },
  {
    name: "daily-signal-swarm",
    status: "ready after target review",
    trigger: "Rob approves target employers or Julian requests a public-data dry run.",
    purpose: "Turn public market/employer signals into a manual-review prospect queue.",
    agents: ["signal-radar-agent", "prospect-brief-agent", "compliance-boundary-agent", "reporting-agent"],
    flow: ["Collect public signal", "Normalize event", "Score relevance safely", "Draft brief", "Run compliance review"],
    output: "Signal event, scored queue item, prospect brief, and daily signal report",
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
  {
    name: "monthly-retainer-swarm",
    status: "waiting on retainer selection",
    trigger: "Rob chooses Operator, Growth, or Build Partner retainer.",
    purpose: "Summarize value delivered, usage, hours, credits, and next recommendations.",
    agents: ["retainer-ops-agent", "reporting-agent", "rob-chief-of-staff", "compliance-boundary-agent"],
    flow: ["Collect evidence", "Separate credits and hours", "Map to tier", "Generate report"],
    output: "Monthly retainer report and usage/value breakdown",
  },
];

export const hermesSkills = [
  {
    name: "rob-compliance-boundary",
    lane: "Safety",
    purpose: "Defines NWM/NMIS/Dynamics/Hearsay-safe behavior and blocked actions.",
  },
  {
    name: "tech-equity-signal-research",
    lane: "Research",
    purpose: "Finds public employer, equity, liquidity, hiring, funding, and market signals.",
  },
  {
    name: "hubspot-prospect-queue",
    lane: "CRM",
    purpose: "Shapes read-only HubSpot hygiene findings into a manual review queue.",
  },
  {
    name: "employer-brief-generation",
    lane: "Meeting prep",
    purpose: "Turns approved employer and public-signal context into concise briefs.",
  },
  {
    name: "hearsay-ready-content",
    lane: "Content",
    purpose: "Drafts educational content for later Hearsay/manual review.",
  },
  {
    name: "safe-financial-services-copy",
    lane: "Copy",
    purpose: "Keeps language educational and non-advice.",
  },
  {
    name: "retainer-usage-reporting",
    lane: "Operations",
    purpose: "Tracks deliverables, credits, development hours, consulting hours, and tier usage.",
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
  "config/hermes-agency.yaml records status deployed_ready_internal.",
  "scripts/agency-canary.sh passed for required agents, swarms, skills, compliance smoke, profile cwd, and Agent OS root route.",
  "reports/hermes-agency-deploy-report-2026-06-21.md documents deployment evidence.",
  "HubSpot is read-only audit mode; workflow endpoint requires more scope before workflow inspection.",
  "PPP Convex request/chat/upsell remains partial until AI-10564 repairs the aa-portals function surface.",
];

export const hermesApprovalGates = [
  "Rob can review the agency workspace, but cannot directly trigger external sends from this page.",
  "No Dynamics writes, NMIS writes, client-record ingestion, or AI-generated investment/product advice.",
  "HubSpot writes, merges, sequences, workflow activations, and enrichment actions require explicit scope approval.",
  "Hearsay, social, email, SMS, and client/prospect-facing content require Julian/human review before use.",
  "The search plan is public-signal-first and must stay on employer/company context, not private financial inference.",
];
