#!/usr/bin/env bash
set -euo pipefail

usage() {
	echo "Usage: $0 <input.wav> [output.wav]"
	echo "Normalizes audio loudness to the YouTube standard (I=-14, TP=-1.5, LRA=11)."
	echo "If output is omitted, the input file is normalized in place."
	echo "Example: $0 public/voice_0.wav"
}

if [ "$#" -lt 1 ]; then
	usage
	exit 1
fi

INPUT="$1"
OUTPUT="${2:-$1}"

if ! command -v ffmpeg >/dev/null 2>&1; then
	echo "Error: ffmpeg is required." >&2
	exit 1
fi

if [ ! -f "$INPUT" ]; then
	echo "Error: input file not found: $INPUT" >&2
	exit 1
fi

OUT_DIR="$(dirname "$OUTPUT")"
mkdir -p "$OUT_DIR"
TMP="$(mktemp "$OUT_DIR/.normalize_XXXXXX.wav")"
trap 'rm -f "$TMP"' EXIT

echo "Normalizing: $INPUT"
ffmpeg -y -hide_banner -loglevel error \
	-i "$INPUT" \
	-af loudnorm=I=-14:TP=-1.5:LRA=11 \
	-ar 24000 \
	"$TMP"

mv -f "$TMP" "$OUTPUT"
trap - EXIT

echo "Done: $OUTPUT"
