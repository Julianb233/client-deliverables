import Link from "next/link";
import { complianceGuardrails, health, hubLinks, onboardingBooking, paymentStatus, retainerTiers, snapshotReport, stats } from "../data/client-data";
import { deliverables } from "../data/deliverables";
import { firefliesSource, gamePlans, meetingNotes } from "../data/meeting-notes";
import { milestones } from "../data/milestones";
import { agentRunStatuses, meetingSyncPipeline, portalStandardStatus, retainerOperations } from "../data/operations";
import { getPortalRuntimeData } from "../lib/convex";
import { RequestCenterPanel, UpsellActionButton } from "./ClientPortalActions";

function formatStatValue(stat: (typeof stats)[number]) {
  if (stat.format === "currency") {
    return `$${stat.value.toLocaleString()}`;
  }
  return stat.value.toLocaleString();
}

function gamePlanStatusClass(status: string) {
  if (status === "active") return "status-active";
  if (status === "next") return "status-pending";
  return "status-upcoming";
}

export async function HomePage() {
  const runtime = await getPortalRuntimeData();
  const liveGuardrails = runtime.client?.metadata?.complianceGuardrails ?? complianceGuardrails;
  const paymentLabel = runtime.client?.metadata?.paymentStatus ?? paymentStatus.statusLabel;
  const feedItems = runtime.feed.length > 0 ? runtime.feed.slice(0, 5) : runtime.changelog.slice(0, 5).map((item) => ({
    id: `${item.date}-${item.title}`,
    date: item.date,
    title: item.title,
    description: item.description,
    source: "Static fallback",
  }));

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">Wizard of AI command center</p>
        <h1>Rob, your AI Prospect Engine is moving.</h1>
        <p className="lead">
          The deposit is in, the compliance boundary is set, and this portal now tracks both sides of the work: what AI Acrobatics is building and which AI systems make sense to install next.
        </p>
      </div>
      <section className="hero">
        <div className="panel glass-panel">
          <span className="badge status-active">Build active</span>
          <h2>Next move: turn the proposal into the working prospect engine.</h2>
          <p>
            This is the same admin-style dashboard treatment Julian uses for backend operations: concise status, live source links, blockers, and the next actions that keep the work moving.
          </p>
          <p>
            For your Northwestern Mutual practice, the boundary stays tight: public prospect signals and HubSpot-side workflow support only. No Dynamics writes, no NMIS/client-record data in AI tools, and no AI-generated investment advice.
          </p>
          <div className="button-row">
            <a className="button" href="/book-onboarding">Book onboarding call</a>
            <a className="button" href="/action-items">Review next actions</a>
            <a className="button secondary" href="/request">Send request</a>
            <a className="button secondary" href="/agents">Review AI agents</a>
          </div>
          <p className="sync-note">{runtime.lastSyncedLabel}</p>
        </div>
        <div className="panel accent-panel">
          <p className="eyebrow">Payment and kickoff</p>
          <h2>{paymentLabel}</h2>
          <p>
            {paymentStatus.depositAmount} deposit received toward the {paymentStatus.initialBuildTotal} initial build. The remaining balance and retainer start should stay under Julian review before any client-facing send.
          </p>
          <table className="ops-table">
            <tbody>
              <tr>
                <th>Build</th>
                <td>AI Prospect Engine foundation</td>
              </tr>
              <tr>
                <th>Retainer</th>
                <td>$1,500/mo starting tier, with higher tiers for more dev, consulting, and credit usage.</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{health.summary}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="section grid cols-4">
        {stats.map((stat) => (
          <div className="panel compact stat-card" key={stat.label}>
            <span className="status-dot" aria-hidden="true" />
            <div className="stat-value">{formatStatValue(stat)}</div>
            <p className="muted">{stat.label}</p>
          </div>
        ))}
      </section>
      <section className="section grid cols-2">
        <div className="panel">
          <div className="panel-heading-row">
            <div>
              <p className="eyebrow">Meeting strategy</p>
              <h2>Game plans from our calls</h2>
            </div>
            <Link className="button secondary compact-button" href="/game-plans">Open</Link>
          </div>
          <div className="plan-preview-list">
            {gamePlans.slice(0, 3).map((plan) => (
              <article className="mini-plan" key={plan.id}>
                <span className={`badge ${gamePlanStatusClass(plan.status)}`}>{plan.status}</span>
                <h3>{plan.title}</h3>
                <p>{plan.objective}</p>
                <p className="muted">{plan.stage} · {plan.source}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-heading-row">
            <div>
              <p className="eyebrow">Fireflies source</p>
              <h2>Meeting notes</h2>
            </div>
            <span className="badge">{firefliesSource.meetingDate}</span>
          </div>
          <div className="source-card compact-source-card">
            <strong>{firefliesSource.label}</strong>
            <span>{firefliesSource.attendees.join(" + ")}</span>
            <code>{firefliesSource.transcriptId}</code>
          </div>
          <ul className="list">
            {meetingNotes.slice(0, 2).map((note) => (
              <li key={note.id}>
                <strong>{note.title}</strong>
                <p>{note.summary}</p>
                <span className="muted">{note.source} · {note.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section grid cols-2">
        <div className="panel">
          <div className="panel-heading-row">
            <div>
              <p className="eyebrow">PPP standard</p>
              <h2>What is now wired</h2>
            </div>
            <Link className="button secondary compact-button" href="/operations">Ops</Link>
          </div>
          <ul className="list">
            {portalStandardStatus.slice(0, 4).map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <br />
                <span className="muted">{item.status} · {item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2>Recommended next AI systems</h2>
          <div className="offer-stack">
            {runtime.upsellOffers.filter((offer) => offer.status === "recommended").slice(0, 3).map((offer) => (
              <article className="mini-offer" key={offer.offerSlug}>
                <span className="badge">{offer.category}</span>
                <h3>{offer.title}</h3>
                <p>{offer.outcome}</p>
                <p className="muted">{offer.whyItFits}</p>
                <UpsellActionButton offer={offer} />
              </article>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Submitted ideas</h2>
          {runtime.messages.length > 0 ? (
            <ul className="list">
              {runtime.messages.slice(0, 5).map((message) => (
                <li key={message.id}>
                  <strong>{message.topic}</strong>
                  <br />
                  <span className="muted">{message.date} · {message.category} · {message.status}</span>
                  <p>{message.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Questions, voice notes, images, ideas, improvements, and blockers submitted through the portal assistant will appear here after Convex sync.</p>
          )}
        </div>
      </section>
      <section className="section grid cols-2">
        <div className="panel">
          <h2>Compliance guardrails</h2>
          <ul className="list">
            {liveGuardrails.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2>May focus</h2>
          <ul className="list">
            {snapshotReport.nextMonthFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section grid cols-2">
        <div className="panel">
          <h2>Operating links</h2>
          <ul className="list">
            {hubLinks.map((link) => (
              <li key={link.label}>
                <a href={link.url}>
                  <strong>{link.label}</strong>
                  <br />
                  <span className="muted">{link.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2>Live portal feed</h2>
          <ul className="list">
            {feedItems.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <br />
                <span className="muted">{item.date} · {item.source}</span>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export function BookOnboardingPage() {
  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">Onboarding call</p>
        <h1>Rob can book the kickoff call directly from this portal.</h1>
        <p className="lead">
          This is the working session for turning the paid deposit into the first implementation sprint: HubSpot access, compliance boundaries, target-employer signals, reporting cadence, and immediate next actions.
        </p>
      </div>
      <section className="section booking-layout">
        <div className="panel booking-panel">
          <div className="panel-heading-row">
            <div>
              <p className="eyebrow">Self-scheduling</p>
              <h2>{onboardingBooking.title}</h2>
            </div>
            <span className="badge status-active">{onboardingBooking.duration}</span>
          </div>
          <p>{onboardingBooking.purpose}</p>
          <div className="booking-primary-action">
            <a className="button" href={onboardingBooking.url} target="_blank" rel="noreferrer">Open booking calendar</a>
            <a className="button secondary" href={onboardingBooking.alternateUrl} target="_blank" rel="noreferrer">Open 30-minute option</a>
            <span className="muted">Use the 1-hour call for onboarding. The 30-minute option is available for quick support or a shorter check-in.</span>
          </div>
          <div className="booking-frame-wrap">
            <iframe
              className="booking-frame"
              src={onboardingBooking.url}
              title="Book Rob Campbell AI Prospect Engine onboarding call"
              loading="lazy"
            />
          </div>
          <div className="button-row">
            <Link className="button secondary" href="/request">Send a scheduling note</Link>
          </div>
        </div>
        <aside className="panel">
          <p className="eyebrow">Call agenda</p>
          <h2>What to bring</h2>
          <ul className="list">
            {onboardingBooking.prepItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <table className="ops-table">
            <tbody>
              <tr>
                <th>Host</th>
                <td>{onboardingBooking.owner}</td>
              </tr>
              <tr>
                <th>Scope</th>
                <td>AI Prospect Engine onboarding, not client-record or investment-advice review.</td>
              </tr>
              <tr>
                <th>Review gate</th>
                <td>All external messaging and custom pricing still route through Julian approval.</td>
              </tr>
            </tbody>
          </table>
        </aside>
      </section>
    </main>
  );
}

export async function RequestCenterPage() {
  const runtime = await getPortalRuntimeData();

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">Client input zone</p>
        <h1>Request Center</h1>
        <p className="lead">
          Rob can send project questions, screenshots, voice notes, blockers, and new AI system ideas here. Submissions save to Convex, create a Linear task when credentials are available, and stay behind Julian's review gate.
        </p>
      </div>
      <section className="section grid request-layout">
        <RequestCenterPanel />
        <aside className="panel">
          <p className="eyebrow">What happens next</p>
          <h2>Review-gated routing</h2>
          <ol className="number-list">
            <li>Message and attachment metadata are submitted through the server route.</li>
            <li>Convex stores the request in portalMessages and posts an in-app feed event.</li>
            <li>Linear gets a follow-up task for AI Acrobatics review.</li>
            <li>Julian approves any external reply, scope change, payment link, or client-facing recommendation.</li>
          </ol>
          <div className="source-card compact-source-card">
            <strong>Recent submitted items</strong>
            <span>{runtime.messages.length > 0 ? `${runtime.messages.length} visible from Convex` : "No visible requests yet"}</span>
          </div>
          {runtime.messages.length > 0 ? (
            <ul className="list">
              {runtime.messages.slice(0, 5).map((message) => (
                <li key={message.id}>
                  <strong>{message.topic}</strong>
                  <p>{message.message}</p>
                  <span className="muted">{message.date} · {message.category} · {message.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Once Rob submits a question, idea, screenshot, or voice note, it appears here after Convex sync.</p>
          )}
        </aside>
      </section>
    </main>
  );
}

export function GamePlansPage() {
  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">Strategy to execution</p>
        <h1>Game Plans + Meeting Notes</h1>
        <p className="lead">
          This page turns the May 27 Fireflies meeting into the working plan for Rob's AI Prospect Engine: what we decided, what is next, and what proof should appear as the system gets built.
        </p>
      </div>
      <section className="section grid source-grid">
        <div className="panel accent-panel source-card">
          <p className="eyebrow">Primary meeting source</p>
          <h2>{firefliesSource.label}</h2>
          <dl className="source-facts">
            <div>
              <dt>Date</dt>
              <dd>{firefliesSource.meetingDate}</dd>
            </div>
            <div>
              <dt>Attendees</dt>
              <dd>{firefliesSource.attendees.join(" + ")}</dd>
            </div>
            <div>
              <dt>Transcript</dt>
              <dd><code>{firefliesSource.transcriptId}</code></dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{firefliesSource.syncStatus}</dd>
            </div>
          </dl>
        </div>
        <div className="panel">
          <p className="eyebrow">Operating boundary</p>
          <h2>What stays protected</h2>
          <ul className="list">
            {complianceGuardrails.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="muted">
            Meeting notes are used for planning and delivery context. Client-facing sends, custom recommendations, and financial-services outputs stay behind Julian or Rob review.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Game plans</p>
            <h2>From conversation to execution</h2>
          </div>
          <Link className="button secondary compact-button" href="/action-items">Action Items</Link>
        </div>
        <div className="game-plan-grid">
          {gamePlans.map((plan) => (
            <article className="panel game-plan-card" key={plan.id}>
              <div className="panel-heading-row">
                <span className={`badge ${gamePlanStatusClass(plan.status)}`}>{plan.status}</span>
                <span className="muted">{plan.stage}</span>
              </div>
              <h3>{plan.title}</h3>
              <p>{plan.objective}</p>
              <p className="muted">{plan.source}</p>
              <div className="owner-pill">{plan.owner}</div>
              <h4>Next steps</h4>
              <ol className="number-list">
                {plan.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <h4>Proof to show</h4>
              <div className="proof-list">
                {plan.proof.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Meeting notes</p>
            <h2>Decisions and follow-through</h2>
          </div>
        </div>
        <div className="meeting-note-stack">
          {meetingNotes.map((note) => (
            <article className="panel meeting-note-block" key={note.id}>
              <div>
                <span className="badge">{note.source}</span>
                <h3>{note.title}</h3>
                <p>{note.summary}</p>
                <p className="muted">{note.date}</p>
              </div>
              <div>
                <h4>Decisions</h4>
                <ul className="list">
                  {note.decisions.map((decision) => (
                    <li key={decision}>{decision}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Next actions</h4>
                <ul className="list">
                  {note.nextActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section grid cols-2">
        <div className="panel">
          <p className="eyebrow">Fireflies sync pipeline</p>
          <h2>How new meeting notes enter the portal</h2>
          <ol className="number-list">
            {meetingSyncPipeline.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="panel">
          <p className="eyebrow">Review gate</p>
          <h2>Raw notes are not auto-published</h2>
          <p>
            The portal can now receive reviewed meeting summaries through <code>/api/meeting-sync</code>. Raw Fireflies transcript text stays internal until it is cleaned for client visibility.
          </p>
          <p className="muted">
            This prevents internal strategy, pricing notes, or rough transcript language from appearing in Rob's portal before Julian approves it.
          </p>
        </div>
      </section>
    </main>
  );
}

export function OperationsPage() {
  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">Operating portal</p>
        <h1>Agent + Retainer Operations</h1>
        <p className="lead">
          This page closes the gap between a static dashboard and a live operating portal: agent status, blockers, monthly tier coverage, usage reporting, and the PPP standard checks are all visible in one place.
        </p>
      </div>
      <section className="section grid cols-2">
        <div className="panel">
          <h2>PPP standard status</h2>
          <ul className="list">
            {portalStandardStatus.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
                <span className={`badge ${item.status === "live" ? "status-active" : item.status === "blocked-by-review" ? "status-pending" : "status-upcoming"}`}>{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel accent-panel">
          <p className="eyebrow">Monthly report promise</p>
          <h2>Retainer reporting should show proof, not activity theater.</h2>
          <p>
            Each monthly report should break down delivered work, public-signal output, HubSpot hygiene progress, AI credit usage, dev hours, consulting hours, blockers, and recommended next systems.
          </p>
          <Link className="button secondary" href="/billing">Review retainer tiers</Link>
        </div>
      </section>
      <section className="section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Agents</p>
            <h2>Current run status</h2>
          </div>
          <Link className="button secondary compact-button" href="/agents">Agent offers</Link>
        </div>
        <div className="agent-status-grid">
          {agentRunStatuses.map((agent) => (
            <article className="panel" key={agent.name}>
              <div className="panel-heading-row">
                <span className={`badge ${agent.status === "active" ? "status-active" : agent.status === "blocked" ? "status-pending" : "status-upcoming"}`}>{agent.status}</span>
                <span className="muted">{agent.lastRun}</span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.role}</p>
              <table className="ops-table">
                <tbody>
                  <tr><th>Next</th><td>{agent.nextRun}</td></tr>
                  <tr><th>Proof</th><td>{agent.evidence}</td></tr>
                </tbody>
              </table>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Retainers</p>
            <h2>Monthly operating tiers</h2>
          </div>
        </div>
        <div className="grid cols-3">
          {retainerOperations.map((tier) => (
            <article className="panel" key={tier.tier}>
              <span className="badge">{tier.price}</span>
              <h3>{tier.tier}</h3>
              <p>{tier.bestFor}</p>
              <p className="muted">{tier.cadence}</p>
              <ul className="list">
                {tier.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ProgressPage() {
  return (
    <main className="page">
      <h1>Progress</h1>
      <p className="lead">The AI Roadmap follows three operating stages: Diagnose + Roadmap, Build + Integrate, and Operate + Optimize.</p>
      <section className="section timeline">
        {milestones.map((milestone) => (
          <article className="panel timeline-row" key={milestone.id}>
            <div>
              <span className={`badge status-${milestone.status}`}>{milestone.status}</span>
              <p className="muted">{milestone.dateRange}</p>
            </div>
            <div>
              <h2>{milestone.name}</h2>
              <p>{milestone.description}</p>
              <ul className="list">
                {milestone.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export async function AgentsPage() {
  const runtime = await getPortalRuntimeData();
  const offers = runtime.upsellOffers.filter((offer) => ["growth-agent", "support-agent", "data-reporting"].includes(offer.category));

  return (
    <main className="page">
      <h1>AI Agents</h1>
      <p className="lead">Wizard of AI agent systems mapped to Rob's current build and possible next steps.</p>
      <section className="section grid cols-3">
        {offers.map((offer) => (
          <article className="panel" key={offer.offerSlug}>
            <span className={`badge status-${offer.status === "recommended" ? "active" : "pending"}`}>{offer.status}</span>
            <h2>{offer.title}</h2>
            <p>{offer.outcome}</p>
            <p className="muted">{offer.whyItFits}</p>
            <p className="muted">{offer.setupEstimate} · {offer.priceLabel}</p>
            <UpsellActionButton offer={offer} />
          </article>
        ))}
      </section>
    </main>
  );
}

export async function AutomationsPage() {
  const runtime = await getPortalRuntimeData();
  const offers = runtime.upsellOffers.filter((offer) => offer.category === "operations");

  return (
    <main className="page">
      <h1>Automations</h1>
      <p className="lead">Workflow Wizard, N8N, Zapier, Make.com, APIs, CRM sync, and calendar automation live here as they become approved.</p>
      <section className="section grid cols-2">
        <div className="panel">
          <h2>Automation workbench</h2>
          <table className="ops-table">
            <tbody>
              <tr><th>N8N</th><td>Custom triggers, API orchestration, and error-handled workflows.</td></tr>
              <tr><th>Zapier</th><td>Fast multi-app automations and scheduled handoffs.</td></tr>
              <tr><th>Make.com</th><td>Visual scenarios for transformations, webhooks, and app connections.</td></tr>
              <tr><th>CRM</th><td>HubSpot starts read-only until access and scope are approved.</td></tr>
            </tbody>
          </table>
        </div>
        {offers.map((offer) => (
          <article className="panel" key={offer.offerSlug}>
            <span className="badge">{offer.category}</span>
            <h2>{offer.title}</h2>
            <p>{offer.outcome}</p>
            <p className="muted">{offer.whyItFits}</p>
            <UpsellActionButton offer={offer} />
          </article>
        ))}
      </section>
    </main>
  );
}

export function ContentGrowthPage() {
  return (
    <main className="page">
      <h1>Content + Growth</h1>
      <p className="lead">Content Factory, AI Content Integration, SEO visibility, campaign workflows, and approval-ready content live here when included in scope.</p>
      <section className="section grid cols-3">
        {[
          ["Content Factory", "Blog writing, social posts, video scripts, and brand voice systems."],
          ["AI Content Integration", "Cross-platform scheduling, SEO optimization, and consistent content operations."],
          ["SERP Visibility", "Search visibility work grounded in Google SERP and SEO proof."],
        ].map(([title, description]) => (
          <article className="panel" key={title}>
            <span className="badge">available</span>
            <h2>{title}</h2>
            <p>{description}</p>
            <p className="muted">Requires Julian-approved scope before client-facing publishing.</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export async function AnalyticsPage() {
  const runtime = await getPortalRuntimeData();

  return (
    <main className="page">
      <h1>Analytics</h1>
      <p className="lead">The value layer: time saved, signals created, workflows shipped, action items resolved, and retainer usage.</p>
      <section className="section grid cols-4">
        {stats.map((stat) => (
          <div className="panel compact stat-card" key={stat.label}>
            <span className="status-dot" aria-hidden="true" />
            <div className="stat-value">{formatStatValue(stat)}</div>
            <p className="muted">{stat.label}</p>
          </div>
        ))}
      </section>
      <section className="section grid cols-2">
        <div className="panel">
          <h2>Activity proof</h2>
          <ul className="list">
            {runtime.feed.slice(0, 5).map((item) => (
              <li key={item.id}><strong>{item.title}</strong><br /><span className="muted">{item.date} · {item.source}</span></li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2>Reporting promise</h2>
          <p>Monthly reports should show value delivered, usage, credits, hours, active blockers, recommended next systems, and what is waiting on client approval.</p>
        </div>
      </section>
    </main>
  );
}

export function DeliverablesPage() {
  return (
    <main className="page">
      <h1>Deliverables</h1>
      <p className="lead">Work completed and in progress for Rob's AI Prospect Engine.</p>
      <section className="section grid cols-3">
        {deliverables.map((item) => (
          <article className="panel" key={item.name}>
            <span className={`badge status-${item.status}`}>{item.status}</span>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="muted">{item.date} · {item.type}</p>
            {item.url ? <a className="button" href={item.url}>Open</a> : null}
          </article>
        ))}
      </section>
    </main>
  );
}

export async function ChangelogPage() {
  const runtime = await getPortalRuntimeData();

  return (
    <main className="page">
      <h1>Changelog</h1>
      <p className="lead">A running log of the work happening on Rob's behalf. {runtime.lastSyncedLabel}.</p>
      <section className="section timeline">
        {runtime.changelog.map((item) => (
          <article className="panel timeline-row" key={`${item.date}-${item.title}`}>
            <span className="badge">{item.date}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="muted">{item.type}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export async function ActionItemsPage() {
  const runtime = await getPortalRuntimeData();

  return (
    <main className="page">
      <h1>Action Items</h1>
      <p className="lead">The items needed from Rob or from Julian before the next operating stage. {runtime.lastSyncedLabel}.</p>
      <section className="section grid cols-2">
        {runtime.actionItems.map((item) => (
          <article className="panel" key={item.id}>
            <span className={`badge status-${item.status}`}>{item.priority} · {item.status}</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p className="muted">Due {item.dueDate}</p>
            <ul className="list">
              {item.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}

export async function ActivityPage() {
  const runtime = await getPortalRuntimeData();
  const items = runtime.feed.length > 0 ? runtime.feed : runtime.changelog.map((item) => ({
    id: `${item.date}-${item.title}`,
    date: item.date,
    title: item.title,
    description: item.description,
    source: "Static fallback",
  }));

  return (
    <main className="page">
      <h1>Activity</h1>
      <p className="lead">Recent operating activity synced from the current project workstream. {runtime.lastSyncedLabel}.</p>
      <section className="section timeline">
        {items.map((item) => (
          <article className="panel timeline-row" key={item.id}>
            <span className="badge">{item.date}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="muted">{item.source}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function MorePage() {
  return (
    <main className="page">
      <h1>More</h1>
      <section className="section grid cols-2">
        <div className="panel">
          <h2>Retainer Options</h2>
          <div className="grid">
            {retainerTiers.map((tier) => (
              <article className="panel soft" key={tier.name}>
                <h3>{tier.name} · {tier.price}</h3>
                <ul className="list">
                  {tier.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Project Hub</h2>
          <ul className="list">
            {hubLinks.map((link) => (
              <li key={link.label}>
                <a href={link.url}>
                  <strong>{link.label}</strong>
                  <br />
                  <span className="muted">{link.description}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="muted">Powered by AI Acrobatics</p>
        </div>
      </section>
      <section className="section panel">
        <h2>Agent Instructions</h2>
        <p>
          Future operators should begin in the Hermes workspace, read the source map, run verification, then update Linear with exact evidence paths.
        </p>
        <Link className="button" href="/action-items">Review Action Items</Link>
      </section>
    </main>
  );
}

export async function BillingPage() {
  const runtime = await getPortalRuntimeData();

  return (
    <main className="page">
      <h1>Billing</h1>
      <p className="lead">Deposit, paid-in-full option, monthly retainers, and recommended next systems are tracked here with Julian's review gate intact.</p>
      <section className="section grid cols-2">
        <div className="panel accent-panel">
          <p className="eyebrow">Current build</p>
          <h2>{paymentStatus.statusLabel}</h2>
          <p>{paymentStatus.depositAmount} received toward the {paymentStatus.initialBuildTotal} build.</p>
          <p className="muted">{paymentStatus.note}</p>
        </div>
        <div className="panel">
          <h2>Retainer ladder</h2>
          <ul className="list">
            {retainerTiers.map((tier) => (
              <li key={tier.name}>
                <strong>{tier.name} · {tier.price}</strong>
                <p>{tier.includes.join(", ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section grid cols-3">
        {runtime.upsellOffers.map((offer) => (
          <article className="panel" key={offer.offerSlug}>
            <span className={`badge status-${offer.status === "recommended" ? "active" : "pending"}`}>{offer.status}</span>
            <h2>{offer.title}</h2>
            <p>{offer.outcome}</p>
            <p className="muted">{offer.priceLabel ?? "Request scoped quote"} · {offer.setupEstimate ?? "Timing depends on scope"}</p>
            <UpsellActionButton offer={offer} />
          </article>
        ))}
      </section>
      <section className="section panel">
        <h2>Recent upsell interest</h2>
        {runtime.upsellIntents.length > 0 ? (
          <ul className="list">
            {runtime.upsellIntents.slice(0, 8).map((intent) => (
              <li key={intent.id}>
                <strong>{intent.title}</strong>
                <br />
                <span className="muted">{intent.date} · {intent.intentType} · {intent.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Upsell clicks and requests will appear here after Convex sync.</p>
        )}
      </section>
    </main>
  );
}
