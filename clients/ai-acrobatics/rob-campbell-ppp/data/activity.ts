import { changelog } from "./changelog";

export const activity = changelog.map((item, index) => ({
  id: `activity-${index + 1}`,
  ...item,
  source: "AI Acrobatics",
}));

