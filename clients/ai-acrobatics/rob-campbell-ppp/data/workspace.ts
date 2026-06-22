export const workspaceAccess = {
  reviewUrl: "/workspace",
  loginUrl: "/login",
  reviewCodeLabel: "Workspace review code",
  softGateNote:
    "This is a review gate for Rob's planning workspace, not a banking-grade auth system. Production request routing and sensitive access still stay behind Julian approval.",
};

export const robProfile = {
  name: "Rob Campbell",
  title: "AI Prospect Engine Workspace",
  practiceContext: "Northwestern Mutual practice",
  preferredEmail: "Robert.t.campbell5@gmail.com",
  currentStage: "Build + Integrate",
  statusSummary:
    "Deposit is received, the Hermes agency is deployed internally, and Rob can now review the focused agent workspace, the eight requested agent profiles, operating lanes, and remaining access decisions.",
  currentSources: [
    "May 27 Fireflies transcript 01KSNC02C1EBXF56962CH63MFR",
    "June 17 Fireflies recap 01KVBJBJBYBZEBK3ABW37HM4YF",
    "Rob's June 17 HubSpot pipeline rundown email",
    "Optimus Brain source email 19eae47eadba2903 archived as internal reference only",
    "Hermes agency manifest config/hermes-agency.yaml",
    "AI Acrobatics proposal and payment links",
  ],
};

export const workspaceSystems = [
  {
    name: "Hermes agency",
    status: "deployed internally",
    clientMeaning: "The operating brain for Rob's agents, source maps, skills, swarms, and compliance rules.",
    proof: "Focused Rob plan now shows 8 requested agents, 5 swarms, 7 core skills, compliance smoke, and Agent OS HTTP 200.",
  },
  {
    name: "PPP workspace",
    status: "client-facing review",
    clientMeaning: "The URL Rob can open to review his profile, agents, game plans, requests, billing, and workspace design.",
    proof: "This portal hosts the Rob profile and agent review surface.",
  },
  {
    name: "Agent OS dashboard",
    status: "internal preview",
    clientMeaning: "A visual dashboard shell from the source package. Useful for inspiration, but not the source of truth.",
    proof: "Internal port 3742 is live through a tmux runner; not exposed as the Rob login surface.",
  },
  {
    name: "HubSpot access",
    status: "read-only active",
    clientMeaning: "Agents can reason from approved HubSpot audit data, but no writes or workflow changes happen without approval.",
    proof: "Current mode is read-only audit with write scope blocked.",
  },
];

export type WorkspaceAgentProfile = {
  name: string;
  displayName: string;
  status: string;
  department: string;
  profile: string;
  summary: string;
  next: string;
  evidence: string;
};

