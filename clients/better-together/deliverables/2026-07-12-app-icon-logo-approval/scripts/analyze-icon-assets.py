#!/usr/bin/env python3
"""Measure icon legibility signals at App Store and home-screen sizes."""

from __future__ import annotations

import argparse
import json
import math
import statistics
from pathlib import Path

from PIL import Image, ImageFilter, ImageStat


THUMBNAIL_SIZES = (60, 40, 29, 20)


def pixels(image: Image.Image):
    getter = getattr(image, "get_flattened_data", None)
    return getter() if getter else image.getdata()


def percentile(values: list[int], position: float) -> float:
    ordered = sorted(values)
    index = min(len(ordered) - 1, max(0, round(position * (len(ordered) - 1))))
    return float(ordered[index])


def normalized_contrast(image: Image.Image) -> float:
    values = list(pixels(image.convert("L")))
    return round((percentile(values, 0.95) - percentile(values, 0.05)) / 255, 4)


def edge_density(image: Image.Image) -> float:
    edges = image.convert("L").filter(ImageFilter.FIND_EDGES)
    values = list(pixels(edges))
    return round(sum(value >= 36 for value in values) / len(values), 4)


def dominant_colors(image: Image.Image) -> tuple[int, list[dict]]:
    sample = image.convert("RGB").resize((128, 128), Image.Resampling.LANCZOS)
    quantized = sample.quantize(colors=8, method=Image.Quantize.MEDIANCUT)
    counts = quantized.getcolors(maxcolors=8) or []
    palette = quantized.getpalette()
    total = sample.width * sample.height
    colors = []
    for count, index in sorted(counts, reverse=True):
        start = index * 3
        rgb = palette[start:start + 3]
        share = count / total
        if share >= 0.035:
            colors.append({"hex": "#" + "".join(f"{value:02X}" for value in rgb), "share": round(share, 4)})
    return len(colors), colors[:5]


def center_balance(image: Image.Image) -> float:
    gray = image.convert("L").resize((96, 96), Image.Resampling.LANCZOS)
    edges = gray.filter(ImageFilter.FIND_EDGES)
    width, height = edges.size
    weighted_x = weighted_y = total = 0.0
    for y in range(height):
        for x in range(width):
            weight = edges.getpixel((x, y))
            weighted_x += x * weight
            weighted_y += y * weight
            total += weight
    if total == 0:
        return 0.0
    center_x = weighted_x / total
    center_y = weighted_y / total
    distance = math.hypot(center_x - (width - 1) / 2, center_y - (height - 1) / 2)
    maximum = math.hypot(width / 2, height / 2)
    return round(max(0.0, 1 - distance / maximum), 4)


def visual_mass(image: Image.Image) -> float:
    rgb = image.convert("RGB").resize((96, 96), Image.Resampling.LANCZOS)
    corners = [rgb.getpixel((x, y)) for x, y in ((2, 2), (93, 2), (2, 93), (93, 93))]
    background = tuple(round(statistics.median(channel)) for channel in zip(*corners))
    changed = 0
    for pixel in pixels(rgb):
        distance = math.sqrt(sum((pixel[index] - background[index]) ** 2 for index in range(3)))
        changed += distance >= 34
    return round(changed / (rgb.width * rgb.height), 4)


def analyze(path: Path) -> dict:
    with Image.open(path) as source:
        image = source.convert("RGBA")
        color_count, colors = dominant_colors(image)
        small = {}
        for size in THUMBNAIL_SIZES:
            thumb = image.convert("RGB").resize((size, size), Image.Resampling.LANCZOS)
            small[str(size)] = {
                "contrast": normalized_contrast(thumb),
                "edgeDensity": edge_density(thumb),
                "luminanceSpread": round(ImageStat.Stat(thumb.convert("L")).stddev[0] / 128, 4),
            }
        metrics = {
            "file": str(path),
            "width": image.width,
            "height": image.height,
            "dominantColorCount": color_count,
            "dominantColors": colors,
            "contrast": normalized_contrast(image.convert("RGB").resize((256, 256))),
            "edgeDensity": edge_density(image.convert("RGB").resize((256, 256))),
            "centerBalance": center_balance(image),
            "visualMass": visual_mass(image),
            "smallSizes": small,
        }
        metrics["gate"] = gate(metrics)
        return metrics


