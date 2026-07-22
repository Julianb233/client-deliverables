const STORAGE_KEY = "better-together-identity-review-v4";

let concepts = [];
let familyFilter = "all";
let statusFilter = "all";
let toastTimer;
let state = {
  version: 4,
  reviewer: "",
  overallNotes: "",
  decisions: {},
};

const grid = document.getElementById("conceptGrid");
const variationGrid = document.getElementById("variationGrid");
const communityGrid = document.getElementById("communityGrid");

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

function decisionStatusFor(concept) {
  return reviewFor(concept.id).status || (concept.approved ? "approve" : "undecided");
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
      if (shared?.version === 4) {
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
    if (stored?.version === 4) state = { ...state, ...stored };
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function matchesFilters(concept) {
  if (familyFilter !== "all" && concept.family !== familyFilter) return false;
  const status = decisionStatusFor(concept);
  return statusFilter === "all" || statusFilter === status;
}

function sizeSample(file, size, label) {
  return `<span class="size-sample"><img class="size-${size}" src="${file}" alt="" aria-hidden="true"><b>${label}</b></span>`;
}

function motionSteps(concept) {
  const steps = concept.motionSteps || ["Separate", "Connect", "Grow", "Settle"];
  return steps.map((step, index) => `${index ? "<i></i>" : ""}<b>${escapeHtml(step)}</b>`).join("");
}

function motionArtwork(concept, file) {
  if (concept.id !== "heartwood-bonsai") {
    return `<img class="motion-icon" src="${file}" alt="" aria-hidden="true">`;
  }

  return `
    <div class="heartwood-motion-art" aria-hidden="true">
      <img class="motion-icon heartwood-final-icon" src="${file}" alt="">
      <svg class="heartwood-motion-sequence" viewBox="0 0 120 120" focusable="false">
        <rect x="8" y="8" width="104" height="104" rx="23" fill="#113b36"/>
        <g class="heartwood-left-tree">
          <path d="M55 101c-13-3-22-13-21-27 1-12 8-24 19-33-5 16-2 27 8 35 6 5 7 13 2 22-2 2-5 3-8 3Z" fill="#e5533a"/>
          <path d="M43 54c-10-1-17-7-18-15 9-1 18 4 22 13l-4 2Zm8-14c-6-6-7-14-3-20 8 4 11 12 8 20h-5Z" fill="#faf8f5"/>
        </g>
        <g class="heartwood-right-tree">
          <path d="M65 101c13-3 22-13 21-27-1-12-8-24-19-33 5 16 2 27-8 35-6 5-7 13-2 22 2 2 5 3 8 3Z" fill="#faf8f5"/>
          <path d="M77 54c10-1 17-7 18-15-9-1-18 4-22 13l4 2Zm-8-14c6-6 7-14 3-20-8 4-11 12-8 20h5Z" fill="#faf8f5"/>
        </g>
        <g class="heartwood-canopy">
          <path d="M37 36c-9-2-14-8-14-15 9-1 17 4 20 12l-6 3Zm46 0c9-2 14-8 14-15-9-1-17 4-20 12l6 3ZM60 34c-7-7-8-17-1-25 8 7 9 17 2 25h-1Z" fill="#faf8f5"/>
        </g>
        <path class="heartwood-heart-reveal" d="M60 70c-6-8-18-7-18 3 0 10 18 20 18 20s18-10 18-20c0-10-12-11-18-3Z" fill="#113b36"/>
        <g class="heartwood-seed">
          <path d="M60 95c-5-7-15-6-15 3 0 8 15 15 15 15s15-7 15-15c0-9-10-10-15-3Z" fill="#d99a3d" stroke="#113b36" stroke-width="2.5"/>
        </g>
      </svg>
    </div>`;
}

function conceptCard(concept) {
  const review = reviewFor(concept.id);
  const status = decisionStatusFor(concept);
  const file = `${concept.file}?v=round5-heartwood2`;
  const lockup = `${concept.lockup}?v=round5-heartwood2`;
  const note = Object.hasOwn(state.decisions, concept.id) ? review.note : (concept.approvalNote || "");
  const layers = concept.layers.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const variantLabel = concept.variantOf
    ? `<p class="variant-of"><i data-lucide="git-branch"></i>Variation of ${escapeHtml(concept.variantOf)}</p>`
    : concept.round === "family-feedback"
      ? '<p class="variant-of community-label"><i data-lucide="users"></i>Added for family feedback</p>'
    : "";
  const approvalBadge = concept.approved
    ? `<div class="approval-banner"><i data-lucide="badge-check"></i><span><strong>Approved direction</strong>${escapeHtml(concept.approvalNote)}</span></div>`
    : "";
  const statusButton = (value, label) => `
    <button type="button" data-action="decision" data-id="${concept.id}" data-status="${value}" class="${status === value ? "active" : ""}" aria-pressed="${status === value}">${label}</button>`;

  return `
    <article id="concept-${concept.id}" class="concept-card ${concept.approved ? "is-approved" : ""} ${concept.variantOf ? "is-variation" : ""} ${concept.round === "family-feedback" ? "is-community" : ""}" data-status="${status}" data-concept="${concept.id}">
      <div class="concept-image-stage">
        <img src="${file}" alt="${escapeHtml(concept.name)} app icon concept" width="1024" height="1024">
        <span class="concept-number">${concept.number}</span>
        <button class="favorite-button ${review.favorite ? "active" : ""}" type="button" data-action="favorite" data-id="${concept.id}" aria-label="${review.favorite ? "Remove" : "Add"} ${escapeHtml(concept.name)} as a favorite" aria-pressed="${review.favorite}"><i data-lucide="heart"></i></button>
      </div>
      <div class="concept-content">
        <p class="family-label">${escapeHtml(concept.family)}</p>
        <h3>${escapeHtml(concept.name)}</h3>
        ${approvalBadge}
        ${variantLabel}
        <p class="concept-idea">${escapeHtml(concept.idea)}</p>

        <div class="metric-row" aria-label="Measured icon signals">
          <span><strong>${concept.metrics.small20Contrast.toFixed(2)}</strong>20 px contrast</span>
          <span><strong>${Math.round(concept.metrics.centerBalance * 100)}%</strong>center balance</span>
          <span><strong>${concept.metrics.edgeDensity.toFixed(2)}</strong>edge density</span>
        </div>

        <div class="proof-panel" aria-label="Scale and mask tests">
          <div class="proof-group">
            <span>Actual iOS sizes</span>
            <div class="size-row">
              ${sizeSample(file, 60, "60")}
              ${sizeSample(file, 40, "40")}
              ${sizeSample(file, 29, "29")}
              ${sizeSample(file, 20, "20")}
            </div>
          </div>
          <div class="proof-group">
            <span>Platform masks</span>
            <div class="mask-row">
              <img class="mask-squircle" src="${file}" alt="" aria-hidden="true">
              <img class="mask-circle" src="${file}" alt="" aria-hidden="true">
            </div>
          </div>
        </div>

        <div class="appearance-row" aria-label="Appearance checks">
          <span class="appearance"><span class="appearance-frame"><img src="${file}" alt="" aria-hidden="true"></span>Default</span>
          <span class="appearance appearance-dark"><span class="appearance-frame"><img src="${file}" alt="" aria-hidden="true"></span>Dark check</span>
          <span class="appearance appearance-tinted"><span class="appearance-frame"><img src="${file}" alt="" aria-hidden="true"></span>Tinted check</span>
        </div>

        <div class="motion-panel">
          <div class="motion-stage" data-motion="${concept.motion}" data-duration="${concept.motionDuration || 2100}">
            ${motionArtwork(concept, file)}
            <button class="motion-play" type="button" data-action="motion" title="Play motion preview" aria-label="Play ${escapeHtml(concept.name)} motion preview"><i data-lucide="play"></i></button>
          </div>
          <div class="motion-copy">
            <span>Motion grammar</span>
            <strong>${escapeHtml(concept.motionLabel)}</strong>
            <div class="motion-steps" aria-label="Motion sequence">${motionSteps(concept)}</div>
          </div>
        </div>

        <div class="identity-lockup" aria-label="Generated Better Together wordmark lockup">
          <span>Full-name lockup</span>
          <div class="identity-lockup-frame">
            <img src="${lockup}" alt="${escapeHtml(concept.name)} Better Together wordmark lockup" width="1024" height="1024">
          </div>
        </div>

        <div class="layer-list" aria-label="Production layers">${layers}</div>
        <div class="identity-advice">
          <p><span>Best for</span>${escapeHtml(concept.bestFor)}</p>
          <p><span>Next production step</span>${escapeHtml(concept.nextStep)}</p>
        </div>
        <p class="watchout"><strong>Refinement watch:</strong> ${escapeHtml(concept.watchout)}</p>

        <div class="decision-control" role="group" aria-label="Decision for ${escapeHtml(concept.name)}">
          ${statusButton("approve", "Approve")}
          ${statusButton("revise", "Needs change")}
          ${statusButton("hold", "Hold")}
        </div>
        <label class="note-label">
          <span>Notes for this direction</span>
          <textarea data-action="note" data-id="${concept.id}" placeholder="What should change or stay?">${escapeHtml(note)}</textarea>
        </label>
      </div>
    </article>`;
}

function render() {
  const visible = concepts.filter(matchesFilters);
  const primaryVisible = visible.filter((concept) => !concept.variantOf && concept.round !== "family-feedback");
  const variationVisible = visible.filter((concept) => concept.variantOf);
  const communityVisible = visible.filter((concept) => concept.round === "family-feedback");
  grid.innerHTML = primaryVisible.length
    ? primaryVisible.map(conceptCard).join("")
    : '<p class="empty-state">No concepts match these filters.</p>';
  variationGrid.innerHTML = variationVisible.length
    ? variationVisible.map(conceptCard).join("")
    : '<p class="empty-state">No variations match these filters.</p>';
  communityGrid.innerHTML = communityVisible.length
    ? communityVisible.map(conceptCard).join("")
    : '<p class="empty-state">No family-feedback options match these filters.</p>';
  document.getElementById("visibleCount").textContent = `${visible.length} choice${visible.length === 1 ? "" : "s"}`;
  document.querySelector(".decision-total span").textContent = `of ${concepts.length} decided`;
  if (window.lucide) lucide.createIcons();
  decorateButtons();
  updateSummary();
}

function scrollToLinkedConcept() {
  if (!location.hash.startsWith("#concept-")) return;
  const target = document.getElementById(location.hash.slice(1));
  if (!target) return;
  requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
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
  const values = concepts.map(decisionStatusFor).filter((status) => status !== "undecided");
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
  window.setTimeout(() => stage.classList.remove("is-playing"), Number(stage.dataset.duration || 2100));
}

function reviewSummary() {
  const groups = { approve: [], revise: [], hold: [], undecided: [] };
  concepts.forEach((concept) => {
    const review = reviewFor(concept.id);
    const note = Object.hasOwn(state.decisions, concept.id) ? review.note : (concept.approvalNote || "");
    groups[decisionStatusFor(concept)].push(`${concept.number} ${concept.name}${review.favorite ? " [favorite]" : ""}${note ? ` - ${note}` : ""}`);
  });

  return [
    "Better Together identity review - Round 5",
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
  const shareData = { title: "Better Together identity review", text: "My Better Together identity feedback", url: url.toString() };
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
  const payload = { project: "Better Together", board: "BT, Heart, and Bonsai Identity Approval - Round 5", exportedAt: new Date().toISOString(), ...state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = "better-together-identity-round5-review.json";
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

function handleGridClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "decision") updateDecision(button.dataset.id, button.dataset.status);
  if (button.dataset.action === "favorite") updateFavorite(button.dataset.id);
  if (button.dataset.action === "motion") playMotion(button);
}

function handleGridInput(event) {
  if (event.target.dataset.action !== "note") return;
  const current = reviewFor(event.target.dataset.id);
  state.decisions[event.target.dataset.id] = { ...current, note: event.target.value };
  saveState();
}

[grid, variationGrid, communityGrid].forEach((targetGrid) => {
  targetGrid.addEventListener("click", handleGridClick);
  targetGrid.addEventListener("input", handleGridInput);
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
  state = { version: 4, reviewer: "", overallNotes: "", decisions: {} };
  localStorage.removeItem(STORAGE_KEY);
  history.replaceState(null, "", location.pathname + location.search);
  document.getElementById("reviewerName").value = "";
  document.getElementById("overallNotes").value = "";
  render();
  showToast("Review reset.");
});

fetch("concepts-v4.json?v=5-heartwood2")
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
    scrollToLinkedConcept();
  })
  .catch((error) => {
    const message = `<p class="empty-state">The concept list could not load. ${escapeHtml(error.message)}</p>`;
    grid.innerHTML = message;
    variationGrid.innerHTML = message;
    communityGrid.innerHTML = message;
  });

decorateButtons();
