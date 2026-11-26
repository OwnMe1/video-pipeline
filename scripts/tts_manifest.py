#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

HOME = Path.home()


def first_existing(paths):
    for path in paths:
        if path.exists():
            return path
    return None


def default_generator():
    env = os.environ.get("KOKORO_GENERATOR")
    if env:
        return Path(env)
    return first_existing([HOME / "kokoro-tts" / "generate.py", HOME / "kokoro" / "generate.py"])


def default_python():
    env = os.environ.get("KOKORO_PYTHON")
    if env:
        return Path(env)
    return first_existing(
        [
            HOME / "kokoro-tts" / "venv" / "bin" / "python",
            HOME / "kokoro" / "venv" / "bin" / "python",
        ]
    )


def main():
    parser = argparse.ArgumentParser(description="Synthesize every VOICE scene through Kokoro")
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--python", default=None)
    parser.add_argument("--generator", default=None)
    parser.add_argument("--voice", default=None)
    parser.add_argument("--speed", type=float, default=None)
    parser.add_argument("--skip-existing", action="store_true")
    args = parser.parse_args()

    manifest_path = Path(args.manifest).resolve()
    if not manifest_path.exists():
        print(f"Error: manifest not found: {manifest_path}", file=sys.stderr)
        return 1

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    base_dir = manifest_path.parent
    generator = Path(args.generator) if args.generator else default_generator()
    python_bin = Path(args.python) if args.python else default_python()
    voice = args.voice or manifest.get("voice", "bm_george")
    speed = args.speed if args.speed is not None else float(manifest.get("speed", 1.08))

    if generator is None or not generator.exists():
        print("Error: Kokoro generate.py not found (set KOKORO_GENERATOR)", file=sys.stderr)
        return 1
    if python_bin is None or not python_bin.exists():
        print("Error: Kokoro python not found (set KOKORO_PYTHON)", file=sys.stderr)
        return 1

    failures = []
    for scene in manifest.get("scenes", []):
        voice_path = base_dir / scene["voice_file"]
        output_path = base_dir / scene["file"]
        if args.skip_existing and output_path.exists() and output_path.stat().st_size > 0:
            print(f"SKIP {scene['id']}: {output_path}")
            continue
        if not voice_path.exists():
            failures.append((scene["id"], f"missing voice file {voice_path}"))
            continue
        text = voice_path.read_text(encoding="utf-8").strip()
        if not text:
            failures.append((scene["id"], "empty VOICE text"))
            continue
        if "[" in text or "]" in text:
            failures.append((scene["id"], "tags leaked into VOICE text"))
            continue
        output_path.parent.mkdir(parents=True, exist_ok=True)
        cmd = [str(python_bin), str(generator), text, str(output_path), voice, str(speed)]
        print(f"TTS {scene['id']} -> {output_path}")
        result = subprocess.run(cmd)
        if result.returncode != 0:
            failures.append((scene["id"], f"generator exit {result.returncode}"))

    if failures:
        for scene_id, reason in failures:
            print(f"FAIL {scene_id}: {reason}", file=sys.stderr)
        return 1
    print(f"OK: synthesized {len(manifest.get('scenes', []))} scenes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
