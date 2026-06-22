"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { workspaceAccess } from "../data/workspace";

const STORAGE_KEY = "rob-workspace-access";
const PRIMARY_CODE = "password1$";
const LEGACY_CODE = "rob-preview";

function expectedCodes() {
  return new Set([PRIMARY_CODE, LEGACY_CODE, process.env.NEXT_PUBLIC_ROB_WORKSPACE_ACCESS_CODE].filter(Boolean));
}

export function WorkspaceAccessGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUnlocked(window.localStorage.getItem(STORAGE_KEY) === "granted");
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const code = String(form.get("code") || "").trim();
    if (expectedCodes().has(code)) {
      window.localStorage.setItem(STORAGE_KEY, "granted");
      setUnlocked(true);
      setMessage("");
      return;
    }
    setMessage("That did not match the current workspace review code. Ask Julian for the latest access details.");
  }

  if (unlocked) return <>{children}</>;

  return (
    <main className="page access-page">
      <section className="access-shell">
        <div className="panel accent-panel access-intro">
          <p className="eyebrow">Rob Campbell workspace</p>
          <h1>Log in to review your AI Prospect Engine agency workspace.</h1>
          <p className="lead">
            This opens the Hermes profile, proposed agents, swarms, operating plan, current access status, and design questions for Rob's AI Prospect Engine workspace.
          </p>
          <ul className="list">
            <li>Review the agents Rob wanted to create.</li>
            <li>See what Hermes is operating internally.</li>
            <li>Use the request center to send edits, questions, voice notes, and screenshots.</li>
            <li>Keep sensitive systems gated behind Julian and Rob approval.</li>
          </ul>
        </div>
        <form className="panel access-form" onSubmit={submit}>
          <p className="eyebrow">{workspaceAccess.reviewCodeLabel}</p>
          <h2>Client access</h2>
          <label>
            Email optional
            <input name="email" type="email" placeholder="Robert.t.campbell5@gmail.com" />
          </label>
          <label>
            Access code
            <input name="code" required placeholder="Enter workspace code" />
          </label>
          <button className="button" type="submit">Open workspace</button>
          {message ? <p className="form-notice error">{message}</p> : null}
          <p className="helper-text">{workspaceAccess.softGateNote}</p>
          <Link className="button secondary" href="/">Back to portal</Link>
        </form>
      </section>
    </main>
  );
}
