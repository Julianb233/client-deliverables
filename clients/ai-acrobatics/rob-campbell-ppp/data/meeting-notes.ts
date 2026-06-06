export const firefliesSource = {
  label: "May 27 Fireflies meeting + June 3 Drive onboarding assets",
  meetingDate: "2026-05-27",
  transcriptId: "01KSNC02C1EBXF56962CH63MFR",
  attendees: ["Rob Campbell", "Julian Bradley"],
  syncStatus: "May 27 Fireflies source is live. June 3 Fireflies transcript is not exposed by the connector, so agents should use the Drive onboarding brief and meeting-notes source index.",
};

export const meetingNotes = [
  {
    id: "june-3-hubspot-inspection",
    title: "HubSpot inspection checklist",
    date: "2026-06-06",
    source: "Drive onboarding source index",
    summary:
      "Agents now have a read-only HubSpot inspection plan that matches Rob's goals: prospect-side CRM hygiene, target-employer readiness, public-signal mapping, manual review gates, and reporting proof.",
    decisions: [
      "Start with read-only access proof before inspecting or recommending any HubSpot changes.",
      "Inspect CRM objects, lifecycle fields, lead source, employer, role, last contact, tags, pipeline stages, lists, workflows, and integrations.",
      "Separate safe prospect-side records from unclear mixed records and blocked client/NMIS-sensitive records.",
      "Do not merge records, change stages, activate workflows, enroll sequences, or send externally without approval.",
    ],
    nextActions: [
      "Wait for Rob to resend or confirm the HubSpot invite to julian@aiacrobatics.com.",
      "Run the inspection plan after access is confirmed.",
      "Write the output as a HubSpot read-only audit, cleanup candidates, compliance flags, and weekly pipeline report.",
    ],
  },
  {
    id: "june-3-meeting-source-index",
    title: "June onboarding notes source status",
    date: "2026-06-06",
    source: "Google Drive source index",
    summary:
      "Fireflies does not currently expose the June 3 Rob onboarding transcript through the connector. The Drive onboarding brief and presentation are the current meeting-derived sources, and the meeting notes folder now contains a source index for agents.",
    decisions: [
      "Do not claim the June 3 Fireflies transcript was reviewed until Fireflies returns it.",
      "Use the Drive onboarding brief as the current source for kickoff questions, access checklist, and game plan.",
      "Keep new summaries and meeting-derived decisions in the Drive meeting notes folder after review.",
    ],
    nextActions: [
      "Recheck Fireflies when agents need the raw transcript.",
      "Use the Drive source index when Fireflies is missing.",
      "Publish only reviewed meeting summaries to the PPP.",
    ],
  },
  {
    id: "may-27-scope",
    title: "AI Prospect Engine scope",
    date: "2026-05-27",
    source: "Fireflies meeting notes",
    summary:
      "The first build should turn Rob's prospecting workflow into a compliance-safe operating system: clean HubSpot, track public signals, prepare meeting briefs, and keep client-facing decisions under human review.",
    decisions: [
      "Start with prospect-side and HubSpot-side workflow support, not Dynamics or NMIS automation.",
      "Use public company, LinkedIn-style, employer, equity, liquidity, and career-change signals as the research layer.",
      "Prioritize San Diego technology and equity-event employers before broadening the target universe.",
      "Keep Hearsay and any external content as approval-ready drafts until Rob or Julian approves the final channel.",
    ],
    nextActions: [
      "Confirm HubSpot access and keep the first audit read-only.",
      "Review and expand the target-employer priority list.",
      "Create the first signal radar report and prospect queue using public data only.",
      "Turn top signals into short first-meeting briefs and recommended questions.",
    ],
  },
  {
    id: "may-27-commercial",
    title: "Commercial path and retainer ladder",
    date: "2026-05-27",
    source: "Fireflies meeting notes",
    summary:
      "The initial build is priced at $7,500, with a $5,500 deposit option and monthly operations beginning at $1,500 once the engine moves into recurring support.",
    decisions: [
      "$5,500 deposit starts the implementation path.",
      "$7,500 paid-in-full remains available as the full initial build option.",
      "$1,500/mo is the first retainer tier for monitoring, reporting, usage, and light operations.",
      "Higher retainers can include more development hours, consulting hours, and AI credit usage.",
    ],
    nextActions: [
      "Keep billing and retainer timing under Julian review before client-facing sends.",
      "Track monthly deliverables, AI usage, dev hours, consulting hours, and next recommendations.",
      "Show Rob what each retainer tier includes before asking him to choose the operating cadence.",
    ],
  },
  {
    id: "may-27-boundary",
    title: "Compliance and safety boundary",
    date: "2026-05-27",
    source: "Fireflies meeting notes",
    summary:
      "The engine must be useful without crossing financial-services compliance lines: no AI investment advice, no client-record ingestion, and no writes into restricted systems.",
    decisions: [
      "No Dynamics writes.",
      "No NMIS writes.",
      "No client-record data in AI tools.",
      "No AI-generated investment advice.",
      "External email, text, social, or Hearsay output requires human approval.",
    ],
    nextActions: [
      "Run compliance-boundary tests before any live workflow.",
      "Mark every prospect brief as research support, not investment advice.",
      "Route all ambiguous requests to Julian or Rob for human review.",
    ],
  },
];

