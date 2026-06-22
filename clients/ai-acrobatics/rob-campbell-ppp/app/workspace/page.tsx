import Link from "next/link";
import { WorkspaceAccessGate } from "../../components/WorkspaceAccess";
import { complianceGuardrails, hubLinks, onboardingBooking, retainerTiers } from "../../data/client-data";
import { workspaceAgentGroups, workspaceAgentProfiles, workspaceDesignQuestions, robProfile, workspaceRoadmap, workspaceSystems } from "../../data/workspace";

export const dynamic = "force-dynamic";

export default function WorkspacePage() {
  return (
    <WorkspaceAccessGate>
      <main className="page">
        <div className="page-header workspace-header">
          <p className="eyebrow">Client workspace</p>
          <h1>{robProfile.title}</h1>
          <p className="lead">{robProfile.statusSummary}</p>
          <div className="button-row">
            <Link className="button" href="/agency-workspace">Open Hermes agency workspace</Link>
            <a className="button" href={onboardingBooking.url} target="_blank" rel="noreferrer">Book onboarding call</a>
            <Link className="button secondary" href="/request">Send design feedback</Link>
            <Link className="button secondary" href="/agents">Open agent catalog</Link>
          </div>
        </div>

        <section className="section grid cols-2">
          <div className="panel accent-panel">
            <p className="eyebrow">Profile</p>
            <h2>{robProfile.name}</h2>
            <table className="ops-table">
              <tbody>
                <tr><th>Practice</th><td>{robProfile.practiceContext}</td></tr>
                <tr><th>Email</th><td>{robProfile.preferredEmail}</td></tr>
                <tr><th>Stage</th><td>{robProfile.currentStage}</td></tr>
                <tr><th>Workspace</th><td>AI Prospect Engine</td></tr>
                <tr><th>Agent profiles</th><td>{workspaceAgentProfiles.length} configured</td></tr>
              </tbody>
            </table>
          </div>
          <div className="panel">
            <p className="eyebrow">Sources powering this view</p>
            <h2>Source-backed, not guessed</h2>
            <ul className="list">
              {robProfile.currentSources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section panel accent-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Hermes command center</p>
              <h2>Agency workspace, swarms, skills, and search plan</h2>
              <p>
                The standard PPP shows progress. The Hermes agency workspace shows the actual operating system: profile, source map, agent lanes, swarm dispatch, workspace skills, public-signal prospect search plan, and proof gates.
              </p>
            </div>
            <Link className="button compact-button" href="/agency-workspace">Open</Link>
          </div>
        </section>

        <section className="section">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Workspace architecture</p>
              <h2>What Rob is reviewing</h2>
            </div>
            <span className="badge status-active">Hermes-first path</span>
          </div>
          <div className="workspace-system-grid">
            {workspaceSystems.map((system) => (
              <article className="panel" key={system.name}>
                <span className={`badge ${system.status.includes("stable") || system.status.includes("client") ? "status-active" : "status-pending"}`}>{system.status}</span>
                <h3>{system.name}</h3>
                <p>{system.clientMeaning}</p>
                <p className="muted">{system.proof}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Agent design board</p>
              <h2>The agents Rob wanted to create</h2>
            </div>
            <Link className="button secondary compact-button" href="/operations">Run status</Link>
          </div>
          <div className="workspace-agent-groups">
            {workspaceAgentGroups.map((group) => (
              <article className="panel workspace-agent-group" key={group.group}>
                <p className="eyebrow">{group.group}</p>
                <h3>{group.purpose}</h3>
                <div className="agent-mini-list">
                  {group.agents.map((agent) => (
                    <div className="agent-mini-row" key={agent.name}>
                      <span className={`badge ${agent.status.includes("active") || agent.status.includes("ready") ? "status-active" : "status-pending"}`}>{agent.status}</span>
                      <div>
                        <strong>{agent.displayName}</strong>
                        <code>{agent.name}</code>
                        <p>{agent.summary}</p>
                        <p className="muted">{agent.profile}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section grid cols-2">
          <div className="panel">
            <p className="eyebrow">Roadmap</p>
            <h2>How the workspace matures</h2>
            <div className="roadmap-stack">
              {workspaceRoadmap.map((stage) => (
                <article className="roadmap-row" key={stage.stage}>
                  <span className={`badge status-${stage.status === "complete" ? "completed" : stage.status === "active" ? "active" : "upcoming"}`}>{stage.status}</span>
                  <div>
                    <h3>{stage.stage}</h3>
                    <p>{stage.items.join(" · ")}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="panel">
            <p className="eyebrow">Design questions</p>
            <h2>What Rob can help shape</h2>
            <ul className="list">
              {workspaceDesignQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
            <Link className="button" href="/request">Send answers or edits</Link>
          </div>
        </section>

        <section className="section grid cols-2">
          <div className="panel">
            <p className="eyebrow">Boundaries</p>
            <h2>What the agents cannot do</h2>
            <ul className="list">
              {complianceGuardrails.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <p className="eyebrow">Operating tier</p>
            <h2>Monthly model after the build</h2>
            <div className="retainer-mini-stack">
              {retainerTiers.map((tier) => (
                <div className="retainer-mini-row" key={tier.name}>
                  <strong>{tier.name}</strong>
                  <span>{tier.price}</span>
                </div>
              ))}
            </div>
            <Link className="button secondary" href="/billing">Compare retainer tiers</Link>
          </div>
        </section>

        <section className="section panel">
          <p className="eyebrow">Useful links</p>
          <h2>Open the connected workspace resources</h2>
          <div className="workspace-link-grid">
            {hubLinks.slice(0, 8).map((link) => (
              <a href={link.url} className="workspace-link-card" key={link.label}>
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </WorkspaceAccessGate>
  );
}
