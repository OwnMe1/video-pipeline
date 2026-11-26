#!/usr/bin/env bash
set -euo pipefail

usage() {
	echo "Usage: $0 <URL> [filename]"
	echo "Downloads a video from URL into public/."
	echo "Example: $0 https://example.com/clip.mp4 broll_power_plant.mp4"
}

if [ "$#" -lt 1 ]; then
	usage
	exit 1
fi

URL="$1"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$PROJECT_ROOT/public"
mkdir -p "$OUT_DIR"

if [ "$#" -ge 2 ] && [ -n "$2" ]; then
	NAME="$2"
else
	NAME="$(basename "${URL%%\?*}")"
	NAME="${NAME%%#*}"
fi

case "$NAME" in
	"" | */*)
		NAME="broll_$(date +%s).mp4"
		;;
esac

OUT_PATH="$OUT_DIR/$NAME"

echo "Downloading: $URL"
echo "      Saving: $OUT_PATH"

if command -v curl >/dev/null 2>&1; then
	curl -fL --retry 3 --retry-delay 2 -o "$OUT_PATH" "$URL"
elif command -v wget >/dev/null 2>&1; then
	wget -O "$OUT_PATH" "$URL"
else
	echo "Error: curl or wget is required." >&2
	exit 1
fi

echo "Done: $OUT_PATH"
