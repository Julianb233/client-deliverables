# Better Together App Icon Research - Round 3

Date: 2026-07-12

## What changed

Round 2 named useful references but did not convert them into a reproducible generation and rejection system. Round 3 adds a current official-source benchmark, measurable small-size signals, versioned Nano Banana prompts, automated gates, and a written human rejection log.

## Official sources

- [Apple Human Interface Guidelines: App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons/), updated June 8, 2026 for Liquid Glass.
- [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion/).
- [Apple reveals the 2026 Apple Design Award winners](https://www.apple.com/newsroom/2026/06/apple-reveals-winners-of-the-2026-apple-design-awards/).
- Official App Store listings and artwork metadata retrieved through Apple's iTunes Lookup API.

Apple's current guidance favors a memorable core idea, a minimal number of shapes, centered primary content, unmasked square layers, clear foreground edges, consistency across default/dark/clear/tinted appearances, and layered source art prepared for Icon Composer. Motion must be purposeful and optional.

## Benchmark cohort

The ten-app research cohort combines current Apple-recognized design and relevant category leaders:

- 2026 Apple Design Award winner or finalist: grug, Moonlitt, Tide Guide, Structured.
- Relationship and social connection: Paired, Agape, Locket.
- Wellness and self-care leaders: Headspace, Calm, Finch.

Recognition applies to each complete product, not its icon alone. The cohort is used to identify structural signals, not to claim that Apple ranked these icons.

## Measured signal

Across the ten current App Store icons:

- Median center balance: `0.99`.
- Median edge density: `0.04`.
- Median 20 px contrast: `0.53`.
- Median visual mass: `0.28`.

Human inspection found that eight of ten organize recognition around one dominant subject or silhouette. The two text-led exceptions use unusually short brand names, so a text icon is not appropriate for Better Together.

## Round 3 result

- 11 Nano Banana renders generated with `gemini-3-pro-image-preview`.
- 7 rejected during human review for mask, lookalike, semantic, or small-size failures.
- 4 curated finalists.
- 4 of 4 technically valid at 1024 by 1024.
- 4 of 4 pass the candidate metric gates.

Curated finalists range from `0.55` to `0.79` contrast at 20 px and from `0.94` to `1.00` center balance.

## Reproduction

```bash
python scripts/fetch-app-store-benchmarks.py \
  --manifest research/benchmarks-v3.json \
  --output-dir research/app-store-icons \
  --metadata research/reports/app-store-metadata-v3.json

python scripts/analyze-icon-assets.py \
  --dir research/app-store-icons \
  --json research/reports/benchmark-metrics-v3.json \
  --markdown research/reports/benchmark-metrics-v3.md \
  --mode benchmark

python scripts/generate-round3.py \
  --config research/generation-v3.json \
  --project-dir . \
  --max-attempts 2

python scripts/analyze-icon-assets.py \
  --dir assets/icons-v3 \
  --json research/reports/candidate-metrics-v3.json \
  --markdown research/reports/candidate-metrics-v3.md \
  --mode candidate
```

## Copyright and trademark boundary

Third-party artwork is never passed to the image model, embedded in the approval board, traced, or used as a geometry reference. The generation prompts explicitly prohibit competitor imitation and copied trademark geometry. The winning direction still requires an exact vector master and a formal trademark clearance search before production release.
