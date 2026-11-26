#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TAG_RE = re.compile(r"\[[^\]]*\]")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
SCENE_HEAD_RE = re.compile(r"Scene\s+(\d+)", re.IGNORECASE)
SHORT_HEAD_RE = re.compile(r"(?:Short\s+|short_)(\d+)", re.IGNORECASE)
PHASE_RE = re.compile(r"\[(?:PHASE:\s*)?(HOOK|CLIMB|ACCEL|DROP)\]", re.IGNORECASE)
SILENCE_RE = re.compile(r"\[SILENCE\s+([0-9]*\.?[0-9]+)\s*s?\]", re.IGNORECASE)
JCUT_RE = re.compile(r"\[J-CUT\s+SFX:\s*([^\]]+)\]", re.IGNORECASE)
BADGE_RE = re.compile(r"\[BADGE:\s*([^\]]+)\]", re.IGNORECASE)
COMPONENT_RE = re.compile(r"<([A-Za-z][A-Za-z0-9_]*)")
TIMING_RE = re.compile(r"(\d{1,2}):(\d{2})\s*[–\-]\s*(\d{1,2}):(\d{2})")

SFX_MAP = (
    ("sub-drop", "audio/sfx/sfx_warning_pulse.mp3"),
    ("whoosh", "audio/sfx/sfx_data_whoosh.mp3"),
    ("warning", "audio/sfx/sfx_warning_pulse.mp3"),
    ("tick", "audio/sfx/sfx_digital_tick.mp3"),
    ("transition", "audio/sfx/sfx_crisp_transition.mp3"),
    ("glitch", "audio/sfx/sfx_data_glitch.mp3"),
)

ACT_PHASES = {"I": "CLIMB", "II": "ACCEL", "III": "DROP", "IV": "DROP"}


def pick_sfx(label):
    if not label:
        return None
    low = label.lower()
    for key, path in SFX_MAP:
        if key in low:
            return path
    return None


