#!/usr/bin/env bash
set -euo pipefail

usage() {
	echo "Usage: $0 <input.wav | directory> [output.wav]"
	echo "Normalizes audio to YouTube standard: I=-14 LUFS, True Peak=-1.0 dBTP, LRA=11."
	echo "Directories are processed recursively in place (public/scenes, public/audio/shorts)."
	echo "Example: $0 public/scenes"
}

if [ "$#" -lt 1 ]; then
	usage
	exit 1
fi

INPUT="$1"

if ! command -v ffmpeg >/dev/null 2>&1; then
	echo "Error: ffmpeg is required." >&2
	exit 1
fi

normalize_one() {
	local src="$1"
	local dst="$2"
	local out_dir
	out_dir="$(dirname "$dst")"
	mkdir -p "$out_dir"
	local tmp
	tmp="$(mktemp "$out_dir/.normalize_XXXXXX.wav")"
	echo "Normalizing: $src"
	ffmpeg -y -hide_banner -loglevel error \
		-i "$src" \
		-af loudnorm=I=-14:TP=-1.0:LRA=11 \
		-ar 24000 \
		"$tmp"
	mv -f "$tmp" "$dst"
}

if [ -d "$INPUT" ]; then
	if [ "$#" -ge 2 ]; then
		echo "Error: output path is not supported for directories." >&2
		exit 1
	fi
	mapfile -t FILES < <(find "$INPUT" -type f -name '*.wav' | LC_ALL=C sort)
	if [ "${#FILES[@]}" -eq 0 ]; then
		echo "No .wav files found in $INPUT (skipped)."
		exit 0
	fi
	for file in "${FILES[@]}"; do
		normalize_one "$file" "$file"
	done
	echo "Done: normalized ${#FILES[@]} file(s) in $INPUT"
	exit 0
fi

if [ ! -f "$INPUT" ]; then
	echo "Error: input file not found: $INPUT" >&2
	exit 1
fi

OUTPUT="${2:-$INPUT}"
normalize_one "$INPUT" "$OUTPUT"
echo "Done: $OUTPUT"
