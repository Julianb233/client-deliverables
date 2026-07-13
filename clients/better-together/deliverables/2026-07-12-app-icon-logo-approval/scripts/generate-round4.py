#!/usr/bin/env python3
"""Generate paired Better Together Round 4 icon and wordmark assets."""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


DEFAULT_GENERATOR = Path("/Users/julianbradley/.codex/skills/nano-banana-ui/scripts/generate_image.py")
DEFAULT_PYTHON = Path("/tmp/bt-nano-banana-venv/bin/python")


def load_analyzer(path: Path):
    spec = importlib.util.spec_from_file_location("icon_analyzer", path)
    if not spec or not spec.loader:
        raise RuntimeError(f"Could not import analyzer: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def technical_check(path: Path) -> dict:
    if not path.exists():
        return {"passed": False, "reason": "missing output"}
    size_bytes = path.stat().st_size
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            width, height = image.size
            corner_alpha = []
            if "A" in image.getbands():
                alpha = image.getchannel("A")
                corner_alpha = [
                    alpha.getpixel(point)
                    for point in ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1))
                ]
    except Exception as error:
        return {"passed": False, "reason": f"invalid image: {error}"}
    checks = {
        "size": size_bytes >= 10_000,
        "square1024": width == 1024 and height == 1024,
        "fullBleedCorners": not corner_alpha or min(corner_alpha) == 255,
    }
    return {
        "passed": all(checks.values()),
        "checks": checks,
        "bytes": size_bytes,
        "width": width,
        "height": height,
    }


def run_generation(python: Path, generator: Path, model: str, prompt: str, output: Path, reference: Path) -> dict:
    command = [
        str(python),
        str(generator),
        "--model",
        model,
        "--prompt",
        prompt,
        "--output",
        str(output),
        "--reference",
        str(reference),
    ]
    completed = subprocess.run(
        command,
        check=False,
        capture_output=True,
        text=True,
        env=os.environ.copy(),
        stdin=subprocess.DEVNULL,
    )
    response = {
        "returncode": completed.returncode,
        "stdout": completed.stdout.strip(),
        "stderr": completed.stderr.strip(),
    }
    if completed.returncode != 0:
        raise RuntimeError(f"Nano Banana failed for {output.name}: {response}")
    return response


def icon_prompt(config: dict, concept: dict, correction: str = "") -> str:
    parts = [
        config["globalIconPrompt"],
        config["referenceRule"],
        concept["iconPrompt"],
    ]
    if correction:
        parts.extend([
            "## Required correction",
            f"The previous render was rejected because: {correction}",
            "Correct that failure while preserving the named direction, palette, and app-icon composition. Produce a materially cleaner replacement.",
        ])
    return "\n\n".join(parts)


def lockup_prompt(config: dict, concept: dict, correction: str = "") -> str:
    parts = [config["globalLockupPrompt"], concept["lockupPrompt"]]
    if correction:
        parts.extend([
            "## Required correction",
            f"The previous lockup was rejected because: {correction}",
            "Correct only that failure. Keep the attached mark and render the exact words perfectly.",
        ])
    return "\n\n".join(parts)


def metric_failure(metrics: dict) -> str:
    return ", ".join(name for name, passed in metrics["gate"]["checks"].items() if not passed)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--project-dir", required=True, type=Path)
    parser.add_argument("--phase", choices=("icons", "lockups", "all"), default="all")
    parser.add_argument("--only", action="append", default=[])
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--max-attempts", type=int, default=1)
    parser.add_argument("--correction", default="")
    parser.add_argument("--generator", type=Path, default=DEFAULT_GENERATOR)
    parser.add_argument("--python", type=Path, default=DEFAULT_PYTHON)
    parser.add_argument("--log", type=Path)
    args = parser.parse_args()

    if not os.environ.get("GEMINI_API_KEY"):
        raise SystemExit("GEMINI_API_KEY is not set")
    config = json.loads(args.config.read_text())
    style_reference = args.project_dir / config["styleReference"]
    analyzer = load_analyzer(args.project_dir / "scripts/analyze-icon-assets.py")
    selected = [item for item in config["concepts"] if not args.only or item["id"] in args.only]
    if not selected:
        raise SystemExit("No concepts selected")

    phases = ("icons", "lockups") if args.phase == "all" else (args.phase,)
    log = {
        "version": config["version"],
        "model": config["model"],
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "phases": [],
    }
    for phase in phases:
        phase_record = {"phase": phase, "assets": []}
        for concept in selected:
            is_icon = phase == "icons"
            output = args.project_dir / concept["iconOutput" if is_icon else "lockupOutput"]
            reference = (
                args.project_dir / concept.get("styleReference", config["styleReference"])
                if is_icon
                else args.project_dir / concept["iconOutput"]
            )
            if not reference.exists():
                raise RuntimeError(f"Missing reference for {concept['id']}: {reference}")
            output.parent.mkdir(parents=True, exist_ok=True)
            record = {"id": concept["id"], "name": concept["name"], "output": str(output), "attempts": []}
            if output.exists() and not args.force:
                check = technical_check(output)
                metrics = analyzer.analyze(output) if is_icon and check["passed"] else None
                record.update({"status": "kept", "technical": check, "metrics": metrics})
                phase_record["assets"].append(record)
                print(f"kept {phase} {concept['id']}", flush=True)
                continue

            correction = args.correction
            for attempt in range(1, args.max_attempts + 1):
                if output.exists():
                    output.unlink()
                prompt = icon_prompt(config, concept, correction) if is_icon else lockup_prompt(config, concept, correction)
                print(f"generating {phase} {concept['id']} attempt {attempt}", flush=True)
                api = run_generation(args.python, args.generator, config["model"], prompt, output, reference)
                check = technical_check(output)
                metrics = analyzer.analyze(output) if is_icon and check["passed"] else None
                record["attempts"].append({
                    "attempt": attempt,
                    "prompt": prompt,
                    "api": api,
                    "technical": check,
                    "metrics": metrics,
                })
                passed = check["passed"] and (not is_icon or (metrics and metrics["gate"]["passed"]))
                if passed:
                    record.update({"status": "generated", "technical": check, "metrics": metrics})
                    print(f"accepted by automated gates {phase} {concept['id']}", flush=True)
                    break
                correction = check.get("reason", "") if not check["passed"] else metric_failure(metrics)
            else:
                record.update({"status": "needs-human-review", "technical": check, "metrics": metrics})
            phase_record["assets"].append(record)
        log["phases"].append(phase_record)

    log["completedAt"] = datetime.now(timezone.utc).isoformat()
    log_path = args.log or (args.project_dir / "research/reports/generation-log-v4.json")
    log_path.parent.mkdir(parents=True, exist_ok=True)
    log_path.write_text(json.dumps(log, indent=2) + "\n")
    print(json.dumps({"status": "success", "log": str(log_path)}), flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