def clean_voice(raw):
    text = TAG_RE.sub(" ", raw)
    text = re.sub(r"\[[^\]]*$", " ", text)
    text = text.replace("**", " ").replace("__", " ")
    text = re.sub(r"^\s*VOICE:\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def section_phase_from_heading(heading):
    upper = heading.upper()
    if "COLD OPEN" in upper or "HOOK" in upper:
        return "HOOK"
    match = re.search(r"ACT\s+(IV|III|II|I)\b", upper)
    if match:
        return ACT_PHASES[match.group(1)]
    if "CLIMB" in upper:
        return "CLIMB"
    if "ACCEL" in upper:
        return "ACCEL"
    if "DROP" in upper:
        return "DROP"
    return None


def parse_blocks(path):
    lines = path.read_text(encoding="utf-8").replace("\r\n", "\n").split("\n")
    blocks = []
    current = None
    section_phase = None
    short_group = None
    scene_number = None

    def finalize():
        nonlocal current
        if current is None:
            return
        body = "\n".join(current["lines"])
        match = re.search(r"^\s*VOICE:\s*(.*)$", body, re.IGNORECASE | re.MULTILINE)
        if not match:
            current = None
            return
        voice_raw = match.group(1) + "\n" + body[match.end() :]
        current["voice"] = clean_voice(voice_raw)
        current["meta"] = current["meta"].strip()
        if current["voice"]:
            blocks.append(current)
        current = None

    for line in lines:
        heading = HEADING_RE.match(line.strip())
        if heading:
            finalize()
            title = heading.group(2).strip()
            phase = section_phase_from_heading(title)
            if phase:
                section_phase = phase
            short_match = SHORT_HEAD_RE.search(title)
            if short_match and heading.group(1).startswith("##"):
                short_group = int(short_match.group(1))
            scene_match = SCENE_HEAD_RE.search(title)
            if scene_match:
                scene_number = int(scene_match.group(1))
            continue

        if line.strip().upper().startswith("META:"):
            finalize()
            current = {
                "meta": line.strip()[5:].strip(),
                "lines": [],
                "section_phase": section_phase,
                "short_group": short_group,
                "scene_number": scene_number,
            }
            continue

        if current is not None:
            current["lines"].append(line)

    finalize()
    return blocks


def parse_meta(meta, fallback_phase, fallback_number, fallback_short):
    phase_match = PHASE_RE.search(meta)
    phase = phase_match.group(1).upper() if phase_match else fallback_phase or "CLIMB"

    silence_match = SILENCE_RE.search(meta)
    silence = float(silence_match.group(1)) if silence_match else 0.0

    jcut_match = JCUT_RE.search(meta)
    jcut_label = jcut_match.group(1).strip() if jcut_match else None

    badge_match = BADGE_RE.search(meta)
    badge = badge_match.group(1).strip() if badge_match else None

    component_match = COMPONENT_RE.search(meta)
    component = component_match.group(1) if component_match else None

    timing = None
    timing_match = TIMING_RE.search(meta)
    if timing_match:
        start = int(timing_match.group(1)) * 60 + int(timing_match.group(2))
        end = int(timing_match.group(3)) * 60 + int(timing_match.group(4))
        timing = {"start": start, "end": end}

    return {
        "phase": phase,
        "silence_before": silence,
        "jcut": pick_sfx(jcut_label),
        "jcut_label": jcut_label,
        "badge": badge,
        "component": component,
        "timing": timing,
        "number": fallback_number,
        "short": fallback_short,
    }


def build_long(blocks, source):
    scenes = []
    for index, block in enumerate(blocks, start=1):
        number = block["scene_number"] or index
        meta = parse_meta(block["meta"], block["section_phase"], number, None)
        scene_id = f"scene_{number:02d}"
        scenes.append(
            {
                "id": scene_id,
                "number": number,
                "file": f"{scene_id}.wav",
                "voice_file": f"voice/{scene_id}.txt",
                "duration": None,
                **{k: v for k, v in meta.items() if k not in ("number", "short")},
            }
        )
    return {
        "kind": "long",
        "source": str(source.relative_to(ROOT)) if source.is_relative_to(ROOT) else str(source),
        "voice": "bm_george",
        "speed": 1.08,
        "fps": 60,
        "drop_joint_sec": 0.13,
        "scenes": scenes,
    }


def build_shorts(blocks, source):
    scenes = []
    counters = {}
    for block in blocks:
        group = block["short_group"]
        if group is None:
            group = 1
        counters[group] = counters.get(group, 0) + 1
        number = block["scene_number"] or counters[group]
        fallback_phase = {1: "HOOK", 2: "CLIMB", 3: "ACCEL"}.get(group, "CLIMB")
        meta = parse_meta(block["meta"], block["section_phase"] or fallback_phase, number, group)
        scene_id = f"s{group}_{number:02d}"
        scenes.append(
            {
                "id": scene_id,
                "number": number,
                "short": group,
                "file": f"{scene_id}.wav",
                "voice_file": f"voice/{scene_id}.txt",
                "duration": None,
                **{k: v for k, v in meta.items() if k not in ("number", "short")},
            }
        )
    return {
        "kind": "shorts",
        "source": str(source.relative_to(ROOT)) if source.is_relative_to(ROOT) else str(source),
        "voice": "bm_george",
        "speed": 1.08,
        "fps": 60,
        "scenes": scenes,
    }


def write_manifest(manifest, base_dir):
    base_dir.mkdir(parents=True, exist_ok=True)
    (base_dir / "voice").mkdir(parents=True, exist_ok=True)
    for scene in manifest["scenes"]:
        voice_path = base_dir / scene["voice_file"]
        voice_path.parent.mkdir(parents=True, exist_ok=True)
        voice_path.write_text(scene.pop("_voice") + "\n", encoding="utf-8")
    (base_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def resolve_long(root_arg):
    if root_arg:
        return Path(root_arg)
    for name in ("script.md", "script_draft.md"):
        candidate = ROOT / name
        if candidate.exists():
            return candidate
    return ROOT / "script.md"


def main():
    parser = argparse.ArgumentParser(description="Parse script.md into TTS-ready manifests")
    parser.add_argument("--long", default=None, help="Path to long-form script (script.md/script_draft.md)")
    parser.add_argument("--shorts", default=None, help="Path to shorts script")
    parser.add_argument("--root", default=None, help="Project root override")
    args = parser.parse_args()

    embedded_short_blocks = []
    long_path = resolve_long(args.root)
    if long_path.exists():
        blocks = parse_blocks(long_path)
        long_blocks = [block for block in blocks if block["short_group"] is None]
        embedded_short_blocks = [block for block in blocks if block["short_group"] is not None]
        if long_blocks:
            manifest = build_long(long_blocks, long_path)
            for block, scene in zip(long_blocks, manifest["scenes"]):
                scene["_voice"] = block["voice"]
            write_manifest(manifest, ROOT / "public" / "scenes")
            print(f"OK long: {len(manifest['scenes'])} scenes -> public/scenes/manifest.json")
        else:
            print(f"SKIP long: no long-form scenes in {long_path}")
    else:
        print(f"SKIP long: {long_path} not found")

    short_blocks = []
    shorts_path = Path(args.shorts) if args.shorts else ROOT / "shorts_drafts.md"
    if args.shorts and shorts_path.exists():
        short_blocks = parse_blocks(shorts_path)
    elif embedded_short_blocks:
        short_blocks = embedded_short_blocks
        shorts_path = long_path

    if short_blocks:
        manifest = build_shorts(short_blocks, shorts_path)
        for block, scene in zip(short_blocks, manifest["scenes"]):
            scene["_voice"] = block["voice"]
        write_manifest(manifest, ROOT / "public" / "audio" / "shorts")
        print(f"OK shorts: {len(manifest['scenes'])} scenes -> public/audio/shorts/manifest.json")
    else:
        print(f"SKIP shorts: no Short blocks found in {long_path}")


if __name__ == "__main__":
    main()
