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
    "Deposit is received, the Hermes workspace is configured, and the next decision is which operating tier and access scope Rob wants to move forward with.",
  currentSources: [
    "May 27 Fireflies transcript 01KSNC02C1EBXF56962CH63MFR",
    "June 17 Fireflies recap 01KVBJBJBYBZEBK3ABW37HM4YF",
    "Rob's June 17 HubSpot pipeline rundown email",
    "AI Acrobatics proposal and payment links",
    "Rob Agent OS source package review",
  ],
};

export const workspaceSystems = [
  {
    name: "Hermes workspace",
    status: "stable path",
    clientMeaning: "The operating brain for Rob's agents, source maps, skills, swarms, and compliance rules.",
    proof: "Workspace verification passes and Rob-specific agent profile config is current.",
  },
  {
    name: "PPP portal",
    status: "client-facing path",
    clientMeaning: "The URL Rob can open to review status, agents, game plans, requests, billing, and workspace design.",
    proof: "This portal hosts the Rob profile and agent review surface.",
  },
  {
    name: "Agent OS dashboard",
    status: "internal preview",
    clientMeaning: "A visual dashboard shell from the zip package. Useful for inspiration, but not yet the source of truth.",
    proof: "Internal port 3742 is live through a tmux runner; not exposed as the Rob login surface.",
  },
  {
    name: "HubSpot access",
    status: "read-only active",
    clientMeaning: "Agents can reason from approved HubSpot audit data, but no writes or workflow changes happen without approval.",
    proof: "Current mode is read-only audit with write scope blocked.",
  },
];

export const workspaceAgentGroups = [
  {
    group: "Control Tower",
    purpose: "Keeps the plan coherent, tracks evidence, and decides which agent or swarm should run.",
    agents: [
      {
        name: "rob-chief-of-staff",
        status: "active",
        summary: "Orchestrates the June 17 rundown, access list, Linear updates, source map, and next swarm selection.",
      },
      {
        name: "compliance-boundary-agent",
        status: "active",
        summary: "Blocks prohibited actions and reviews anything Rob-facing before it leaves the workspace.",
      },
      {
        name: "access-security-agent",
        status: "active",
        summary: "Maintains the tool stack matrix and keeps credentials routed through OnePassword or approved invites.",
      },
    ],
  },
  {
    group: "Prospecting Engine",
    purpose: "Turns public signals and approved CRM context into reviewable prospecting support.",
    agents: [
      {
        name: "signal-radar-agent",
        status: "ready",
        summary: "Monitors public employer, liquidity, equity, hiring, and executive-move signals.",
      },
      {
        name: "prospect-brief-agent",
        status: "ready",
        summary: "Turns safe public context into concise first-meeting briefs and recommended questions.",
      },
      {
        name: "market-research-agent",
        status: "ready public-data",
        summary: "Tracks public market and employer research without using restricted client data.",
      },
    ],
  },
  {
    group: "CRM + Workflow",
    purpose: "Cleans up the operating picture around HubSpot, handoffs, and reporting without unsafe writes.",
    agents: [
      {
        name: "hubspot-hygiene-agent",
        status: "active read-only",
        summary: "Audits Rob's pipeline stages, missing owner/status fields, stale records, and handoff points.",
      },
      {
        name: "meeting-intelligence-agent",
        status: "active sources available",
        summary: "Turns Fireflies, Fathom, and approved meeting notes into action items and setup insights.",
      },
      {
        name: "analytics-agent",
        status: "aggregate only",
        summary: "Produces operational insights from approved aggregate data, not suitability scoring.",
      },
    ],
  },
  {
    group: "Content + Retainer Ops",
    purpose: "Creates review-ready content and keeps the monthly operating model clear.",
    agents: [
      {
        name: "hearsay-content-agent",
        status: "review gated",
        summary: "Drafts general educational content for Rob/Hearsay/manual review only.",
      },
      {
        name: "retainer-ops-agent",
        status: "decision needed",
        summary: "Tracks deliverables, credit usage, dev hours, consulting hours, blockers, and retainer fit.",
      },
      {
        name: "reporting-agent",
        status: "ready",
        summary: "Creates daily, weekly, and monthly proof reports after access, signal, or meeting events.",
      },
    ],
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
    items: ["Proposal", "deposit", "source map", "Hermes profile", "compliance boundary"],
  },
  {
    stage: "Build + Integrate",
    status: "active",
    items: ["HubSpot read-only audit", "tool access matrix", "agent roster review", "public-signal dry run"],
  },
  {
    stage: "Operate + Optimize",
    status: "planned",
    items: ["retainer reporting", "weekly signal cadence", "usage tracking", "next system recommendations"],
  },
];