export const workspaceAgentProfiles: WorkspaceAgentProfile[] = [
  {
    name: "rob-chief-of-staff",
    displayName: "Chief of Staff",
    status: "active",
    department: "Control Tower",
    profile: "Orchestrates Rob's AI Prospect Engine, source map, Linear updates, reports, and swarm selection.",
    summary: "Keeps the whole operating plan coherent and decides which specialist agent should run next.",
    next: "Coordinate workspace review, HubSpot access, retainer selection, and next swarm selection.",
    evidence: "Hermes agency manifest, source map, Linear AI-10321.",
  },
  {
    name: "compliance-boundary-agent",
    displayName: "Compliance Boundary",
    status: "active",
    department: "Control Tower",
    profile: "Blocks prohibited actions before they reach Rob, prospects, HubSpot, Hearsay, Dynamics, or NMIS.",
    summary: "Reviews all Rob-facing outputs and stops client-data, advice, suitability, and unapproved-send risks.",
    next: "Review every client-facing summary, content draft, retainer recommendation, and external message before use.",
    evidence: "Compliance smoke passed across blocked and allowed cases.",
  },
  {
    name: "signal-radar-agent",
    displayName: "Signal Radar",
    status: "ready",
    department: "Prospecting Engine",
    profile: "Monitors public employer, liquidity, equity, hiring, and executive-move signals.",
    summary: "Builds a public-data signal queue for Rob's manual review.",
    next: "Run after Rob confirms priority employers and signal types.",
    evidence: "Daily signal swarm and target employer data.",
  },
  {
    name: "prospect-brief-agent",
    displayName: "Prospect Brief",
    status: "ready",
    department: "Prospecting Engine",
    profile: "Turns approved public context into concise first-meeting briefs and recommended questions.",
    summary: "Gives Rob clean prep notes without making investment, product, or suitability claims.",
    next: "Draft first brief after a public signal item is approved.",
    evidence: "Prospect brief template and compliance boundary.",
  },
  {
    name: "hubspot-hygiene-agent",
    displayName: "HubSpot Hygiene",
    status: "active read-only",
    department: "CRM + Workflow",
    profile: "Audits pipeline stages, stale contacts, missing owner/status fields, duplicates, and manual handoff points.",
    summary: "Improves the operating picture from approved HubSpot data without writing to HubSpot.",
    next: "Continue aggregate read-only audit and map June 17 pipeline rundown.",
    evidence: "HubSpot inspection plan, read-only audit artifacts, Linear AI-10493.",
  },
  {
    name: "hearsay-content-agent",
    displayName: "Hearsay Content",
    status: "review gated",
    department: "Content + Visibility",
    profile: "Drafts general educational content for Hearsay/manual review.",
    summary: "Creates safe content drafts without direct publishing.",
    next: "Draft only after Rob/Julian approve themes and compliance language.",
    evidence: "Hearsay content template and no-external-send rule.",
  },
  {
    name: "retainer-ops-agent",
    displayName: "Retainer Ops",
    status: "decision needed",
    department: "Operations + Reporting",
    profile: "Tracks monthly deliverables, AI credits, dev hours, consulting hours, blockers, and tier usage.",
    summary: "Connects the monthly retainer to visible value and operating cadence.",
    next: "Run after Rob chooses Operator, Growth, or Build Partner.",
    evidence: "Retainer tiers and monthly report template.",
  },
  {
    name: "reporting-agent",
    displayName: "Reporting",
    status: "ready",
    department: "Operations + Reporting",
    profile: "Creates daily, weekly, and monthly summaries with proof, blockers, usage, and next recommendations.",
    summary: "Turns agent work into reports Rob and Julian can review.",
    next: "Report after workspace review, HubSpot audit update, or signal run.",
    evidence: "Daily, weekly, and monthly report templates.",
  },
];

export const workspaceAgentGroups = [
  {
    group: "Control Tower",
    purpose: "Keeps the plan coherent, tracks evidence, and applies the compliance boundary.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "Control Tower"),
  },
  {
    group: "Prospecting Engine",
    purpose: "Turns public signals and approved CRM context into reviewable prospecting support.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "Prospecting Engine"),
  },
  {
    group: "CRM + Workflow",
    purpose: "Cleans up the operating picture around HubSpot, handoffs, metrics, and reporting without unsafe writes.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "CRM + Workflow"),
  },
  {
    group: "Content + Visibility",
    purpose: "Creates review-ready content ideas and educational themes with compliance review before use.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "Content + Visibility"),
  },
  {
    group: "Operations + Reporting",
    purpose: "Keeps the monthly operating model, SOPs, usage, and reports clear.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "Operations + Reporting"),
  },
];

export const workspaceDesignQuestions = [
  "Which agent names and roles feel right for Rob's practice?",
  "Which HubSpot stages should be visible in the client portal versus internal only?",
  "Which public signals should matter most: employer growth, equity events, hiring moves, liquidity events, or warm introductions?",
  "Which retainer tier should become the operating default after the initial build?",
  "What should Rob see weekly so the system feels useful without exposing sensitive client records?",
];

export const workspaceRoadmap = [
  {
    stage: "Diagnose + Roadmap",
    status: "complete",
    items: ["proposal", "deposit", "source map", "Hermes profile", "compliance boundary"],
  },
  {
    stage: "Build + Integrate",
    status: "active",
    items: ["Hermes agency deployed", "focused agent roster review", "HubSpot read-only audit", "tool access matrix", "public-signal dry run"],
  },
  {
    stage: "Operate + Optimize",
    status: "planned",
    items: ["retainer reporting", "weekly signal cadence", "usage tracking", "next system recommendations"],
  },
];
