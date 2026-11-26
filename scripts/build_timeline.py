#!/usr/bin/env python3
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
DATA = ROOT / "src" / "data"

TITLE = "WHY THE FASTEST BULLET TRAINS HIT AN INVISIBLE WALL OF AIR"
SUBTITLE = "THE PHYSICS OF TUNNEL BOOM"
BADGE_SECONDS = 3.2

SHORT_META = {
    1: {
        "id": "Short1Hook",
        "title": "THE TUNNEL CANNON",
        "shortLabel": "SHORT 01 // THE PARADOX",
        "titleLines": [
            {"text": "THE TUNNEL", "color": "white"},
            {"text": "CANNON", "color": "orange"},
        ],
    },
    2: {
        "id": "Short2Tech",
        "title": "THE PRESSURE SPIKE",
        "shortLabel": "SHORT 02 // THE MECHANISM",
        "titleLines": [
            {"text": "THE PRESSURE", "color": "white"},
            {"text": "SPIKE", "color": "cyan"},
        ],
    },
    3: {
        "id": "Short3Monopoly",
        "title": "THE KINGFISHER FIX",
        "shortLabel": "SHORT 03 // THE HACK",
        "titleLines": [
            {"text": "THE KINGFISHER", "color": "white"},
            {"text": "FIX", "color": "orange"},
        ],
    },
}

BADGE_KEYWORDS = {
    "AIR WALL": ["wall", "air"],
    "PISTON EFFECT": ["piston", "plunger"],
    "NO ESCAPE": ["escape"],
    "EIGHTY THREE METERS": ["meters", "83"],
    "PRESSURE WAVE": ["pressure", "wave"],
    "FIVE KILOPASCALS": ["kilopascals", "5"],
    "TUNNEL NEXT": ["tunnel", "portal"],
    "PORTAL CANNON": ["portal", "cannon"],
    "FOUR HUNDRED METERS": ["meters", "400"],
    "SPEED OF SOUND": ["sound", "speed"],
    "PRESSURE GAIN": ["pressure", "energy"],
    "TUNNEL BOOM": ["boom", "tunnel"],
    "NOSE PROBLEM": ["nose", "boom"],
    "SHARP NOSE": ["nose"],
    "BAD TRADEOFF": ["compromise", "nose", "weight", "crosswind"],
    "CAR SHAKE": ["shake", "vibrate", "vibrations", "shudder", "rocks"],
    "TEST TRAINS": ["test", "trains"],
    "AERO DEAD END": ["wind", "tunnel", "piston"],
    "KINGFISHER BEAK": ["kingfisher", "beak"],
    "FIFTEEN METERS": ["meters", "15"],
    "FIVE HUNDRED SERIES": ["series", "500"],
    "TUNNEL HOODS": ["hoods", "vents", "portals"],
    "THIRTY PERCENT": ["30", "percent"],
    "NEXT PRESSURE": ["underwater", "pressure", "wall"],
    "TUNNEL CANNON": ["cannon", "tunnel"],
}


