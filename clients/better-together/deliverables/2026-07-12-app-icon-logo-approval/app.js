const STORAGE_KEY = "better-together-garden-seal-review-v2";

let concepts = [];
let familyFilter = "all";
let statusFilter = "all";
let toastTimer;
let state = {
  version: 2,
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
      const shared = decodeReview(hash);
      if (shared?.version === 2) {
        state = { ...state, ...shared };
        saveState("Shared review loaded");
        return;
      }
    } catch (error) {
      showToast("This review link could not be read.");
    }
  }

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.version === 2) state = { ...state, ...stored };
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function matchesFilters(concept) {
  if (familyFilter !== "all" && concept.family !== familyFilter) return false;
  const status = reviewFor(concept.id).status || "undecided";
  return statusFilter === "all" || statusFilter === status;
}

function sizeSample(file, size, label) {
  return `<span class="size-sample"><img class="size-${size}" src="${file}" alt="" aria-hidden="true"><b>${label}</b></span>`;
}

function conceptCard(concept) {
  const review = reviewFor(concept.id);
  const status = review.status || "undecided";
  const layers = concept.layers.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const statusButton = (value, label) => `
    <button type="button" data-action="decision" data-id="${concept.id}" data-status="${value}" class="${review.status === value ? "active" : ""}" aria-pressed="${review.status === value}">${label}</button>`;

  return `
    <article class="concept-card" data-status="${status}" data-concept="${concept.id}">
      <div class="concept-image-stage">
        <img src="${concept.file}" alt="${escapeHtml(concept.name)} app icon concept" width="1024" height="1024">
        <span class="concept-number">${concept.number}</span>
        <button class="favorite-button ${review.favorite ? "active" : ""}" type="button" data-action="favorite" data-id="${concept.id}" aria-label="${review.favorite ? "Remove" : "Add"} ${escapeHtml(concept.name)} as a favorite" aria-pressed="${review.favorite}"><i data-lucide="heart"></i></button>
      </div>
      <div class="concept-content">
        <p class="family-label">${escapeHtml(concept.family)}</p>
        <h3>${escapeHtml(concept.name)}</h3>
        <p class="concept-idea">${escapeHtml(concept.idea)}</p>

        <div class="proof-panel" aria-label="Scale and mask tests">
          <div class="proof-group">
            <span>Actual iOS sizes</span>
            <div class="size-row">
              ${sizeSample(concept.file, 60, "60")}
              ${sizeSample(concept.file, 40, "40")}
              ${sizeSample(concept.file, 29, "29")}
              ${sizeSample(concept.file, 20, "20")}
            </div>
          </div>
          <div class="proof-group">
            <span>Platform masks</span>
            <div class="mask-row">
              <img class="mask-squircle" src="${concept.file}" alt="" aria-hidden="true">
              <img class="mask-circle" src="${concept.file}" alt="" aria-hidden="true">
            </div>
          </div>
        </div>

        <div class="appearance-row" aria-label="Appearance checks">
          <span class="appearance"><span class="appearance-frame"><img src="${concept.file}" alt="" aria-hidden="true"></span>Default</span>
          <span class="appearance appearance-dark"><span class="appearance-frame"><img src="${concept.file}" alt="" aria-hidden="true"></span>Dark check</span>
          <span class="appearance appearance-tinted"><span class="appearance-frame"><img src="${concept.file}" alt="" aria-hidden="true"></span>Tinted check</span>
        </div>

        <div class="motion-panel">
          <div class="motion-stage" data-motion="${concept.motion}">
            <img class="motion-icon" src="${concept.file}" alt="" aria-hidden="true">
            <button class="motion-play" type="button" data-action="motion" title="Play motion preview" aria-label="Play ${escapeHtml(concept.name)} motion preview"><i data-lucide="play"></i></button>
          </div>
          <div class="motion-copy">
            <span>Motion grammar</span>
            <strong>${escapeHtml(concept.motionLabel)}</strong>
            <div class="motion-steps" aria-label="Motion sequence"><b>Separate</b><i></i><b>Connect</b><i></i><b>Grow</b><i></i><b>Settle</b></div>
          </div>
        </div>

        <div class="wordmark-preview" aria-label="Better Together wordmark lockup preview">
          <img src="${concept.file}" alt="" aria-hidden="true">
          <div><strong>Better Together</strong><span>Love is a living thing</span></div>
        </div>

        <div class="layer-list" aria-label="Production layers">${layers}</div>
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
  document.querySelector(".decision-total span").textContent = `of ${concepts.length} decided`;
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

function playMotion(button) {
  const stage = button.closest(".motion-stage");
  stage.classList.remove("is-playing");
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add("is-playing")));
  window.setTimeout(() => stage.classList.remove("is-playing"), 2100);
}

function reviewSummary() {
  const groups = { approve: [], revise: [], hold: [], undecided: [] };
  concepts.forEach((concept) => {
    const review = reviewFor(concept.id);
    groups[review.status || "undecided"].push(`${concept.number} ${concept.name}${review.favorite ? " [favorite]" : ""}${review.note ? ` - ${review.note}` : ""}`);
  });

  return [
    "Better Together Garden Seal app icon review - Round 2",
    state.reviewer ? `Reviewer: ${state.reviewer}` : "",
    `Approved: ${groups.approve.join("; ") || "None"}`,
    `Needs changes: ${groups.revise.join("; ") || "None"}`,
    `Hold: ${groups.hold.join("; ") || "None"}`,
    `Undecided: ${groups.undecided.join("; ") || "None"}`,
    state.overallNotes ? `Overall notes: ${state.overallNotes}` : "",
  ].filter(Boolean).join("\n");
}

async function copyText(value, message) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    const input = document.createElement("textarea");
    input.value = value;
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  showToast(message);
}

async function shareReview() {
  saveState();
  const url = new URL(location.href);
  url.hash = new URLSearchParams({ review: encodeReview(state) }).toString();
  history.replaceState(null, "", url);
  const shareData = { title: "Better Together Garden Seal review", text: "My Better Together app icon feedback", url: url.toString() };
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
  const payload = { project: "Better Together", board: "Garden Seal App Icon Approval - Round 2", exportedAt: new Date().toISOString(), ...state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = "better-together-garden-seal-review.json";
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
  if (button.dataset.action === "motion") playMotion(button);
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
  state = { version: 2, reviewer: "", overallNotes: "", decisions: {} };
  localStorage.removeItem(STORAGE_KEY);
  history.replaceState(null, "", location.pathname + location.search);
  document.getElementById("reviewerName").value = "";
  document.getElementById("overallNotes").value = "";
  render();
  showToast("Review reset.");
});

fetch("concepts-v2.json?v=2")
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
