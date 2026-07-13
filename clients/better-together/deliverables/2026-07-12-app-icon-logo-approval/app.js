const STORAGE_KEY = "better-together-icon-review-v1";

let concepts = [];
let familyFilter = "all";
let statusFilter = "all";
let toastTimer;
let state = {
  version: 1,
  reviewer: "",
  overallNotes: "",
  decisions: {},
};

const grid = document.getElementById("conceptGrid");

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
      state = { ...state, ...decodeReview(hash) };
      saveState("Shared review loaded");
      return;
    } catch (error) {
      showToast("This review link could not be read.");
    }
  }

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.version === 1) state = { ...state, ...stored };
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function matchesFilters(concept) {
  if (familyFilter !== "all" && concept.family !== familyFilter) return false;
  const status = reviewFor(concept.id).status || "undecided";
  return statusFilter === "all" || statusFilter === status;
}

function conceptCard(concept) {
  const review = reviewFor(concept.id);
  const status = review.status || "undecided";
  const darkClass = concept.background === "dark" ? " dark" : "";
  const strengths = concept.strengths.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const statusButton = (value, label) => `
    <button type="button" data-action="decision" data-id="${concept.id}" data-status="${value}" class="${review.status === value ? "active" : ""}" aria-pressed="${review.status === value}">${label}</button>`;

  return `
    <article class="concept-card" data-status="${status}" data-concept="${concept.id}">
      <div class="concept-image-stage${darkClass}">
        <img src="${concept.file}" alt="${escapeHtml(concept.name)} app icon concept" width="1024" height="1024" loading="lazy">
        <span class="concept-number">${concept.number}</span>
        <button class="favorite-button ${review.favorite ? "active" : ""}" type="button" data-action="favorite" data-id="${concept.id}" aria-label="${review.favorite ? "Remove" : "Add"} ${escapeHtml(concept.name)} as a favorite" aria-pressed="${review.favorite}"><i data-lucide="heart"></i></button>
      </div>
      <div class="concept-content">
        <p class="family-label">${escapeHtml(concept.family)}</p>
        <h3 class="concept-title">${escapeHtml(concept.name)}</h3>
        <p class="concept-idea">${escapeHtml(concept.idea)}</p>

        <div class="application-preview" aria-label="Platform previews">
          <div class="preview-group">
            <span>iOS sizes</span>
            <div class="size-row">
              <img class="size-58" src="${concept.file}" alt="" aria-hidden="true">
              <img class="size-40" src="${concept.file}" alt="" aria-hidden="true">
              <img class="size-29" src="${concept.file}" alt="" aria-hidden="true">
            </div>
          </div>
          <div class="preview-group">
            <span>Android masks</span>
            <div class="mask-row">
              <img class="mask-squircle" src="${concept.file}" alt="" aria-hidden="true">
              <img class="mask-circle" src="${concept.file}" alt="" aria-hidden="true">
              <img class="mask-rounded" src="${concept.file}" alt="" aria-hidden="true">
            </div>
          </div>
        </div>

        <div class="wordmark-preview">
          <img src="${concept.file}" alt="" aria-hidden="true">
          <div class="wordmark-text">Better Together<small>Love is a living thing</small></div>
        </div>

        <div class="strength-list">${strengths}</div>
        <p class="watchout"><strong>Refinement watch:</strong> ${escapeHtml(concept.watchout)}</p>

        <div class="decision-control" role="group" aria-label="Decision for ${escapeHtml(concept.name)}">
          ${statusButton("approve", "Approve")}
          ${statusButton("revise", "Needs change")}
          ${statusButton("hold", "Hold")}
        </div>
        <label class="note-label">
          <span>Notes for this direction</span>
          <textarea data-action="note" data-id="${concept.id}" placeholder="What should change or stay?">${escapeHtml(review.note)}</textarea>
        </label>
      </div>
    </article>`;
}

function render() {
  const visible = concepts.filter(matchesFilters);
  grid.innerHTML = visible.length
    ? visible.map(conceptCard).join("")
    : '<p class="empty-state">No concepts match these filters.</p>';
  document.getElementById("visibleCount").textContent = `${visible.length} concept${visible.length === 1 ? "" : "s"}`;
  if (window.lucide) lucide.createIcons();
  decorateButtons();
  updateSummary();
}

