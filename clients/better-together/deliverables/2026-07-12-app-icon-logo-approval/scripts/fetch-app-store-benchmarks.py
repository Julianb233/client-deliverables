#!/usr/bin/env python3
"""Fetch current App Store artwork and metadata for local structural analysis."""

from __future__ import annotations

import argparse
import json
import re
import urllib.request
from pathlib import Path


USER_AGENT = "BetterTogetherIconResearch/3.0"


def request_json(url: str) -> dict:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def download(url: str, output: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        output.write_bytes(response.read())


def largest_artwork(result: dict) -> str:
    artwork = result.get("artworkUrl512") or result.get("artworkUrl100")
    if not artwork:
        raise ValueError("Lookup result has no app artwork URL")
    return re.sub(r"/\d+x\d+bb", "/1024x1024bb", artwork)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--metadata", required=True, type=Path)
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text())
    args.output_dir.mkdir(parents=True, exist_ok=True)
    metadata = []

    for app in manifest["apps"]:
        lookup_url = f"https://itunes.apple.com/lookup?id={app['id']}&country=us"
        payload = request_json(lookup_url)
        if payload.get("resultCount") != 1:
            raise RuntimeError(f"Expected one App Store result for {app['id']}")
        result = payload["results"][0]
        artwork_url = largest_artwork(result)
        output = args.output_dir / f"{app['slug']}.png"
        download(artwork_url, output)
        metadata.append({
            **app,
            "trackName": result.get("trackName"),
            "artistName": result.get("artistName"),
            "averageUserRating": result.get("averageUserRating"),
            "userRatingCount": result.get("userRatingCount"),
            "version": result.get("version"),
            "currentVersionReleaseDate": result.get("currentVersionReleaseDate"),
            "artworkUrl": artwork_url,
            "localFile": str(output),
        })
        print(f"fetched {app['slug']}: {output}")

    args.metadata.parent.mkdir(parents=True, exist_ok=True)
    args.metadata.write_text(json.dumps({"apps": metadata}, indent=2) + "\n")
    print(f"metadata: {args.metadata}")


if __name__ == "__main__":
    main()
