const INTERNAL_MARKERS = [
  "internal ai acrobatics smoke test",
  "internal smoke test",
  "ppp verification test",
  "implementation verification",
  "route verification",
  "verification",
  "portal test idea",
  "please ignore",
  "ai-13080",
  "ai-13081",
  "ai-10475",
  "ai-10476",
];

export function isClientVisiblePortalRecord(values: Array<string | undefined>) {
  return !values.some((value) => {
    if (typeof value !== "string") return false;
    const normalized = value.toLowerCase();
    return INTERNAL_MARKERS.some((marker) => normalized.includes(marker));
  });
}
