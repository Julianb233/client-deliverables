const STORAGE_KEY = "better-together-loading-states-review-v1";

const states = [
  {
    id: "app-launch-heartwood",
    number: "01",
    family: "Launch",
    title: "Heartwood App Launch",
    headline: "Growing your connection",
    body: "Use while auth, fonts, and session bootstrap resolve. Replaces blank startup with the approved Better Together bonsai mark.",
    motion: "Heart seed drops, roots wake, two trunks grow inward, and the shared canopy settles.",
  },
  {
    id: "partner-sync",
    number: "02",
    family: "Realtime",
    title: "Partner Sync",
    headline: "Syncing your latest moments",
    body: "Use when shared state is moving between partners: notes, memories, messages, shared moments, and invite-link updates.",
    motion: "Two small leaf pulses travel from left and right into one warm center point.",
  },
  {
    id: "ai-thinking",
    number: "03",
    family: "AI",
    title: "AI Thinking",
    headline: "Preparing a better reply",
    body: "Use for coach responses, report generation, translation, suggestions, and other AI work that takes more than a tap.",
    motion: "Three quiet seed dots gather into the bonsai base, then release.",
  },
  {
    id: "content-skeletons",
    number: "04",
    family: "Content",
    title: "Shaped Skeletons",
    headline: "Loading your latest moments",
    body: "Use for dashboards, activity cards, reports, and lists so the final layout is visible before content arrives.",
    motion: "Soft left-to-right sheen, no spinner, no layout jump.",
  },
  {
    id: "media-upload",
    number: "05",
    family: "Upload",
    title: "Photo + Voice Upload",
    headline: "Saving this for both of you",
    body: "Use for photos, voice notes, GIFs, and shared moments. Must show progress and block duplicate taps.",
    motion: "Progress bar advances while the heart seed stays planted in place.",
  },
  {
    id: "offline-retry",
    number: "06",
    family: "Recovery",
    title: "Offline Retry",
    headline: "Saved here, syncing soon",
    body: "Use when network drops during a save. It should preserve the user’s work and show a clear retry path.",
    motion: "Muted bonsai, paused pulse, retry button appears without alarm language.",
  },
];

let state = {
  version: 1,
  reviewer: "",
  overallNotes: "",
  decisions: {},
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function encodeReview(value) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(value))));
}

function decodeReview(value) {
  return JSON.parse(decodeURIComponent(escape(atob(value))));
}

function reviewFor(id) {
  return state.decisions[id] || { status: "", favorite: false, note: "" };
}

function saveState(message = "Saved on this device") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  document.getElementById("saveStatus").textContent = message;
  updateSummary();
}

function loadState() {
  const hash = new URLSearchParams(location.hash.slice(1)).get("review");
  if (hash) {
    try {
      const shared = decodeReview(hash);
      if (shared?.version === 1) {
        state = { ...state, ...shared };
        saveState("Shared review loaded");
        return;
      }
    } catch {
      showToast("This review link could not be read.");
    }
  }

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.version === 1) state = { ...state, ...stored };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function markPreview(kind) {
  return `
    <div class="mini-phone ${kind}">
      <div class="mini-screen">
        <div class="mini-lock mini-bonsai" aria-hidden="true">
          <span class="mini-left mini-left-trunk"></span>
          <span class="mini-right mini-right-trunk"></span>
          <span class="mini-leaf mini-leaf-a"></span>
          <span class="mini-leaf mini-leaf-b"></span>
          <span class="mini-leaf mini-leaf-c"></span>
          <span class="mini-seed"></span>
        </div>
        <p>Better Together</p>
        <h3>${escapeHtml(kind === "skeleton" ? "Loading your latest moments" : kind === "upload" ? "Saving this for both of you" : "Growing your connection")}</h3>
        ${kind === "skeleton" ? '<div class="skeleton-lines"><i></i><i></i><i></i></div>' : '<div class="mini-loader"><i></i></div>'}
      </div>
    </div>`;
}

