#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHORTS_DIR = ROOT / "public" / "audio" / "shorts"
SUBS_DIR = ROOT / "public" / "subs" / "shorts"
DROP_JOINT = 0.13
SAMPLE_RATE = 24000


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


def make_silence(duration, out_path):
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
            f"anullsrc=r={SAMPLE_RATE}:cl=mono",
            "-t",
            f"{duration:.6f}",
            "-c:a",
            "pcm_s16le",
            str(out_path),
        ],
        check=True,
    )


def main():
    manifest_path = SHORTS_DIR / "manifest.json"
    if not manifest_path.exists():
        print(f"Error: {manifest_path} not found", file=sys.stderr)
        return 1
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    groups = {}
    for scene in manifest.get("scenes", []):
        groups.setdefault(int(scene.get("short", 1)), []).append(scene)

    SUBS_DIR.mkdir(parents=True, exist_ok=True)
    for group, scenes in sorted(groups.items()):
        output = SHORTS_DIR / f"short_{group}.wav"
        offsets_path = SUBS_DIR / f"short_{group}_offsets.json"
        offsets = {}
        cursor = 0.0
        entries = []
        with tempfile.TemporaryDirectory(prefix=f"short_{group}_") as tmp:
            tmp_dir = Path(tmp)
            silence_cache = {}
            for index, scene in enumerate(scenes, start=1):
                file = SHORTS_DIR / Path(scene["file"]).name
                if not file.exists():
                    print(f"Error: missing {file}", file=sys.stderr)
                    return 1
                gap = float(scene.get("silence_before") or 0.0)
                if index > 1 and (scene.get("phase") or "").upper() == "DROP" and gap <= 0.0005:
                    gap = DROP_JOINT
                if gap > 0.0005:
                    key = round(gap, 3)
                    silence = silence_cache.get(key)
                    if silence is None:
                        silence = tmp_dir / f"silence_{key:.3f}.wav"
                        make_silence(key, silence)
                        silence_cache[key] = silence
                    entries.append(silence)
                    cursor += gap
                entries.append(file)
                offsets[str(scene.get("number", index))] = round(cursor, 3)
                cursor += ffprobe_duration(file)
            list_file = tmp_dir / "concat.txt"
            with list_file.open("w", encoding="utf-8") as handle:
                for entry in entries:
                    handle.write(f"file '{entry.resolve()}'\n")
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
                    str(SAMPLE_RATE),
                    "-ac",
                    "1",
                    "-c:a",
                    "pcm_s16le",
                    str(output),
                ],
                check=True,
            )
        offsets_path.write_text(json.dumps(offsets, indent=2) + "\n", encoding="utf-8")
        print(f"OK: short_{group} -> {output} ({cursor:.3f}s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
