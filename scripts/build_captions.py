#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def scene_for(time, timeline):
    label = timeline[0][1]
    for start, name in timeline:
        if time >= start - 0.001:
            label = name
        else:
            break
    return label


def main():
    parser = argparse.ArgumentParser(description="Group word timestamps into captions")
    parser.add_argument("--words", default=str(ROOT / "public" / "subs" / "words.json"))
    parser.add_argument("--captions", default=str(ROOT / "public" / "subs" / "captions.json"))
    parser.add_argument("--offsets", default=str(ROOT / "public" / "subs" / "scene_offsets.json"))
    parser.add_argument("--max-words", type=int, default=8)
    parser.add_argument("--max-span", type=float, default=4.5)
    parser.add_argument("--max-gap", type=float, default=0.6)
    args = parser.parse_args()

    words_path = Path(args.words)
    if not words_path.exists():
        print(f"Error: words file not found: {words_path}")
        return 1

    words = json.loads(words_path.read_text(encoding="utf-8"))
    offsets_path = Path(args.offsets)
    timeline = []
    if offsets_path.exists():
        offsets = json.loads(offsets_path.read_text(encoding="utf-8"))
        for key, start in sorted(offsets.items(), key=lambda item: float(item[1])):
            name = f"scene_{str(key).zfill(2)}"
            timeline.append((float(start), name))
    if not timeline:
        timeline = [(0.0, "scene_01")]

    captions = []
    current = []

    def flush():
        nonlocal current
        if not current:
            return
        scene = scene_for(current[0]["start"], timeline)
        for word in current:
            word["scene"] = scene
        captions.append(
            {
                "text": " ".join(word["word"] for word in current).strip(),
                "start": current[0]["start"],
                "end": max(word["end"] for word in current),
                "words": list(current),
            }
        )
        current = []

    for word in sorted(words, key=lambda item: item["start"]):
        if current:
            previous = current[-1]
            too_many = len(current) >= args.max_words
            too_long = float(word["end"]) - float(current[0]["start"]) > args.max_span
            too_far = float(word["start"]) - float(previous["end"]) > args.max_gap
            if too_many or too_long or too_far:
                flush()
        current.append(dict(word))
    flush()

    captions_path = Path(args.captions)
    captions_path.parent.mkdir(parents=True, exist_ok=True)
    words_path.write_text(json.dumps(words, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    captions_path.write_text(
        json.dumps(captions, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"OK: {len(words)} words -> {len(captions)} captions ({captions_path})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
