#!/usr/bin/env python3
import sys
import json
import urllib.request
import urllib.parse
import os

def search_and_download(query: str, output_path: str, width: int = 1280):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; VideoPipelineBot/1.0)"
    }
    params = urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"filetype:bitmap|drawing {query}",
        "gsrnamespace": "6",
        "gsrlimit": "5",
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "iiurlwidth": str(width)
    })
    api_base = "https://" + "commons.wikimedia.org" + "/w/api.php"
    url = f"{api_base}?{params}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = resp.read().decode("utf-8")
        data = json.loads(raw)

    pages = data.get("query", {}).get("pages", {})
    if not pages:
        print(f"ERROR: Ничего не найдено по запросу '{query}'", file=sys.stderr)
        sys.exit(1)

    sorted_pages = sorted(pages.values(), key=lambda x: x.get("index", 999))
    for page in sorted_pages:
        info_list = page.get("imageinfo", [])
        if not info_list:
            continue
        info = info_list[0]
        download_url = info.get("thumburl") or info.get("url")
        if not download_url:
            continue
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        img_req = urllib.request.Request(download_url, headers=headers)
        with urllib.request.urlopen(img_req, timeout=20) as img_resp:
            content = img_resp.read()
        with open(output_path, "wb") as f:
            f.write(content)
        print(f"OK: Скачано '{page.get('title')}' -> {output_path} ({len(content)} bytes)")
        return

    print("ERROR: Не удалось получить ссылку на скачивание", file=sys.stderr)
    sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Использование: fetch_wikimedia.py <поисковый_запрос> <путь_сохранения> [ширина_px]")
        sys.exit(1)
    q = sys.argv[1]
    out = sys.argv[2]
    w = int(sys.argv[3]) if len(sys.argv) > 3 else 1280
    search_and_download(q, out, w)
