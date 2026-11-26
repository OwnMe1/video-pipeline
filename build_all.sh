#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

KOKORO_HOME="${KOKORO_HOME:-$HOME/kokoro-tts}"
KOKORO_PY="${KOKORO_PYTHON:-$KOKORO_HOME/venv/bin/python}"
KOKORO_GENERATOR="${KOKORO_GENERATOR:-$KOKORO_HOME/generate.py}"
TRANSCRIBE="${KOKORO_TRANSCRIBE:-$KOKORO_HOME/transcribe_local.py}"
VOICE="${KOKORO_VOICE:-bm_george}"
SPEED="${KOKORO_SPEED:-1.08}"

LONG_SCRIPT="${LONG_SCRIPT:-}"
if [ -z "$LONG_SCRIPT" ]; then
	if [ -f script.md ]; then
		LONG_SCRIPT="script.md"
	elif [ -f script_draft.md ]; then
		LONG_SCRIPT="script_draft.md"
	fi
fi
SHORTS_SCRIPT="${SHORTS_SCRIPT:-}"

if [ ! -x "$KOKORO_PY" ]; then
	echo "Error: Kokoro python not found: $KOKORO_PY" >&2
	exit 1
fi
if [ ! -f "$KOKORO_GENERATOR" ]; then
	echo "Error: Kokoro generator not found: $KOKORO_GENERATOR" >&2
	exit 1
fi

mkdir -p public/scenes public/audio/shorts public/subs public/subs/shorts out/shorts

PARSE_ARGS=()
if [ -n "$LONG_SCRIPT" ] && [ -f "$LONG_SCRIPT" ]; then
	PARSE_ARGS+=(--long "$LONG_SCRIPT")
fi
if [ -n "$SHORTS_SCRIPT" ] && [ -f "$SHORTS_SCRIPT" ]; then
	PARSE_ARGS+=(--shorts "$SHORTS_SCRIPT")
fi
if [ "${#PARSE_ARGS[@]}" -gt 0 ]; then
	"$KOKORO_PY" scripts/parse_script.py "${PARSE_ARGS[@]}"
fi

SKIP_FLAG=()
if [ "${SKIP_EXISTING:-0}" = "1" ]; then
	SKIP_FLAG+=(--skip-existing)
fi

if [ -f public/scenes/manifest.json ]; then
	"$KOKORO_PY" scripts/tts_manifest.py \
		--manifest public/scenes/manifest.json \
		--python "$KOKORO_PY" \
		--generator "$KOKORO_GENERATOR" \
		--voice "$VOICE" \
		--speed "$SPEED" \
		"${SKIP_FLAG[@]}"
	scripts/normalize_audio.sh public/scenes
fi

if [ -f public/audio/shorts/manifest.json ]; then
	"$KOKORO_PY" scripts/tts_manifest.py \
		--manifest public/audio/shorts/manifest.json \
		--python "$KOKORO_PY" \
		--generator "$KOKORO_GENERATOR" \
		--voice "$VOICE" \
		--speed "$SPEED" \
		"${SKIP_FLAG[@]}"
	scripts/normalize_audio.sh public/audio/shorts
	"$KOKORO_PY" scripts/concat_shorts.py
fi

if compgen -G "public/scenes/*.wav" >/dev/null; then
	scripts/concat_audio.sh
	if [ -f "$TRANSCRIBE" ]; then
		"$KOKORO_PY" "$TRANSCRIBE" public/full_audio.wav public/subs/words.json
		"$KOKORO_PY" scripts/build_captions.py
		for index in 1 2 3; do
			short_audio="public/audio/shorts/short_${index}.wav"
			if [ -f "$short_audio" ]; then
				"$KOKORO_PY" "$TRANSCRIBE" "$short_audio" "public/subs/shorts/short_${index}_words.json"
				"$KOKORO_PY" scripts/build_captions.py \
					--words "public/subs/shorts/short_${index}_words.json" \
					--captions "public/subs/shorts/short_${index}_captions.json" \
					--offsets "public/subs/shorts/short_${index}_offsets.json"
			fi
		done
	else
		echo "Warning: transcribe_local.py not found, subtitles skipped." >&2
	fi
else
	echo "Warning: no scene audio in public/scenes, concatenation skipped." >&2
fi

echo "Done. Audio/subtitle build finished. No video render performed."