def gate(metrics: dict) -> dict:
    checks = {
        "square1024": metrics["width"] == 1024 and metrics["height"] == 1024,
        "paletteDiscipline": 2 <= metrics["dominantColorCount"] <= 5,
        "smallContrast": metrics["smallSizes"]["20"]["contrast"] >= 0.35,
        "smallComplexity": metrics["smallSizes"]["20"]["edgeDensity"] <= 0.48,
        "centered": metrics["centerBalance"] >= 0.90,
        "visualWeight": 0.16 <= metrics["visualMass"] <= 0.88,
    }
    return {"passed": all(checks.values()), "checks": checks}


def median_signal(results: list[dict], path: tuple[str, ...]) -> float:
    values = []
    for result in results:
        value = result
        for key in path:
            value = value[key]
        values.append(value)
    return round(statistics.median(values), 4)


def markdown_report(results: list[dict], title: str, mode: str) -> str:
    median_contrast = median_signal(results, ("contrast",))
    median_edge = median_signal(results, ("edgeDensity",))
    median_center = median_signal(results, ("centerBalance",))
    median_mass = median_signal(results, ("visualMass",))
    median_small_contrast = median_signal(results, ("smallSizes", "20", "contrast"))
    rows = [
        f"# {title}",
        "",
        "These measurements are design signals, not a ranking of brand quality. Human silhouette and trademark review remains mandatory.",
        "",
        "## Cohort signal",
        "",
        f"- Median full-size contrast: `{median_contrast:.2f}`",
        f"- Median edge density: `{median_edge:.2f}`",
        f"- Median center balance: `{median_center:.2f}`",
        f"- Median visual mass: `{median_mass:.2f}`",
        f"- Median 20 px contrast: `{median_small_contrast:.2f}`",
        "",
        "The repeatable pattern is a centered core idea, low edge density, and enough contrast to remain visible at 20 px. Color count varies because current layered icons can use gradients and translucency.",
        "",
        "| Icon | Colors | Contrast | Edge density | Centered | Mass | 20 px contrast |" + (" Candidate gate |" if mode == "candidate" else ""),
        "|---|---:|---:|---:|---:|---:|---:|" + ("---|" if mode == "candidate" else ""),
    ]
    for result in results:
        row = (
            f"| {Path(result['file']).stem} | {result['dominantColorCount']} | {result['contrast']:.2f} | "
            f"{result['edgeDensity']:.2f} | {result['centerBalance']:.2f} | {result['visualMass']:.2f} | "
            f"{result['smallSizes']['20']['contrast']:.2f} |"
        )
        if mode == "candidate":
            row += f" {'Pass' if result['gate']['passed'] else 'Review'} |"
        rows.append(row)
    return "\n".join(rows) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", required=True, type=Path)
    parser.add_argument("--json", required=True, type=Path)
    parser.add_argument("--markdown", required=True, type=Path)
    parser.add_argument("--title", default="Icon benchmark report")
    parser.add_argument("--mode", choices=("benchmark", "candidate"), default="benchmark")
    args = parser.parse_args()

    paths = sorted(path for path in args.dir.glob("*.png") if path.is_file())
    if not paths:
        raise SystemExit(f"No PNG files found in {args.dir}")
    results = [analyze(path) for path in paths]
    args.json.parent.mkdir(parents=True, exist_ok=True)
    args.markdown.parent.mkdir(parents=True, exist_ok=True)
    args.json.write_text(json.dumps({"icons": results}, indent=2) + "\n")
    args.markdown.write_text(markdown_report(results, args.title, args.mode))
    summary = {
        "status": "success",
        "count": len(results),
        "json": str(args.json),
        "markdown": str(args.markdown),
    }
    if args.mode == "candidate":
        summary["passed"] = sum(result["gate"]["passed"] for result in results)
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
