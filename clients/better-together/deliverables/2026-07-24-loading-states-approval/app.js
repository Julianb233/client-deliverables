const STORAGE_KEY = "better-together-loading-states-review-v1";

const states = [
  {
    id: "app-launch-heartwood",
    number: "01",
    family: "Launch",
    title: "Heartwood App Launch",
    headline: "Motion only — no loading copy",
    body: "Use while auth, fonts, and session bootstrap resolve. The opening screen is one continuous Heartwood-green field with no card, sentence, or progress bar.",
    motion: "The heart seed settles first. The coral and paper trees grow simultaneously through five root-to-branch stages, the leaves sprout in waves, then a saffron heart rises to fill the center and the Better Together wordmark resolves below.",
  },
  {
    id: "partner-sync",
    number: "02",
    family: "Realtime",
    title: "Partner Sync",
    headline: "Syncing your latest moments",
    body: "Use when shared state is moving between partners: notes, memories, messages, shared moments, and invite-link updates.",
    motion: "A root glow starts at the planted heart seed, then a small sprout rises from the base before the shared logo resolves.",
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
    motion: "The planted heart grows into the center space between the two trees while upload progress advances.",
  },
  {
    id: "offline-retry",
    number: "06",
    family: "Recovery",
    title: "Offline Retry",
    headline: "Saved here, syncing soon",
    body: "Use when network drops during a save. It should preserve the user’s work and show a clear retry path.",
    motion: "The full logo stays framed and still; only the heart pulses inside the tree frame while retry remains available.",
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

function previewKind(item) {
  if (item.id.includes("skeleton")) return "skeleton";
  if (item.id.includes("upload")) return "upload";
  if (item.id.includes("offline")) return "offline";
  if (item.id.includes("partner-sync")) return "sync";
  if (item.id.includes("ai-thinking")) return "thinking";
  return "launch";
}

function markPreview(item) {
  const kind = previewKind(item);
  const launchMark = `
    <div class="mini-heartwood-lockup">
      <div class="mini-heartwood-mark layered-mark" aria-hidden="true">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-1" src="assets/heartwood-left-growth-1.png" alt="">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-1" src="assets/heartwood-right-growth-1.png" alt="">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-2" src="assets/heartwood-left-growth-2.png" alt="">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-2" src="assets/heartwood-right-growth-2.png" alt="">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-3" src="assets/heartwood-left-growth-3.png" alt="">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-3" src="assets/heartwood-right-growth-3.png" alt="">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-4" src="assets/heartwood-left-growth-4.png" alt="">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-4" src="assets/heartwood-right-growth-4.png" alt="">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-5" src="assets/heartwood-left-growth-5.png" alt="">
        <img class="mini-heartwood-layer tree-segment tree-growth-stage-5" src="assets/heartwood-right-growth-5.png" alt="">
        <img class="mini-heartwood-layer tree-leaves-1" src="assets/heartwood-leaves-1.png" alt="">
        <img class="mini-heartwood-layer tree-leaves-2" src="assets/heartwood-leaves-2.png" alt="">
        <img class="mini-heartwood-layer tree-leaves-3" src="assets/heartwood-leaves-3.png" alt="">
        <img class="mini-heartwood-layer tree-leaves-4" src="assets/heartwood-leaves-4.png" alt="">
        <img class="mini-heartwood-layer tree-center-heart" src="assets/heartwood-rising-heart.png" alt="">
        <img class="mini-heartwood-layer tree-seed" src="assets/heartwood-seed.png" alt="">
      </div>
      <div class="mini-heartwood-wordmark">Better Together</div>
    </div>
  `;
  const stateMark = `
    <div class="mini-heartwood-mark" aria-hidden="true">
      <img class="mini-logo-img" src="assets/heartwood-logo.png" alt="">
      <span class="mini-seed"></span>
      <span class="mini-root-sprout"></span>
      <span class="mini-center-heart"></span>
      <span class="mini-frame-heart"></span>
    </div>`;
  return `
    <div class="mini-phone ${kind}">
      <div class="mini-screen">
        ${kind === "launch" ? launchMark : stateMark}
        ${kind === "launch" ? "" : `<p>Better Together</p><h3>${escapeHtml(item.headline)}</h3>`}
        ${kind === "launch" ? "" : kind === "skeleton" ? '<div class="skeleton-lines"><i></i><i></i><i></i></div>' : '<div class="mini-loader"><i></i></div>'}
      </div>
    </div>`;
}

function card(item) {
  const review = reviewFor(item.id);
  const status = review.status || "undecided";
  const statusButton = (value, label) => `
    <button type="button" data-action="decision" data-id="${item.id}" data-status="${value}" class="${review.status === value ? "active" : ""}" aria-pressed="${review.status === value}">${label}</button>`;

  return `
    <article class="state-card" data-status="${status}">
      <div class="card-visual">
        <span class="state-number">${item.number}</span>
        <button class="favorite ${review.favorite ? "active" : ""}" type="button" data-action="favorite" data-id="${item.id}" aria-label="Favorite ${escapeHtml(item.title)}">♥</button>
        ${markPreview(item)}
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
