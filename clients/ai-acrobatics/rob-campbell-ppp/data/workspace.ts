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
    "The unified AI Practice Command Center is live from Rob's dedicated Hetzner server with 12 business-role agents, customizable views, HubSpot aggregate read-only status, current Fireflies decisions, tasks, integrations, report intake, activity tracking, and a team access guide.",
  currentSources: [
    "July 16 Fireflies transcript 01KXPCGQT9SK323AG80MQT7M7T",
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
    status: "live on dedicated server",
    clientMeaning: "The operating brain for Rob's agents, source maps, skills, swarms, and compliance rules.",
    proof: "Rob's Hetzner workspace exposes 12 role agents and 7 operating swarms through the authenticated command center.",
  },
  {
    name: "PPP workspace",
    status: "client-facing review",
    clientMeaning: "The URL Rob can open to review his profile, agents, game plans, requests, billing, and workspace design.",
    proof: "This portal hosts the Rob profile and agent review surface.",
  },
  {
    name: "Agent OS dashboard",
    status: "client live",
    clientMeaning: "The unified CEO and team workspace at rob.aiacrobatics.com/rob-os.",
    proof: "Desktop and 390 px mobile routes passed public authenticated checks; direct Hetzner origin access remains closed.",
  },
  {
    name: "HubSpot access",
    status: "read-only active",
    clientMeaning: "Agents can reason from approved HubSpot audit data, but no writes or workflow changes happen without approval.",
    proof: "12,320 aggregate contacts and 1,067 aggregate deals are available to the status layer; record-level data and writes remain blocked.",
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
    displayName: "OPTIMUS - Chief of Staff",
    status: "live",
    department: "Control Tower",
    profile: "Turns priorities into a daily operating plan and coordinates the rest of the agent team.",
    summary: "Runs morning briefs, agent routing, decision queues, and progress summaries.",
    next: "Coordinate the first call-queue review and the remaining access handoffs.",
    evidence: "Chief-of-staff profile and CEO morning brief swarm.",
  },
  {
    name: "compliance-boundary-agent",
    displayName: "SHIELD - Compliance Review",
    status: "live",
    department: "Control Tower",
    profile: "Blocks prohibited actions before they reach Rob, prospects, HubSpot, Hearsay, Dynamics, or NMIS.",
    summary: "Reviews all Rob-facing outputs and stops client-data, advice, suitability, and unapproved-send risks.",
    next: "Review every client-facing summary, content draft, retainer recommendation, and external message before use.",
    evidence: "Compliance smoke passed across blocked and allowed cases.",
  },
  {
    name: "access-security-agent",
    displayName: "SENTINEL - Access + Security",
    status: "live",
    department: "Control Tower",
    profile: "Maintains tool access, secure credential routing, server health, and data-flow controls.",
    summary: "Keeps the access matrix and risk register current without exposing secrets.",
    next: "Complete LinkedIn and Meet Alfred access, then plan per-person passwords.",
    evidence: "Hetzner origin restriction, authentication edge, and Composio write policy.",
  },
  {
    name: "hubspot-hygiene-agent",
    displayName: "ATLAS - Pipeline Operator",
    status: "live read-only",
    department: "Revenue + CRM",
    profile: "Audits HubSpot and prepares the follow-up call queue without changing records automatically.",
    summary: "Surfaces pipeline counts, stale follow-ups, call priorities, and stage-hygiene gaps.",
    next: "Prepare the first aggregate follow-up call queue for Rob's review.",
    evidence: "HubSpot aggregate status and follow-up-call swarm.",
  },
  {
    name: "lead-response-agent",
    displayName: "SCOUT - Lead Response Coordinator",
    status: "waiting on access",
    department: "Revenue + CRM",
    profile: "Coordinates Apollo, LinkedIn, and Meet Alfred responses into a reviewed prospect workflow.",
    summary: "Handles response triage, draft replies, and booking handoffs while Stephanie remains in review.",
    next: "Connect LinkedIn and Meet Alfred, then test with synthetic replies.",
    evidence: "Lead-response agent, response-intake skill, and lead-response swarm.",
  },
  {
    name: "meeting-intelligence-agent",
    displayName: "COACH - Meeting Intelligence",
    status: "live",
    department: "Meetings + Reports",
    profile: "Turns Fireflies meetings into decisions, coaching notes, action items, and follow-up gaps.",
    summary: "Keeps meeting context and the game plan visible across the dashboard.",
    next: "Maintain the decision and task loop after every Rob working session.",
    evidence: "July 16 Fireflies note and meeting-intelligence swarm.",
  },
  {
    name: "planning-report-agent",
    displayName: "SCRIBE - Planning Report Builder",
    status: "waiting on assets",
    department: "Meetings + Reports",
    profile: "Stages approved planning inputs locally and prepares a reviewed annual-review report package.",
    summary: "Uses private server intake and never releases a report without human review.",
    next: "Receive the final HTML template, sample PDF, and Claude skill folder from Rob.",
    evidence: "Private report-intake API, file-mode canary, and planning-report swarm.",
  },
  {
    name: "activity-metrics-agent",
    displayName: "PULSE - Activity Metrics",
    status: "ready to test",
    department: "Insights + Growth",
    profile: "Shows aggregate calls, connections, meetings, reviews, and time allocation.",
    summary: "Makes daily activity and weekly trends visible without client-level details.",
    next: "Confirm Rob's preferred activity metrics and reporting cadence.",
    evidence: "Aggregate activity API and local VPS persistence canary.",
  },
  {
    name: "signal-radar-agent",
    displayName: "ORACLE - Public Signal Research",
    status: "ready to test",
    department: "Insights + Growth",
    profile: "Finds compliant public employer, equity, liquidity, and executive-move signals.",
    summary: "Builds a public-data opportunity radar for Rob's manual review.",
    next: "Confirm the priority employer list and run the first public-signal canary.",
    evidence: "Signal-radar agent, public-signal skill, and target-employer data.",
  },
  {
    name: "hearsay-content-agent",
    displayName: "BEACON - Content + Visibility",
    status: "review gated",
    department: "Insights + Growth",
    profile: "Drafts educational content for Hearsay and human compliance review.",
    summary: "Prepares content themes and safe draft copy without publishing.",
    next: "Draft only after Rob and Julian approve themes and compliance language.",
    evidence: "Hearsay-ready content skill and no-external-send rule.",
  },
  {
    name: "analytics-agent",
    displayName: "AXIOM - Executive Analytics",
    status: "ready to test",
    department: "Insights + Growth",
    profile: "Converts approved aggregate operating data into practical CEO insights.",
    summary: "Produces trend notes, value reports, and decision support from approved metrics.",
    next: "Confirm the morning and weekly executive brief cadence.",
    evidence: "CEO dashboard skill and executive-reporting workflow.",
  },
  {
    name: "onboarding-concierge-agent",
    displayName: "CONCIERGE - Team Onboarding",
    status: "live",
    department: "Team Operations",
    profile: "Guides team access, open setup items, ownership, and handoffs.",
    summary: "Helps each teammate find the right view, task, agent, and approval boundary.",
    next: "Map Rob's team members to the seven assigned usernames and working roles.",
    evidence: "Live team guide and verified Rob plus Stephanie login canaries.",
  },
];

