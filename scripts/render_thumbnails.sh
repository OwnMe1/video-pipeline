#!/usr/bin/env bash
set -e
mkdir -p out
npx remotion still src/index.ts ThumbVariantA out/thumb_A.png
npx remotion still src/index.ts ThumbVariantB out/thumb_B.png
npx remotion still src/index.ts ThumbVariantC out/thumb_C.png
echo "OK: Все 3 A/B-обложки отрендерены в out/"
