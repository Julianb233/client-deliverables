"use client";

import { usePathname } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import type { PortalRuntimeData } from "../lib/convex";

type SubmitState = "idle" | "submitting" | "success" | "error";

type AssistantAttachment = {
  name: string;
  type: string;
  size: number;
  kind: "image" | "audio" | "file";
  dataUrl?: string;
};

type PortalNotification = {
  id: string;
  title: string;
  body: string;
  date: string;
  source: string;
  url?: string;
};

const MAX_ATTACHMENT_BYTES = 750_000;

export function MessageMeWidget({ notifications = [] }: { notifications?: PortalNotification[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [notice, setNotice] = useState("");
  const [attachments, setAttachments] = useState<AssistantAttachment[]>([]);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/client-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: form.get("category"),
        priority: form.get("priority"),
        topic: form.get("topic"),
        message: form.get("message"),
        page: pathname,
        assistantMode: form.get("assistantMode"),
        attachments,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setState("error");
      setNotice(result.error ?? "Could not send this yet. Please try again.");
      return;
    }
    event.currentTarget.reset();
    setAttachments([]);
    setState("success");
    setNotice(result.message ?? "Sent to Julian's review queue and logged in the portal.");
  }

  async function onAttachmentChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    const converted = await Promise.all(files.slice(0, 3).map(fileToAttachment));
    setAttachments((current) => [...current, ...converted].slice(0, 3));
    event.currentTarget.value = "";
  }

  async function toggleRecording() {
    if (recording && recorderRef.current) {
      recorderRef.current.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setState("error");
      setNotice("Voice recording is not available in this browser. You can still attach an audio file.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const attachment = await blobToAttachment(blob, `voice-note-${new Date().toISOString().slice(0, 19)}.webm`);
        setAttachments((current) => [...current, attachment].slice(0, 3));
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setNotice("Recording. Tap stop when you are done.");
    } catch {
      setState("error");
      setNotice("Microphone access was not available. You can still type or attach a file.");
    }
  }

  function removeAttachment(name: string) {
    setAttachments((current) => current.filter((attachment) => attachment.name !== name));
  }

  return (
    <div className={`message-widget ${open ? "is-open" : ""}`}>
      {open ? (
        <form className="message-panel" onSubmit={onSubmit}>
          <div className="message-panel-header">
            <div>
              <p className="eyebrow">Portal assistant</p>
              <h2>Ask, send feedback, or add context</h2>
            </div>
            <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close message widget">×</button>
          </div>
          {notifications.length > 0 ? (
            <div className="notification-strip" aria-label="Recent portal notifications">
              <span className="notification-dot" aria-hidden="true" />
              <div>
                <strong>{notifications[0].title}</strong>
                <p>{notifications[0].body}</p>
              </div>
            </div>
          ) : null}
          <label>
            What do you need?
            <select name="assistantMode" defaultValue="question">
              <option value="question">Ask a project question</option>
              <option value="feedback">Send feedback</option>
              <option value="idea">Suggest a new AI system</option>
              <option value="blocker">Flag a blocker</option>
            </select>
          </label>
          <label>
            Topic
            <input name="topic" required placeholder="What should Julian know?" maxLength={120} />
          </label>
          <label>
            Category
            <select name="category" defaultValue="question">
              <option value="question">Question</option>
              <option value="idea">New idea</option>
              <option value="suggestion">Suggestion</option>
              <option value="improvement">Improvement</option>
              <option value="bug">Bug or blocker</option>
            </select>
          </label>
          <label>
            Priority
            <select name="priority" defaultValue="medium">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            Details
            <textarea name="message" required placeholder="Ask a question, describe what changed, or explain the feedback." rows={5} maxLength={3000} />
          </label>
          <div className="assistant-tools">
            <label className="file-tool">
              <span>Attach image or audio</span>
              <input type="file" accept="image/*,audio/*" multiple onChange={onAttachmentChange} />
            </label>
            <button className="button secondary" type="button" onClick={toggleRecording}>
              {recording ? "Stop voice note" : "Record voice note"}
            </button>
          </div>
          {attachments.length > 0 ? (
            <ul className="attachment-list">
              {attachments.map((attachment) => (
                <li key={attachment.name}>
                  <span>{attachment.kind} · {attachment.name} · {formatBytes(attachment.size)}</span>
                  <button type="button" onClick={() => removeAttachment(attachment.name)}>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">Small images and short voice notes are stored with the Convex portal message. Larger files should be sent after Julian approves the upload path.</p>
          )}
          <button className="button" type="submit" disabled={state === "submitting"}>
            {state === "submitting" ? "Sending..." : "Send to portal queue"}
          </button>
          {notice ? <p className={`form-notice ${state}`}>{notice}</p> : null}
          {notifications.length > 1 ? (
            <details className="notification-log">
              <summary>Recent portal updates</summary>
              <ul>
                {notifications.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.date} · {item.source}</span>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </form>
      ) : null}
      <button className="message-launcher" type="button" onClick={() => setOpen((value) => !value)}>
        Ask Julian
      </button>
    </div>
  );
}

export function UpsellActionButton({ offer }: { offer: PortalRuntimeData["upsellOffers"][number] }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [notice, setNotice] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>();
  const intentType = useMemo(() => offer.checkoutUrl && !offer.requestOnly ? "checkout" : "request", [offer.checkoutUrl, offer.requestOnly]);

  async function onClick() {
    setState("submitting");
    setNotice("");
    const response = await fetch("/api/upsell-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offerSlug: offer.offerSlug, intentType }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setState("error");
      setNotice(result.error ?? "Could not log this request yet.");
      return;
    }
    setState("success");
    setCheckoutUrl(result.checkoutUrl);
    setNotice(result.message ?? "Sent to Julian's review queue.");
  }

  return (
    <div className="upsell-action">
      <button className="button" type="button" onClick={onClick} disabled={state === "submitting"}>
        {state === "submitting" ? "Working..." : offer.checkoutUrl && !offer.requestOnly ? "Buy or request" : "Request this"}
      </button>
      {checkoutUrl ? <a className="button secondary" href={checkoutUrl}>Open checkout</a> : null}
      {notice ? <p className={`form-notice ${state}`}>{notice}</p> : null}
    </div>
  );
}

export function RequestCenterPanel() {
  const pathname = usePathname();
  const [state, setState] = useState<SubmitState>("idle");
  const [notice, setNotice] = useState("");
  const [attachments, setAttachments] = useState<AssistantAttachment[]>([]);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/client-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: form.get("category"),
        priority: form.get("priority"),
        topic: form.get("topic"),
        message: form.get("message"),
        page: pathname,
        assistantMode: form.get("assistantMode"),
        attachments,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setState("error");
      setNotice(result.error ?? "Could not send this yet. Please try again.");
      return;
    }
    event.currentTarget.reset();
    setAttachments([]);
    setState("success");
    setNotice(result.message ?? "Logged in the portal and routed to Julian's review queue.");
  }

  async function onAttachmentChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    const converted = await Promise.all(files.slice(0, 5).map(fileToAttachment));
    setAttachments((current) => [...current, ...converted].slice(0, 5));
    event.currentTarget.value = "";
  }

  async function toggleRecording() {
    if (recording && recorderRef.current) {
      recorderRef.current.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setState("error");
      setNotice("Voice recording is not available in this browser. Attach an audio file or type the request instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const attachment = await blobToAttachment(blob, `voice-note-${new Date().toISOString().slice(0, 19)}.webm`);
        setAttachments((current) => [...current, attachment].slice(0, 5));
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setNotice("Recording. Tap stop when you are done.");
    } catch {
      setState("error");
      setNotice("Microphone access was not available. You can still type or attach an audio file.");
    }
  }

  function removeAttachment(name: string) {
    setAttachments((current) => current.filter((attachment) => attachment.name !== name));
  }

  return (
    <form className="panel request-center-form" onSubmit={onSubmit}>
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Request center</p>
          <h2>Send a question, idea, blocker, image, or voice note</h2>
        </div>
        <span className="badge status-active">Linear routed</span>
      </div>
      <div className="request-form-grid">
        <label>
          Request type
          <select name="assistantMode" defaultValue="question">
            <option value="question">Ask about the project</option>
            <option value="feedback">Send feedback</option>
            <option value="idea">Suggest a new AI system</option>
            <option value="blocker">Flag a blocker</option>
          </select>
        </label>
        <label>
          Category
          <select name="category" defaultValue="question">
            <option value="question">Question</option>
            <option value="idea">New idea</option>
            <option value="suggestion">Suggestion</option>
            <option value="improvement">Improvement</option>
            <option value="bug">Bug or blocker</option>
          </select>
        </label>
        <label>
          Priority
          <select name="priority" defaultValue="medium">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <label>
        Topic
        <input name="topic" required placeholder="Example: HubSpot access, signal report, retainer question" maxLength={120} />
      </label>
      <label>
        Details
        <textarea name="message" required placeholder="Write the question, feedback, or action you want reviewed." rows={7} maxLength={3000} />
      </label>
      <div className="assistant-tools">
        <label className="file-tool">
          <span>Attach image, screenshot, or audio</span>
          <input type="file" accept="image/*,audio/*" multiple onChange={onAttachmentChange} />
        </label>
        <button className="button secondary" type="button" onClick={toggleRecording}>
          {recording ? "Stop voice note" : "Record voice note"}
        </button>
      </div>
      {attachments.length > 0 ? (
        <ul className="attachment-list">
          {attachments.map((attachment) => (
            <li key={attachment.name}>
              <span>{attachment.kind} · {attachment.name} · {formatBytes(attachment.size)}</span>
              <button type="button" onClick={() => removeAttachment(attachment.name)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="helper-text">Small uploads are saved inline when possible. Large files stay metadata-only until Julian approves the larger upload path.</p>
      )}
      <button className="button" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending..." : "Submit to review queue"}
      </button>
      {notice ? <p className={`form-notice ${state}`}>{notice}</p> : null}
    </form>
  );
}

async function fileToAttachment(file: File): Promise<AssistantAttachment> {
  return blobToAttachment(file, file.name);
}

async function blobToAttachment(blob: Blob, name: string): Promise<AssistantAttachment> {
  const kind = blob.type.startsWith("image/") ? "image" : blob.type.startsWith("audio/") ? "audio" : "file";
  const attachment: AssistantAttachment = {
    name,
    type: blob.type || "application/octet-stream",
    size: blob.size,
    kind,
  };
  if (blob.size <= MAX_ATTACHMENT_BYTES) {
    attachment.dataUrl = await readBlobAsDataUrl(blob);
  }
  return attachment;
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