export const workspaceAgentGroups = [
  {
    group: "Control Tower",
    purpose: "Keeps the plan coherent, tracks evidence, and applies the compliance boundary.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "Control Tower"),
  },
  {
    group: "Revenue + CRM",
    purpose: "Turns approved HubSpot and lead-response context into a reviewable revenue queue.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "Revenue + CRM"),
  },
  {
    group: "Meetings + Reports",
    purpose: "Turns meetings and approved planning inputs into decisions and reviewed report packages.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "Meetings + Reports"),
  },
  {
    group: "Insights + Growth",
    purpose: "Creates aggregate insights, public-signal research, and review-ready content.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "Insights + Growth"),
  },
  {
    group: "Team Operations",
    purpose: "Keeps team access, ownership, task routing, and onboarding clear.",
    agents: workspaceAgentProfiles.filter((agent) => agent.department === "Team Operations"),
  },
];

export const workspaceDesignQuestions = [
  "Which team member should own each of the seven assigned workspace usernames?",
  "Which follow-up call fields should appear after Rob approves record-level HubSpot scope?",
  "Which activity metrics should PULSE show daily and weekly?",
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
    items: ["Hetzner command center live", "12 role agents configured", "HubSpot aggregate read-only status", "LinkedIn and Meet Alfred access", "private report asset intake"],
  },
  {
    stage: "Operate + Optimize",
    status: "planned",
    items: ["follow-up call operations", "response handoff cadence", "CEO morning brief", "retainer reporting", "usage tracking"],
  },
];
