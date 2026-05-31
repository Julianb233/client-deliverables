export const clientInfo = {
  name: "Rob Campbell",
  slug: "rob-campbell",
  contactName: "Rob",
  contactFullName: "Rob Campbell",
  contactEmail: "Robert.t.campbell5@gmail.com",
  contactPhone: "Pending",
  domain: "rob-campbell-proposal.vercel.app",
  industry: "Financial services and advisor prospecting",
  servicePackage: "$7,500 AI Prospect Engine build plus optional monthly retainer",
  startDate: "2026-05-27",
};

export const brand = {
  primaryColor: "#38bdf8",
  accentColor: "#a3e635",
  logoText: "Rob Campbell",
  footerText: "Powered by AI Acrobatics",
};

export const health = {
  status: "green" as "green" | "yellow" | "red",
  summary: "Deposit is received and the build is active; HubSpot access and compliance regression tests are the next gates.",
};

export const stats = [
  { label: "Hermes agents configured", value: 8, previousValue: 0, format: "number", trend: "up" },
  { label: "Swarms mapped", value: 5, previousValue: 0, format: "number", trend: "up" },
  { label: "Local skills enabled", value: 7, previousValue: 0, format: "number", trend: "up" },
  { label: "Deposit received", value: 5500, previousValue: 0, format: "currency", trend: "up" },
] as const;

export const hubLinks = [
  {
    label: "Live Proposal",
    url: "https://rob-campbell-proposal.vercel.app/",
    icon: "proposal",
    description: "Updated scope, pricing, retainer ladder, and payment links",
    category: "primary",
  },
  {
    label: "Linear Project",
    url: "https://linear.app/ai-acrobatics/project/rob-campbell-hermes-ai-prospect-engine-871e4057929b",
    icon: "tasks",
    description: "Agent-ready project board and subtasks",
    category: "primary",
  },
  {
    label: "Deposit Received",
    url: "https://www.fanbasis.com/agency-checkout/Aiacrobatics/A8KNB",
    icon: "payment",
    description: "$5,500 deposit paid; onboarding and implementation are active",
    category: "primary",
  },
  {
    label: "Paid In Full Checkout",
    url: "https://www.fanbasis.com/agency-checkout/Aiacrobatics/B19Nx",
    icon: "payment",
    description: "$7,500 paid-in-full option",
    category: "secondary",
  },
  {
    label: "Operator Retainer",
    url: "https://www.fanbasis.com/agency-checkout/Aiacrobatics/DwW1B",
    icon: "retainer",
    description: "$1,500/mo monitoring and reporting tier",
    category: "secondary",
  },
  {
    label: "Growth Retainer",
    url: "https://www.fanbasis.com/agency-checkout/Aiacrobatics/rgV2w",
    icon: "retainer",
    description: "$2,500/mo signal and workflow growth tier",
    category: "secondary",
  },
] as const;

export const snapshotReport = {
  month: "May 2026",
  overallHealth: 4 as 1 | 2 | 3 | 4 | 5,
  completedDeliverables: 10,
  pagesDeployed: 7,
  agentsConfigured: 8,
  milestonesOnTrack: "4 of 7",
  nextMonthFocus: [
    "Begin post-deposit onboarding and implementation setup.",
    "Confirm HubSpot access and read-only scope.",
    "Run compliance-boundary regression tests.",
    "Prepare the first public-signal radar and target employer map.",
  ],
  lastUpdated: "2026-05-30",
};

export const paymentStatus = {
  depositReceived: true,
  depositAmount: "$5,500",
  initialBuildTotal: "$7,500",
  statusLabel: "Deposit received",
  note: "Initial build is active. Remaining balance and monthly retainer timing should be confirmed by Julian before any client-facing send.",
};

export const complianceGuardrails = [
  "No Dynamics writes",
  "No NMIS writes",
  "No client data in AI tools",
  "No AI investment advice",
  "No external sends without Julian approval",
  "HubSpot remains read-only until access and scope are confirmed",
];

export const retainerTiers = [
  {
    name: "Operator",
    price: "$1,500/mo",
    includes: ["Agent monitoring", "AI credit usage allowance", "Light HubSpot hygiene", "Monthly reporting"],
  },
  {
    name: "Growth",
    price: "$2,500/mo",
    includes: ["Operator tier", "Weekly signal reviews", "More dev or consulting hours", "Content/template refreshes"],
  },
  {
    name: "Build Partner",
    price: "$4,500/mo",
    includes: ["Growth tier", "Advanced experiments", "Priority response", "Quarterly strategy", "Deeper workflow iteration"],
  },
];
