"""
@homeの物件詳細ページのJavaScriptカルーセルから正しい物件写真を取得する
image_tile_carousel_image_s のJSON配列から fullsize URLを取得
"""
import json, urllib.request, re, time, sys, os
sys.stdout.reconfigure(encoding='utf-8')

data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'scraped-properties.json')
with open(data_path, 'r', encoding='utf-8') as f:
    props = json.load(f)

print(f'Total properties: {len(props)}')

updated = 0
errors = 0
no_carousel = 0

for i, p in enumerate(props):
    source_url = p.get('sourceUrl', '')
    if not source_url:
        continue

    try:
        req = urllib.request.Request(source_url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        resp = urllib.request.urlopen(req, timeout=15)
        html = resp.read().decode('utf-8', errors='ignore')

        # Extract carousel JSON
        match = re.search(r'image_tile_carousel_image_s\s*=\s*(\[.*?\]);', html, re.DOTALL)
        if match:
            raw = match.group(1).replace('\/', '/')
            try:
                data = json.loads(raw)
                if data and len(data) > 0:
                    # Get fullsize URLs (higher quality)
                    full_urls = []
                    for item in data:
                        full = item.get('image_url_fullsize', '')
                        if full:
                            if full.startswith('//'):
                                full = 'https:' + full
                            full_urls.append(full)

                    if full_urls:
                        p['thumbnailUrl'] = full_urls[0]
                        p['allImages'] = full_urls
                        p['carouselPhotoCount'] = len(full_urls)
                        updated += 1
                    else:
                        no_carousel += 1
                else:
                    no_carousel += 1
            except json.JSONDecodeError:
                no_carousel += 1
        else:
            no_carousel += 1

        if (i + 1) % 100 == 0:
            print(f'  [{i+1}/{len(props)}] updated={updated} no_carousel={no_carousel} errors={errors}')
            with open(data_path, 'w', encoding='utf-8') as f:
                json.dump(props, f, ensure_ascii=False)

        time.sleep(1)

    except Exception as e:
        errors += 1
        if (i + 1) % 100 == 0:
            print(f'  [{i+1}/{len(props)}] updated={updated} no_carousel={no_carousel} errors={errors} last={e}')

# Final save
with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(props, f, ensure_ascii=False)

print(f'\nDone! updated={updated} no_carousel={no_carousel} errors={errors}')