export const gamePlans = [
  {
    id: "game-plan-1",
    stage: "Diagnose + Roadmap",
    title: "Post-deposit kickoff",
    status: "active" as const,
    objective:
      "Move from proposal approval into implementation setup with source links, payment status, compliance rules, and access needs visible in the portal.",
    source: "May 27 Fireflies meeting + AI Acrobatics proposal",
    owner: "AI Acrobatics",
    steps: [
      "Keep proposal, payment status, and source map linked in the PPP.",
      "Confirm the exact HubSpot access path and first read-only audit scope.",
      "Review the initial target-employer list with Rob.",
      "Document the first weekly operating cadence.",
    ],
    proof: ["Deposit received", "PPP live", "Hermes workspace created", "Linear project created"],
  },
  {
    id: "game-plan-2",
    stage: "Build + Integrate",
    title: "HubSpot read-only inspection",
    status: "active" as const,
    objective:
      "Inspect Rob's HubSpot safely before any cleanup work: access, objects, fields, duplicates, stale records, lists, workflows, integrations, compliance flags, and reporting readiness.",
    source: "June 6 HubSpot inspection plan + May 27 Fireflies meeting",
    owner: "HubSpot hygiene agent + compliance-boundary agent",
    steps: [
      "Confirm the HubSpot portal identity, access method, and read-only scope.",
      "Inventory objects, properties, lists, workflows, integrations, duplicates, and stale records.",
      "Classify data as safe prospect-side, needs manual review, or blocked from AI tools.",
      "Recommend cleanup and prospect-queue steps without writing to HubSpot.",
    ],
    proof: ["HubSpot inspection plan", "Object inventory", "Field hygiene map", "Compliance flags", "Access blocker log"],
  },
  {
    id: "game-plan-3",
    stage: "Build + Integrate",
    title: "Public signal radar",
    status: "next" as const,
    objective:
      "Monitor public employer and equity/liquidity signals so Rob can focus outreach on timely, relevant opportunities.",
    source: "May 27 Fireflies meeting",
    owner: "Signal radar agent",
    steps: [
      "Start with San Diego tech and equity-event employers.",
      "Normalize events into signal records with public source context.",
      "Score relevance and confidence before a prospect reaches Rob.",
      "Generate a daily signal report for AI Acrobatics review.",
    ],
    proof: ["Signal events", "Daily signal report", "Target-employer list"],
  },
  {
    id: "game-plan-4",
    stage: "Operate + Optimize",
    title: "Meeting briefs and Hearsay-ready drafts",
    status: "planned" as const,
    objective:
      "Convert approved public context into concise prospect briefs, recommended questions, and compliance-ready content drafts.",
    source: "May 27 Fireflies meeting",
    owner: "Prospect brief agent + Hearsay content agent",
    steps: [
      "Generate one-page prospect briefs from public context only.",
      "Separate facts, assumptions, and recommended questions.",
      "Draft Hearsay-ready content for manual approval.",
      "Block anything that sounds like individualized investment advice.",
    ],
    proof: ["Prospect brief template", "Hearsay draft template", "Compliance review notes"],
  },
  {
    id: "game-plan-5",
    stage: "Operate + Optimize",
    title: "Monthly retainer operations",
    status: "planned" as const,
    objective:
      "Show Rob what was delivered, what it cost to operate, what usage was consumed, and which next AI systems make sense.",
    source: "May 27 Fireflies meeting + retainer plan",
    owner: "Retainer ops agent + reporting agent",
    steps: [
      "Track deliverables, credits, dev hours, consulting hours, blockers, and wins.",
      "Separate Operator, Growth, and Build Partner tier coverage.",
      "Recommend next systems only after Julian review.",
      "Keep monthly reporting tied to proof, not vague activity.",
    ],
    proof: ["Monthly retainer report", "Usage report", "Recommended next systems"],
  },
];
