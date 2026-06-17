export type WizardServiceCategory =
  | "growth-agent"
  | "support-agent"
  | "operations"
  | "content-visibility"
  | "data-reporting"
  | "retainer"
  | "custom";

export type WizardServiceOffer = {
  offerSlug: string;
  title: string;
  category: WizardServiceCategory;
  outcome: string;
  whyItFits: string;
  setupEstimate?: string;
  priceLabel?: string;
  checkoutUrl?: string;
  requestOnly?: boolean;
  status: "recommended" | "available" | "active" | "hidden";
  sortOrder: number;
};

export const wizardServiceGroups = [
  {
    name: "Growth Agents",
    category: "growth-agent",
    description: "Lead generation, appointment setting, and guided sales systems.",
  },
  {
    name: "Support Agents",
    category: "support-agent",
    description: "Customer support, sales chat, routing, escalation, and FAQ automation.",
  },
  {
    name: "Operations",
    category: "operations",
    description: "N8N, Zapier, Make.com, API integrations, CRM sync, and workflow cleanup.",
  },
  {
    name: "Content + Visibility",
    category: "content-visibility",
    description: "Content Factory, AI content integration, brand voice, scheduling, and SEO visibility.",
  },
  {
    name: "Data + Reporting",
    category: "data-reporting",
    description: "Data Decoder dashboards, ROI reports, usage tracking, and executive summaries.",
  },
  {
    name: "Retainer Ops",
    category: "retainer",
    description: "Monthly support, AI credits, consulting/dev hours, and optimization cadence.",
  },
] as const;

export const wizardServiceOffers: WizardServiceOffer[] = [
  {
    offerSlug: "lead-gen-machine",
    title: "Lead Gen Machine",
    category: "growth-agent",
    outcome: "Turn cold traffic and public signals into a cleaner prospect pipeline.",
    whyItFits: "Rob's current build is already centered on compliant prospect-side research and follow-up signals.",
    setupEstimate: "1-2 weeks after source access",
    priceLabel: "Request scoped quote",
    requestOnly: true,
    status: "recommended",
    sortOrder: 10,
  },
  {
    offerSlug: "appointment-setter",
    title: "Appointment Setter",
    category: "growth-agent",
    outcome: "Move qualified prospects from interest to booked conversations with fewer manual touches.",
    whyItFits: "Once HubSpot and the signal queue are clean, the next unlock is routing qualified interest into calendar-ready next steps.",
    setupEstimate: "3-5 days after calendar/CRM scope",
    priceLabel: "Request scoped quote",
    requestOnly: true,
    status: "recommended",
    sortOrder: 20,
  },
  {
    offerSlug: "workflow-wizard",
    title: "Workflow Wizard",
    category: "operations",
    outcome: "Connect HubSpot, reporting, calendar, and follow-up workflows without manual copy/paste.",
    whyItFits: "The first implementation stage already depends on safe read-only CRM review and repeatable operator reporting.",
    setupEstimate: "48-72 hours per approved workflow",
    priceLabel: "Request scoped quote",
    requestOnly: true,
    status: "available",
    sortOrder: 30,
  },
  {
    offerSlug: "data-decoder",
    title: "Data Decoder",
    category: "data-reporting",
    outcome: "Show where time, leads, content, and agent usage are creating value.",
    whyItFits: "Rob will need simple monthly proof of what the AI Prospect Engine did and what to improve next.",
    setupEstimate: "3-5 days after baseline metrics",
    priceLabel: "Included in higher retainers",
    requestOnly: true,
    status: "recommended",
    sortOrder: 40,
  },
  {
    offerSlug: "operator-retainer",
    title: "Operator Retainer",
    category: "retainer",
    outcome: "Monthly monitoring, light workflow tuning, reports, and AI credit coverage.",
    whyItFits: "This is the natural operating tier after the initial AI Prospect Engine build goes live.",
    setupEstimate: "Starts after initial build",
    priceLabel: "$1,500/mo",
    checkoutUrl: "https://www.fanbasis.com/agency-checkout/Aiacrobatics/DwW1B",
    status: "available",
    sortOrder: 50,
  },
  {
    offerSlug: "growth-retainer",
    title: "Growth Retainer",
    category: "retainer",
    outcome: "Adds weekly signal reviews, deeper iteration, and more dev/consulting capacity.",
    whyItFits: "Use this when the prospect engine is producing enough signal to justify faster iteration.",
    setupEstimate: "Starts after initial build",
    priceLabel: "$2,500/mo",
    checkoutUrl: "https://www.fanbasis.com/agency-checkout/Aiacrobatics/rgV2w",
    status: "available",
    sortOrder: 60,
  },
  {
    offerSlug: "build-partner-retainer",
    title: "Build Partner Retainer",
    category: "retainer",
    outcome: "Priority build capacity for deeper experiments, strategy, and workflow iteration.",
    whyItFits: "Use this when Rob wants the AI Prospect Engine treated as a core operating system instead of light monthly support.",
    setupEstimate: "Starts after initial build",
    priceLabel: "$4,500/mo",
    checkoutUrl: "https://www.fanbasis.com/agency-checkout/Aiacrobatics/qALQ3",
    status: "available",
    sortOrder: 70,
  },
];
