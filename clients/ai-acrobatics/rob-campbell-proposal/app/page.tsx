const robEmail = "Robert.t.campbell5@gmail.com";

const implementationItems = [
  "HubSpot cleanup and pipeline mapping: data hygiene, lifecycle stages, deal stages, tags, owner fields, and the manual handoff point before anything becomes client-side.",
  "Target-employer map for the San Diego tech-equity niche: Qualcomm, Dexcom, Illumina, ServiceNow, Intuit, Viasat, Callaway, Sempra, Neurocrine, Tyler Tech, and adjacent employers.",
  "Public-signal radar setup: SEC filings, LinkedIn job-change patterns, employer equity events, vesting-cliff logic, and a ranked daily prospect queue.",
  "First prospect brief templates: employer-specific prep notes Rob can use before meetings, with Jump.ai and calendar workflow in mind.",
  "Hearsay-ready content library: education-first LinkedIn/email drafts structured for NWM review instead of bypassing compliance.",
  "Agent workflow design: scraping, enrichment, scoring, task creation, and reporting agents with clear limits around financial advice and recordkeeping.",
  "Voice-agent / intake path planning: Retell or Vapi-style front door with HubSpot write-back where compliant and useful.",
  "Launch reporting: first dashboard view showing signal volume, prospect quality, follow-up status, and what needs Rob's review."
];

const retainerTiers = [
  {
    name: "Operator",
    price: "$1,500",
    badge: "Keep it running",
    summary:
      "For keeping the first AI Prospect Engine healthy, monitored, and improving after launch.",
    includes: [
      "Agent monitoring, prompt tuning, and repair for the live prospect workflows.",
      "Included standard AI credit usage for the active agents, with visibility before any heavier spend.",
      "Up to 3 hours/month of development or consulting for small changes, light workflow tuning, and strategy questions.",
      "Monthly signal-quality review: what sources are producing useful prospects and what should be removed.",
      "HubSpot-side hygiene checks so tags, lifecycle stages, queues, and handoff points stay clean.",
      "Compliance drift watch across FINRA, SEC, NMIS, Hearsay, and the boundaries we documented."
    ]
  },
  {
    name: "Growth",
    price: "$2,500",
    badge: "Recommended",
    summary:
      "For expanding employer coverage, improving automations, and steadily adding useful prospecting capacity.",
    includes: [
      "Everything in Operator.",
      "Up to 7 hours/month of development or consulting for new workflows, reporting improvements, and HubSpot iteration.",
      "Expanded AI credit usage for more frequent enrichment, scoring, briefs, and reporting runs.",
      "Two new employer or public-signal slices per month, such as a new San Diego tech company or equity-event pattern.",
      "Monthly dashboard review with recommendations: double down, pause, or rebuild.",
      "New Hearsay-ready content or meeting-brief templates tied to the best-performing employer signals."
    ]
  },
  {
    name: "Build Partner",
    price: "$4,500",
    badge: "Priority build lane",
    summary:
      "For using the system as an active growth lab with priority build time and deeper advisory support.",
    includes: [
      "Everything in Growth.",
      "Up to 15 hours/month of development or consulting for priority build work and deeper workflow changes.",
      "Higher included AI credit usage for heavier prospect radar runs, richer briefs, QA passes, and agent experiments.",
      "Priority response for broken workflows, data-source changes, checkout/reporting issues, or urgent improvements.",
      "Advanced experiments: new agent roles, voice-agent iteration, referral/review loops, and custom reporting views.",
      "Quarterly strategy session focused on pipeline ROI, expansion targets, and what should become the next sprint."
    ]
  }
];

const phases = [
  {
    label: "Kickoff",
    title: "Access, boundaries, and HubSpot map",
    body:
      "Confirm the written compliance boundary: no Dynamics writes, no client data in AI tools, no AI investment advice. Then map HubSpot-side fields, lifecycle stages, sequences, and the manual conversion handoff."
  },
  {
    label: "Weeks 1-2",
    title: "Cleanup and signal foundation",
    body:
      "Clean and organize HubSpot, define the target-employer universe, stand up the first public-signal sources, and produce the first ranked queue logic."
  },
  {
    label: "Weeks 3-5",
    title: "Agents, briefs, and content",
    body:
      "Build the scraping/enrichment/reporting agents, employer-specific brief templates, Hearsay-ready content formats, and the first meeting-prep workflow."
  },
  {
    label: "Weeks 6-8",
    title: "Nurture, review, and dashboard",
    body:
      "Add life-event triggers, referral/review loops, dashboards, and the review rhythm Rob can operate without crossing the compliance wall."
  }
];

