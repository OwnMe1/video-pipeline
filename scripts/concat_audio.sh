#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCENES_DIR="$PROJECT_ROOT/public/scenes"
OUTPUT="$PROJECT_ROOT/public/full_audio.wav"

mkdir -p "$SCENES_DIR"

FILES=()
while IFS= read -r file; do
	FILES+=("$file")
done < <(find "$SCENES_DIR" -maxdepth 1 -type f -name '*.wav' | LC_ALL=C sort)

if [ "${#FILES[@]}" -eq 0 ]; then
	echo "Error: no .wav files found in $SCENES_DIR" >&2
	echo "Generate scene audio first and put it into public/scenes/." >&2
	exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
	echo "Error: ffmpeg is required." >&2
	exit 1
fi

LIST_FILE="$(mktemp)"
trap 'rm -f "$LIST_FILE"' EXIT

for file in "${FILES[@]}"; do
	printf "file '%s'\n" "$file" >>"$LIST_FILE"
done

echo "Concatenating ${#FILES[@]} file(s) in alphabetical order:"
for file in "${FILES[@]}"; do
	echo "  - $(basename "$file")"
done

ffmpeg -y -hide_banner -loglevel error \
	-f concat \
	-safe 0 \
	-i "$LIST_FILE" \
	-ar 24000 \
	-ac 1 \
	-c:a pcm_s16le \
	"$OUTPUT"

echo "Done: $OUTPUT"
