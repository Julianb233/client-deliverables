import Link from "next/link";
import { WorkspaceAccessGate } from "../../components/WorkspaceAccess";
import { workspaceAgentGroups, workspaceAgentProfiles } from "../../data/workspace";
import {
  hermesApprovalGates,
  hermesRuntimeProof,
  hermesSkills,
  hermesSwarmDispatch,
  hermesTopology,
  hermesWorkspaceOverview,
  hermesWorkspaceStats,
  publicSignalSearchPlan,
} from "../../data/hermes-workspace";

export const dynamic = "force-dynamic";

function statusClass(status: string) {
  if (status.includes("ready") || status.includes("active") || status.includes("deployed") || status.includes("client")) {
    return "status-active";
  }
  if (status.includes("waiting") || status.includes("gated") || status.includes("partial") || status.includes("internal")) {
    return "status-pending";
  }
  return "status-upcoming";
}

export default function AgencyWorkspacePage() {
  return (
    <WorkspaceAccessGate>
      <main className="page agency-workspace-page">
        <div className="page-header workspace-header">
          <p className="eyebrow">Hermes agency workspace</p>
          <h1>{hermesWorkspaceOverview.title}</h1>
          <p className="lead">{hermesWorkspaceOverview.summary}</p>
          <div className="button-row">
            <Link className="button" href="/workspace">Client workspace</Link>
            <Link className="button secondary" href="/agents">Agent profiles</Link>
            <Link className="button secondary" href="/game-plans">Game plans</Link>
            <Link className="button secondary" href="/request">Send feedback</Link>
          </div>
        </div>

        <section className="section metric-strip">
          {hermesWorkspaceStats.map((stat) => (
            <article className="metric-pill" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </article>
          ))}
        </section>

        <section className="section grid cols-2">
          <article className="panel accent-panel">
            <p className="eyebrow">Runtime identity</p>
            <h2>{hermesWorkspaceOverview.subtitle}</h2>
            <table className="ops-table">
              <tbody>
                <tr><th>Profile</th><td>{hermesWorkspaceOverview.profile}</td></tr>
                <tr><th>Workspace</th><td>{hermesWorkspaceOverview.workspace}</td></tr>
                <tr><th>Mode</th><td>{hermesWorkspaceOverview.mode}</td></tr>
                <tr><th>Status</th><td>{hermesWorkspaceOverview.status}</td></tr>
                <tr><th>Client surface</th><td>{hermesWorkspaceOverview.clientSurface}</td></tr>
              </tbody>
            </table>
          </article>
          <article className="panel">
            <p className="eyebrow">Proof</p>
            <h2>Canary-backed workspace</h2>
            <p>{hermesWorkspaceOverview.proof}</p>
            <ul className="list">
              {hermesRuntimeProof.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="section">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Workspace topology</p>
              <h2>How the agency workspace is wired</h2>
            </div>
            <span className="badge status-active">Hermes-style surface</span>
          </div>
          <div className="topology-grid">
            {hermesTopology.map((node) => (
              <article className="panel topology-node" key={node.name}>
                <span className={`badge ${statusClass(node.status)}`}>{node.status}</span>
                <h3>{node.name}</h3>
                <strong>{node.value}</strong>
                <p>{node.description}</p>
                <p className="muted">{node.evidence}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Agent lanes</p>
              <h2>{workspaceAgentProfiles.length} Hermes agents grouped by operating lane</h2>
            </div>
            <Link className="button secondary compact-button" href="/agents">Full profiles</Link>
          </div>
          <div className="agency-lane-grid">
            {workspaceAgentGroups.map((group) => (
              <article className="panel agency-lane-card" key={group.group}>
                <div className="panel-heading-row">
                  <div>
                    <p className="eyebrow">{group.group}</p>
                    <h3>{group.purpose}</h3>
                  </div>
                  <span className="badge">{group.agents.length}</span>
                </div>
                <div className="mini-chip-row">
                  {group.agents.map((agent) => (
                    <span className="mini-chip" key={agent.name}>{agent.displayName}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Swarm dispatch</p>
              <h2>The operating runs Rob can understand</h2>
            </div>
          </div>
          <div className="swarm-dispatch-grid">
            {hermesSwarmDispatch.map((swarm) => (
              <article className="panel swarm-card" key={swarm.name}>
                <div className="panel-heading-row">
                  <div>
                    <span className={`badge ${statusClass(swarm.status)}`}>{swarm.status}</span>
                    <h3>{swarm.name}</h3>
                  </div>
                </div>
                <p>{swarm.purpose}</p>
                <dl className="agent-detail-list">
                  <div>
                    <dt>Trigger</dt>
                    <dd>{swarm.trigger}</dd>
                  </div>
                  <div>
                    <dt>Agents</dt>
                    <dd>{swarm.agents.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>Flow</dt>
                    <dd>{swarm.flow.join(" -> ")}</dd>
                  </div>
                  <div>
                    <dt>Output</dt>
                    <dd>{swarm.output}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="section grid cols-2">
          <article className="panel">
            <p className="eyebrow">Workspace skills</p>
            <h2>Skills loaded for this agency</h2>
            <div className="skill-matrix">
              {hermesSkills.map((skill) => (
                <div className="skill-row" key={skill.name}>
                  <span className="badge">{skill.lane}</span>
                  <div>
                    <strong>{skill.name}</strong>
                    <p>{skill.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Approval gates</p>
            <h2>What keeps the workspace compliant</h2>
            <ul className="list">
              {hermesApprovalGates.map((gate) => (
                <li key={gate}>{gate}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="section panel">
          <p className="eyebrow">Agent search plan</p>
          <h2>Public-signal prospecting plan</h2>
          <p className="lead">{publicSignalSearchPlan.objective}</p>
          <div className="search-plan-grid">
            <div>
              <h3>Highest-priority employers</h3>
              <div className="mini-chip-row">
                {publicSignalSearchPlan.highestPriorityTargets.map((target) => (
                  <span className="mini-chip" key={target}>{target}</span>
                ))}
              </div>
            </div>
            <div>
              <h3>Signal types</h3>
              <ul className="list">
                {publicSignalSearchPlan.signalTypes.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Allowed sources</h3>
              <div className="source-matrix">
                {publicSignalSearchPlan.allowedSources.map((source) => (
                  <span key={source}>{source}</span>
                ))}
              </div>
            </div>
            <div>
              <h3>Excluded sources</h3>
              <div className="source-matrix blocked">
                {publicSignalSearchPlan.excludedSources.map((source) => (
                  <span key={source}>{source}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </WorkspaceAccessGate>
  );
}