export default function Page() {
  return (
    <main>
      <section className="hero">
        <div className="motionGrid" aria-hidden="true" />
        <div className="aurora auroraOne" aria-hidden="true" />
        <div className="aurora auroraTwo" aria-hidden="true" />
        <nav className="nav">
          <div className="brand">
            <div className="mark">AI</div>
            <div>
              <div>AI Acrobatics</div>
              <div className="fine">The Wizard of AI</div>
            </div>
          </div>
          <div className="navlinks">
            <a href="#investment">Investment</a>
            <a href="#implementation">What $7,500 includes</a>
            <a href="#monthly">Monthly</a>
            <a href="#next">Next steps</a>
          </div>
        </nav>

        <div className="wrap heroBody">
          <div className="heroCopy reveal">
            <div className="eyebrow">Implementation status updated - July 19, 2026</div>
            <h1>
              Rob, this is the build path for your <span className="gradientText">AI Prospect Engine.</span>
            </h1>
            <p className="lead">
              The meeting clarified the wedge: start with HubSpot-side cleanup, public-signal research, and
              compliance-safe agents that help you find and brief tech-equity prospects before they ever become
              client records. Dynamics stays untouched. Hearsay remains the review path. AI never gives investment advice.
            </p>
            <div className="actions">
              <span className="button primary">$5,500 deposit paid</span>
              <span className="button secondary">$2,500/mo Growth active</span>
              <a className="button secondary" href="https://rob.aiacrobatics.com/rob-os">
                Open Agent OS
              </a>
              <a className="button secondary" href={`mailto:${robEmail}`}>
                Email route: {robEmail}
              </a>
            </div>
            <p className="fine" style={{ marginTop: 18 }}>
              Payment is processed through FanBasis. AI Acrobatics does not collect card details on this proposal page.
            </p>
          </div>
          <aside className="heroPanel reveal delay1">
            <div className="panelLabel">Morning queue</div>
            <div className="signalRow">
              <span>Qualcomm RSU event</span>
              <strong>92</strong>
            </div>
            <div className="signalRow">
              <span>Dexcom job change</span>
              <strong>86</strong>
            </div>
            <div className="signalRow">
              <span>Illumina Form 144</span>
              <strong>81</strong>
            </div>
            <div className="panelFooter">Prospect-side only. HubSpot-side only.</div>
          </aside>
        </div>
      </section>

      <section id="investment" className="surface">
        <div className="wrap">
          <div className="sectionHead">
            <div className="eyebrow">Investment options</div>
            <h2>The build and operating plan are active.</h2>
            <p>
              The $5,500 implementation deposit is paid and the Growth Retainer is signed at $2,500 per month. The setup
              balance is being reconciled before a payment request is issued: the original $7,500 total leaves $2,000,
              while the latest instruction states $2,500 remains.
            </p>
          </div>
          <div className="grid three stagger">
            <article className="card liftCard">
              <span className="pill">Paid May 29</span>
              <div className="price">$5,500</div>
              <h3>Implementation deposit</h3>
              <p>
                Started the sprint, reserved development time, and began HubSpot cleanup, target-employer mapping, and
                the first public-signal radar slice.
              </p>
              <span className="button primary">Payment received</span>
            </article>

            <article className="card liftCard featured">
              <span className="pill">Original scope</span>
              <div className="price">$7,500</div>
              <h3>Implementation paid in full</h3>
              <p>
                Covers the full initial build we discussed: CRM cleanup, agent workflows, signal radar, brief templates,
                dashboards, and the launch handoff.
              </p>
              <span className="button light">Balance reconciliation in progress</span>
            </article>

            <article className="card liftCard">
              <span className="pill">Active plan</span>
              <div className="price">
                $2,500 <small>/ month</small>
              </div>
              <h3>Growth Retainer</h3>
              <p>
                Includes agent monitoring, expanded AI usage, up to seven development or consulting hours, and monthly operating review.
              </p>
              <span className="button light">Signed and current</span>
            </article>
          </div>
        </div>
      </section>

      <section id="implementation">
        <div className="wrap">
          <div className="sectionHead">
            <div className="eyebrow">What the $7,500 includes</div>
            <h2>The first build is concrete, not a vague AI retainer.</h2>
            <p>
              The initial scope turns the meeting into working infrastructure: cleaner HubSpot data, a ranked prospect
              radar, and agent workflows that stay on the prospect side of Rob's compliance boundary.
            </p>
          </div>
          <div className="grid two stagger">
            {implementationItems.map((item) => (
              <article className="card liftCard" key={item}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="monthly" className="dark">
        <div className="motionGrid soft" aria-hidden="true" />
        <div className="wrap">
          <div className="sectionHead">
            <div className="eyebrow">Monthly operating plan</div>
            <h2>Growth is active at $2,500 per month.</h2>
            <p>
              The comparison remains visible for scope clarity, but Rob does not need to select a tier. Growth includes
              expanded agent usage and a defined seven-hour development or consulting allocation.
            </p>
          </div>
          <div className="retainerGrid">
            {retainerTiers.map((tier) => (
              <article className={`retainerCard liftCard ${tier.name === "Growth" ? "featuredDark" : ""}`} key={tier.name}>
                <span className="pill">{tier.badge}</span>
                <div className="price">
                  {tier.price} <small>/ month</small>
                </div>
                <h3>{tier.name}</h3>
                <p className="muted">{tier.summary}</p>
                <ul>
                  {tier.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {tier.name === "Growth" ? (
                  <span className="button primary full">Current plan</span>
                ) : (
                  <span className="button primary full">Reference option</span>
                )}
              </article>
            ))}
          </div>
          <p className="fine tierNote">
            Growth is the signed operating baseline. Any future plan change is reviewed separately so scope, hours, and
            AI usage remain explicit.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sectionHead">
            <div className="eyebrow">Implementation sequence</div>
            <h2>The next steps moving forward.</h2>
          </div>
          <div className="timeline">
            {phases.map((phase) => (
              <article className="step liftCard" key={phase.label}>
                <div className="phase">{phase.label}</div>
                <div>
                  <h3>{phase.title}</h3>
                  <p>{phase.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="next" className="surface">
        <div className="wrap">
          <div className="callout">
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.78)" }}>
              Ready path
            </div>
            <h2>The implementation and Growth Retainer are underway.</h2>
            <p>
              First working session: confirm the compliance boundary in writing, map HubSpot-side fields, define the
              manual handoff point, and select the first target-employer slice for the signal radar.
            </p>
            <div className="actions">
              <span className="button secondary">Deposit paid</span>
              <span className="button secondary">Growth Retainer active</span>
              <a className="button secondary" href="https://rob.aiacrobatics.com/rob-os/command-room">
                Open Command Room
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
