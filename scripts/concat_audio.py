#!/usr/bin/env python3
import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def ffprobe_duration(path):
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(result.stdout.strip())


def safe_name(value):
    name = Path(value).name
    if name != value or name in ("", ".", ".."):
        raise ValueError(f"unsafe scene file name: {value}")
    return name


def load_scenes(scenes_dir, manifest_path):
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        scenes = []
        for index, scene in enumerate(manifest.get("scenes", []), start=1):
            filename = safe_name(scene["file"])
            scenes.append(
                {
                    "id": scene.get("id", Path(filename).stem),
                    "number": int(scene.get("number", index)),
                    "file": scenes_dir / filename,
                    "phase": (scene.get("phase") or "").upper(),
                    "silence_before": float(scene.get("silence_before") or 0.0),
                }
            )
        return scenes, True

    files = sorted(scenes_dir.glob("*.wav"))
    scenes = []
    for index, file in enumerate(files, start=1):
        match = re.search(r"(\d+)$", file.stem)
        scenes.append(
            {
                "id": file.stem,
                "number": int(match.group(1)) if match else index,
                "file": file,
                "phase": "",
                "silence_before": 0.0,
            }
        )
    return scenes, False


def make_silence(duration, out_path, sample_rate):
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-f",
            "lavfi",
            "-i",
            f"anullsrc=r={sample_rate}:cl=mono",
            "-t",
            f"{duration:.6f}",
            "-c:a",
            "pcm_s16le",
            str(out_path),
        ],
        check=True,
    )


def main():
    parser = argparse.ArgumentParser(description="Concatenate scenes with silence gaps and offsets")
    parser.add_argument("--scenes-dir", default=str(ROOT / "public" / "scenes"))
    parser.add_argument("--output", default=str(ROOT / "public" / "full_audio.wav"))
    parser.add_argument("--offsets", default=str(ROOT / "public" / "subs" / "scene_offsets.json"))
    parser.add_argument("--manifest", default=None)
    parser.add_argument("--drop-joint", type=float, default=0.13)
    parser.add_argument("--sample-rate", type=int, default=24000)
    args = parser.parse_args()

    if shutil.which("ffmpeg") is None or shutil.which("ffprobe") is None:
        print("Error: ffmpeg and ffprobe are required.", file=sys.stderr)
        return 1

    scenes_dir = Path(args.scenes_dir)
    output = Path(args.output)
    offsets_path = Path(args.offsets)
    manifest_path = Path(args.manifest) if args.manifest else scenes_dir / "manifest.json"
    scenes_dir.mkdir(parents=True, exist_ok=True)
    offsets_path.parent.mkdir(parents=True, exist_ok=True)
    output.parent.mkdir(parents=True, exist_ok=True)

    scenes, has_manifest = load_scenes(scenes_dir, manifest_path)
    if not scenes:
        print(f"Error: no .wav files found in {scenes_dir}", file=sys.stderr)
        return 1

    missing = [scene["id"] for scene in scenes if not scene["file"].exists()]
    if missing:
        print(f"Error: missing scene audio: {', '.join(missing)}", file=sys.stderr)
        return 1

    drop_joint = min(max(args.drop_joint, 0.12), 0.15)
    offsets = {}
    cursor = 0.0
    silence_cache = {}
    entries = []
    report = []

    with tempfile.TemporaryDirectory(prefix="concat_audio_") as tmp:
        tmp_dir = Path(tmp)
        for index, scene in enumerate(scenes, start=1):
            gap = scene["silence_before"]
            if index > 1 and scene["phase"] == "DROP" and gap <= 0.0005:
                gap = drop_joint
            gap = max(0.0, gap)
            entries.append((gap, scene["file"]))
            cursor += gap
            offsets[str(scene["number"])] = round(cursor, 3)
            duration = ffprobe_duration(scene["file"])
            cursor += duration
            report.append(
                {
                    "id": scene["id"],
                    "phase": scene["phase"] or "-",
                    "gap": round(gap, 3),
                    "start": round(offsets[str(scene["number"])], 3),
                    "duration": round(duration, 3),
                }
            )

        list_file = tmp_dir / "concat.txt"
        with list_file.open("w", encoding="utf-8") as handle:
            for gap, file in entries:
                if gap > 0.0005:
                    key = round(gap, 3)
                    silence = silence_cache.get(key)
                    if silence is None:
                        silence = tmp_dir / f"silence_{key:.3f}.wav"
                        make_silence(key, silence, args.sample_rate)
                        silence_cache[key] = silence
                    handle.write(f"file '{silence.resolve()}'\n")
                handle.write(f"file '{file.resolve()}'\n")

        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(list_file),
                "-ar",
                str(args.sample_rate),
                "-ac",
                "1",
                "-c:a",
                "pcm_s16le",
                str(output),
            ],
            check=True,
        )

    tmp_offsets = offsets_path.with_suffix(offsets_path.suffix + ".tmp")
    tmp_offsets.write_text(json.dumps(offsets, indent=2) + "\n", encoding="utf-8")
    tmp_offsets.replace(offsets_path)

    print(f"OK: {len(scenes)} scenes -> {output}")
    print(f"OK: offsets -> {offsets_path} ({'manifest' if has_manifest else 'alphabetical fallback'})")
    for row in report:
        print(
            f"  {row['id']:>10} phase={row['phase']:<5} gap={row['gap']:.3f}s "
            f"start={row['start']:.3f}s duration={row['duration']:.3f}s"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