function card(item) {
  const review = reviewFor(item.id);
  const status = review.status || "undecided";
  const kind = item.id.includes("skeleton") ? "skeleton" : item.id.includes("upload") ? "upload" : item.id.includes("offline") ? "offline" : "launch";
  const statusButton = (value, label) => `
    <button type="button" data-action="decision" data-id="${item.id}" data-status="${value}" class="${review.status === value ? "active" : ""}" aria-pressed="${review.status === value}">${label}</button>`;

  return `
    <article class="state-card" data-status="${status}">
      <div class="card-visual">
        <span class="state-number">${item.number}</span>
        <button class="favorite ${review.favorite ? "active" : ""}" type="button" data-action="favorite" data-id="${item.id}" aria-label="Favorite ${escapeHtml(item.title)}">♥</button>
        ${markPreview(kind)}
      </div>
      <div class="card-body">
        <p class="family">${escapeHtml(item.family)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="headline">${escapeHtml(item.headline)}</p>
        <p class="description">${escapeHtml(item.body)}</p>
        <div class="motion-note"><b>Motion</b><span>${escapeHtml(item.motion)}</span></div>
        <div class="decision-control">
          ${statusButton("approve", "Approve")}
          ${statusButton("revise", "Needs change")}
          ${statusButton("hold", "Hold")}
        </div>
        <label class="note-label">
          <span>Notes for this state</span>
          <textarea data-action="note" data-id="${item.id}" placeholder="What should change or stay?">${escapeHtml(review.note)}</textarea>
        </label>
      </div>
    </article>`;
}

function render() {
  document.getElementById("stateGrid").innerHTML = states.map(card).join("");
  document.getElementById("visibleCount").textContent = `${states.length} states`;
  updateSummary();
}

function updateSummary() {
  const values = states.map((item) => reviewFor(item.id).status).filter(Boolean);
  const count = (status) => values.filter((value) => value === status).length;
  document.getElementById("decisionCount").textContent = values.length;
  document.getElementById("approveCount").textContent = count("approve");
  document.getElementById("reviseCount").textContent = count("revise");
  document.getElementById("holdCount").textContent = count("hold");
}

function updateDecision(id, status) {
  const current = reviewFor(id);
  state.decisions[id] = { ...current, status: current.status === status ? "" : status };
  saveState();
  render();
}

function updateFavorite(id) {
  const current = reviewFor(id);
  state.decisions[id] = { ...current, favorite: !current.favorite };
  saveState();
  render();
}

function reviewSummary() {
  const groups = { approve: [], revise: [], hold: [], undecided: [] };
  states.forEach((item) => {
    const review = reviewFor(item.id);
    const status = review.status || "undecided";
    groups[status].push(`${item.number} ${item.title}${review.note ? ` — ${review.note}` : ""}`);
  });
  return `Better Together loading states review\nReviewer: ${state.reviewer || "Not set"}\n\nApproved:\n${groups.approve.map((x) => `- ${x}`).join("\n") || "- None"}\n\nNeeds changes:\n${groups.revise.map((x) => `- ${x}`).join("\n") || "- None"}\n\nHold:\n${groups.hold.map((x) => `- ${x}`).join("\n") || "- None"}\n\nUndecided:\n${groups.undecided.map((x) => `- ${x}`).join("\n") || "- None"}\n\nOverall notes:\n${state.overallNotes || "None"}`;
}

async function copyText(value, message) {
  await navigator.clipboard.writeText(value);
  showToast(message);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function bindEvents() {
  document.addEventListener("click", async (event) => {
    const target = event.target.closest("button, a");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "decision") updateDecision(target.dataset.id, target.dataset.status);
    if (action === "favorite") updateFavorite(target.dataset.id);
    if (target.id === "shareReview") {
      const url = `${location.origin}${location.pathname}#review=${encodeReview(state)}`;
      await copyText(url, "Review link copied");
    }
    if (target.id === "copySummary") await copyText(reviewSummary(), "Summary copied");
    if (target.id === "downloadReview") {
      const blob = new Blob([reviewSummary()], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "better-together-loading-states-review.txt";
      link.click();
      URL.revokeObjectURL(url);
      showToast("Review downloaded");
    }
    if (target.id === "resetReview") {
      state = { version: 1, reviewer: "", overallNotes: "", decisions: {} };
      localStorage.removeItem(STORAGE_KEY);
      hydrateForm();
      render();
      showToast("Review reset");
    }
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target.id === "reviewerName") state.reviewer = target.value;
    if (target.id === "overallNotes") state.overallNotes = target.value;
    if (target.dataset.action === "note") {
      const current = reviewFor(target.dataset.id);
      state.decisions[target.dataset.id] = { ...current, note: target.value };
    }
    saveState();
  });
}

function hydrateForm() {
  document.getElementById("reviewerName").value = state.reviewer || "";
  document.getElementById("overallNotes").value = state.overallNotes || "";
}

loadState();
hydrateForm();
render();
bindEvents();