def load_json(path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


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


def norm(token):
    return re.sub(r"[^a-z0-9]+", "", token.lower())


def find_badge_index(words, badge):
    keywords = BADGE_KEYWORDS.get(badge.upper())
    if not keywords:
        keywords = [token for token in re.split(r"\s+", badge.lower()) if token]
    for keyword in keywords:
        key = norm(keyword)
        if not key:
            continue
        for index, word in enumerate(words):
            value = norm(word["word"])
            if key.isdigit():
                if value == key:
                    return index
            elif key in value:
                return index
    for index, word in enumerate(words):
        value = norm(word["word"])
        if value and value in norm(badge):
            return index
    return None


def badge_cue(scene_start, scene_end, words, badge):
    index = find_badge_index(words, badge)
    if index is not None and words:
        word = words[index]
        start = max(scene_start, float(word["start"]) - 0.12)
        duration = min(BADGE_SECONDS, scene_end - start)
        if duration < 1.0:
            start = max(scene_start, scene_end - BADGE_SECONDS)
            duration = scene_end - start
        return {
            "text": badge,
            "word": word["word"],
            "word_index": index,
            "start": round(start, 3),
            "duration": round(max(0.0, duration), 3),
            "relative_start": round(max(0.0, start - scene_start), 3),
        }
    start = min(scene_end, scene_start + 0.8)
    duration = min(BADGE_SECONDS, scene_end - start)
    return {
        "text": badge,
        "word": None,
        "word_index": None,
        "start": round(start, 3),
        "duration": round(max(0.0, duration), 3),
        "relative_start": round(max(0.0, start - scene_start), 3),
    }


def component_cues(scene_start, words, badge):
    cues = []
    if not words:
        return [{"at": round(scene_start, 3), "relative": 0.0, "beat": 0, "word": None, "word_index": None}]
    badge_index = badge.get("word_index")
    indices = [0, badge_index if badge_index is not None else len(words) // 2, int(len(words) * 0.66)]
    seen = set()
    for beat, index in enumerate(indices):
        index = max(0, min(len(words) - 1, index))
        if index in seen:
            continue
        seen.add(index)
        word = words[index]
        at = float(word["start"])
        cues.append(
            {
                "at": round(at, 3),
                "relative": round(max(0.0, at - scene_start), 3),
                "beat": beat,
                "word": word["word"],
                "word_index": index,
            }
        )
    if not cues:
        cues.append({"at": round(scene_start, 3), "relative": 0.0, "beat": 0, "word": None, "word_index": None})
    return cues


def words_in_range(words, start, end):
    return [word for word in words if start - 0.05 <= float(word["start"]) < end - 0.001]


def captions_in_range(captions, start, end):
    return [caption for caption in captions if float(caption["end"]) > start and float(caption["start"]) < end]


def build_long(timeline_words, timeline_captions, manifest, offsets):
    scenes = []
    for scene in manifest["scenes"]:
        number = int(scene["number"])
        start = float(offsets[str(number)])
        audio_path = PUBLIC / "scenes" / scene["file"]
        duration = ffprobe_duration(audio_path)
        end = start + duration
        words = words_in_range(timeline_words, start, end)
        captions = captions_in_range(timeline_captions, start, end)
        badge = badge_cue(start, end, words, scene["badge"])
        narration = (PUBLIC / "scenes" / scene["voice_file"]).read_text(encoding="utf-8").strip()
        scenes.append(
            {
                "id": scene["id"],
                "number": number,
                "phase": scene["phase"],
                "component": scene["component"],
                "start": round(start, 3),
                "duration": round(duration, 3),
                "end": round(end, 3),
                "audio_file": f"scenes/{scene['file']}",
                "narration": narration,
                "silence_before": scene.get("silence_before", 0.0),
                "jcut": scene.get("jcut"),
                "badge": badge,
                "component_cues": component_cues(start, words, badge),
                "words": words,
                "captions": captions,
            }
        )
    return scenes


def build_shorts(manifest):
    shorts = []
    for group, meta in SHORT_META.items():
        scenes = [scene for scene in manifest["scenes"] if int(scene.get("short", 0)) == group]
        if not scenes:
            continue
        audio_path = PUBLIC / "audio" / "shorts" / f"short_{group}.wav"
        duration = ffprobe_duration(audio_path)
        words = load_json(PUBLIC / "subs" / "shorts" / f"short_{group}_words.json", [])
        captions = load_json(PUBLIC / "subs" / "shorts" / f"short_{group}_captions.json", [])
        phase = scenes[0].get("phase", "HOOK")
        component = scenes[0].get("component", "HudOverlay")
        badge_text = scenes[0].get("badge", meta["title"])
        badge = badge_cue(0.0, duration, words, badge_text)
        shorts.append(
            {
                "id": f"short_{group}",
                "short": group,
                "title": meta["title"],
                "audio": f"audio/shorts/short_{group}.wav",
                "duration": round(duration, 3),
                "phase": phase,
                "component": component,
                "badge": badge,
                "component_cues": component_cues(0.0, words, badge),
                "cta_start": round(max(0.0, duration - 4.0), 3),
                "cta_text": "FULL BREAKDOWN BELOW",
                "words": words,
                "captions": captions,
            }
        )
    return shorts


def build_video_data(title, subtitle, channel, episode, fps, total_duration, scenes):
    payload = []
    for scene in scenes:
        badge = scene["badge"]
        payload.append(
            {
                "id": scene["id"].replace("_", "-"),
                "number": scene["number"],
                "start": scene["start"],
                "duration": scene["duration"],
                "audio_file": scene["audio_file"],
                "narration": scene["narration"],
                "visual": {
                    "kind": "component",
                    "component": scene["component"],
                    "variant": None,
                    "beats": [
                        {"kind": "cad", "files": [], "layout": "full", "label": f"{scene['id']} beat {index + 1}"}
                        for index in range(3)
                    ],
                },
                "badge": {
                    "text": badge["text"],
                    "start": badge["relative_start"],
                    "duration": max(1.0, badge["duration"]),
                    "accent": "orange" if scene["phase"] == "DROP" else "cyan",
                },
                "jcut": {"file": scene["jcut"], "offset_frames": 30} if scene.get("jcut") else None,
                "sfx": None,
                "beat_sfx": [],
            }
        )
    return {
        "title": title,
        "subtitle": subtitle,
        "channel": channel,
        "episode": episode,
        "fps": fps,
        "total_duration": total_duration,
        "scenes": payload,
    }


def build_shorts_data(shorts):
    payload = []
    for short in shorts:
        meta = SHORT_META[short["short"]]
        words = [
            {
                "word": word["word"],
                "start": word["start"],
                "end": word["end"],
                "segment": f"s{short['short']}_01",
            }
            for word in short["words"]
        ]
        captions = []
        for caption in short["captions"]:
            captions.append(
                {
                    "text": caption["text"],
                    "start": caption["start"],
                    "end": caption["end"],
                    "words": [
                        {
                            "word": word["word"],
                            "start": word["start"],
                            "end": word["end"],
                            "segment": f"s{short['short']}_01",
                        }
                        for word in caption["words"]
                    ],
                }
            )
        payload.append(
            {
                "id": meta["id"],
                "title": meta["title"],
                "shortLabel": meta["shortLabel"],
                "titleLines": meta["titleLines"],
                "audio": short["audio"],
                "duration": short["duration"],
                "ctaStart": short["cta_start"],
                "ctaText": short["cta_text"],
                "words": words,
                "captions": captions,
                "visuals": [
                    {
                        "type": "component",
                        "start": 0,
                        "end": short["duration"],
                        "component": short["component"],
                        "variant": None,
                        "beat": 0,
                        "label": f"HIGH-VOLTAGE LAB // {short['component']}",
                    }
                ],
            }
        )
    return {"shorts": payload}


def main():
    manifest = load_json(PUBLIC / "scenes" / "manifest.json", {"scenes": []})
    offsets = load_json(PUBLIC / "subs" / "scene_offsets.json", {})
    words = load_json(PUBLIC / "subs" / "words.json", [])
    captions = load_json(PUBLIC / "subs" / "captions.json", [])
    shorts_manifest = load_json(PUBLIC / "audio" / "shorts" / "manifest.json", {"scenes": []})

    scenes = build_long(words, captions, manifest, offsets)
    shorts = build_shorts(shorts_manifest)
    total_duration = ffprobe_duration(PUBLIC / "full_audio.wav")
    timeline = {
        "channel": "kinetic-lab",
        "episode": "EP.01",
        "title": TITLE,
        "subtitle": SUBTITLE,
        "voice": "bm_george",
        "speed": 1.08,
        "fps": 60,
        "total_duration": round(total_duration, 3),
        "scenes": scenes,
        "shorts": shorts,
    }
    write_json(DATA / "timeline.json", timeline)
    write_json(
        DATA / "video_data.json",
        build_video_data(TITLE, SUBTITLE, "kinetic-lab", "EP.01", 60, round(total_duration, 3), scenes),
    )
    write_json(DATA / "shorts_data.json", build_shorts_data(shorts))
    print(f"OK timeline: {len(scenes)} scenes, {len(shorts)} shorts, {round(total_duration, 3)}s")
    print(f"OK video_data.json / shorts_data.json written to {DATA}")


if __name__ == "__main__":
    main()
