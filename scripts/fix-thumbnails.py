"""
物件ページから正しいサムネイル画像URLを再取得するスクリプト
元のthumbnailUrlは自治体ページのアイコンを取得してしまっている
"""
import json, urllib.request, re, time, os

data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'scraped-properties.json')

with open(data_path, 'r', encoding='utf-8') as f:
    props = json.load(f)

print(f'Total properties: {len(props)}')

updated = 0
errors = 0

for i, p in enumerate(props):
    source_url = p.get('sourceUrl', '')
    if not source_url:
        continue

    try:
        req = urllib.request.Request(source_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        resp = urllib.request.urlopen(req, timeout=10)
        html = resp.read().decode('utf-8', errors='ignore')

        # Find image URLs - look for the larger/full images (bL7 or YzeW patterns tend to be property photos)
        pattern = r'//img\.akiya-athome\.jp/\?v=[A-Za-z0-9_\-]+'
        images = re.findall(pattern, html)
        unique = list(dict.fromkeys(images))

        if len(unique) >= 2:
            # First image is usually the same bad thumbnail, second is usually the real property photo
            p['thumbnailUrl'] = 'https:' + unique[1]
            p['allImages'] = ['https:' + img for img in unique]
            updated += 1
        elif len(unique) == 1:
            p['thumbnailUrl'] = 'https:' + unique[0]
            p['allImages'] = ['https:' + unique[0]]
            updated += 1

        if (i + 1) % 20 == 0:
            print(f'  [{i+1}/{len(props)}] Updated: {updated}, Errors: {errors}')
            # Save progress every 20 items
            with open(data_path, 'w', encoding='utf-8') as f:
                json.dump(props, f, ensure_ascii=False, indent=2)

        time.sleep(0.5)  # Be nice to the server

    except Exception as e:
        errors += 1
        if (i + 1) % 20 == 0:
            print(f'  [{i+1}/{len(props)}] Updated: {updated}, Errors: {errors} (last: {e})')

# Final save
with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(props, f, ensure_ascii=False, indent=2)

print(f'\nDone! Updated: {updated}, Errors: {errors}')