function decorateButtons() {
  if (!window.lucide) return;
  document.querySelectorAll("[data-lucide-button]").forEach((button) => {
    if (button.querySelector("svg")) return;
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", button.dataset.lucideButton);
    button.prepend(icon);
  });
  lucide.createIcons();
}

function updateSummary() {
  const values = concepts.map((concept) => reviewFor(concept.id).status).filter(Boolean);
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
  concepts.forEach((concept) => {
    const review = reviewFor(concept.id);
    groups[review.status || "undecided"].push(`${concept.number} ${concept.name}${review.favorite ? " [favorite]" : ""}${review.note ? ` - ${review.note}` : ""}`);
  });

  return [
    "Better Together app icon and logo review",
    state.reviewer ? `Reviewer: ${state.reviewer}` : "",
    `Approved: ${groups.approve.join("; ") || "None"}`,
    `Needs changes: ${groups.revise.join("; ") || "None"}`,
    `Hold: ${groups.hold.join("; ") || "None"}`,
    `Undecided: ${groups.undecided.join("; ") || "None"}`,
    state.overallNotes ? `Overall notes: ${state.overallNotes}` : "",
  ].filter(Boolean).join("\n");
}

async function copyText(value, message) {
  await navigator.clipboard.writeText(value);
  showToast(message);
}

async function shareReview() {
  saveState();
  const url = new URL(location.href);
  url.hash = new URLSearchParams({ review: encodeReview(state) }).toString();
  history.replaceState(null, "", url);
  const shareData = { title: "Better Together icon review", text: "My Better Together app icon and logo feedback", url: url.toString() };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast("Review shared.");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  await copyText(url.toString(), "Review link copied.");
}

function downloadReview() {
  saveState();
  const payload = { project: "Better Together", board: "App Icon & Logo Approval", exportedAt: new Date().toISOString(), ...state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = "better-together-icon-review.json";
  anchor.click();
  URL.revokeObjectURL(anchor.href);
  showToast("Review downloaded.");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "decision") updateDecision(button.dataset.id, button.dataset.status);
  if (button.dataset.action === "favorite") updateFavorite(button.dataset.id);
});

grid.addEventListener("input", (event) => {
  if (event.target.dataset.action !== "note") return;
  const current = reviewFor(event.target.dataset.id);
  state.decisions[event.target.dataset.id] = { ...current, note: event.target.value };
  saveState();
});

document.getElementById("familyFilters").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-family]");
  if (!button) return;
  familyFilter = button.dataset.family;
  document.querySelectorAll("[data-family]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", active);
  });
  render();
});

document.getElementById("statusFilter").addEventListener("change", (event) => {
  statusFilter = event.target.value;
  render();
});

document.getElementById("reviewerName").addEventListener("input", (event) => {
  state.reviewer = event.target.value;
  saveState();
});

document.getElementById("overallNotes").addEventListener("input", (event) => {
  state.overallNotes = event.target.value;
  saveState();
});

document.getElementById("shareReview").addEventListener("click", shareReview);
document.getElementById("copySummary").addEventListener("click", () => copyText(reviewSummary(), "Review summary copied."));
document.getElementById("downloadReview").addEventListener("click", downloadReview);
document.getElementById("resetReview").addEventListener("click", () => {
  if (!confirm("Clear all decisions and notes on this device?")) return;
  state = { version: 1, reviewer: "", overallNotes: "", decisions: {} };
  localStorage.removeItem(STORAGE_KEY);
  history.replaceState(null, "", location.pathname + location.search);
  document.getElementById("reviewerName").value = "";
  document.getElementById("overallNotes").value = "";
  render();
  showToast("Review reset.");
});

fetch("concepts.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Concept manifest failed: ${response.status}`);
    return response.json();
  })
  .then((data) => {
    concepts = data.concepts;
    loadState();
    document.getElementById("reviewerName").value = state.reviewer || "";
    document.getElementById("overallNotes").value = state.overallNotes || "";
    render();
  })
  .catch((error) => {
    grid.innerHTML = `<p class="empty-state">The concept list could not load. ${escapeHtml(error.message)}</p>`;
  });

decorateButtons();
