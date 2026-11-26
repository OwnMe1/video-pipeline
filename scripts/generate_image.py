#!/usr/bin/env python3
import sys, os, urllib.request, urllib.parse

def load_api_key():
    key = os.environ.get("POLLINATIONS_API_KEY", "").strip()
    if key:
        return key
    env_path = os.path.expanduser("~/video-project/.env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("POLLINATIONS_API_KEY="):
                    parts = line.split("=", 1)
                    return parts.pop().strip().strip("\"").strip("'")
    return ""

def generate_image(prompt, output_path, width=1280, height=720, model="black-forest-labs/flux.1-schnell"):
    api_key = load_api_key()
    if not api_key:
        print("WARNING: POLLINATIONS_API_KEY не задан. Добавьте POLLINATIONS_API_KEY=sk_... в ~/video-project/.env", file=sys.stderr)
        sys.exit(2)
    encoded_prompt = urllib.parse.quote(prompt)
    params = urllib.parse.urlencode({"model": model, "width": str(width), "height": str(height), "seed": "-1"})
    url = "https://" + "gen.pollinations.ai" + f"/image/{encoded_prompt}?{params}"
    headers = {"Authorization": f"Bearer {api_key}", "User-Agent": "VideoPipelineBot/1.0"}
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as resp:
        content = resp.read()
    with open(output_path, "wb") as f:
        f.write(content)
    print(f"OK: Сгенерировано -> {output_path} ({len(content)} bytes)")

if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) < 2:
        print("Использование: generate_image.py <prompt> <output_path> [width] [height] [model]")
        sys.exit(1)
    p = args.pop(0)
    out = args.pop(0)
    w = int(args.pop(0)) if args else 1280
    h = int(args.pop(0)) if args else 720
    m = args.pop(0) if args else "black-forest-labs/flux.1-schnell"
    generate_image(p, out, w, h, m)
