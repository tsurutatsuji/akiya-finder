"""
@homeの物件詳細ページから正確な緯度経度を取得する
ページ内に埋め込まれた座標データを使用
"""
import json, urllib.request, re, time, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('data/scraped-properties.json', 'r', encoding='utf-8') as f:
    props = json.load(f)

print(f'Total: {len(props)}')
updated = 0
errors = 0

for i, p in enumerate(props):
    url = p.get('sourceUrl', '')
    if not url:
        continue
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=15)
        html = resp.read().decode('utf-8', errors='ignore')
        
        # Find lat/lng in the page
        lats = re.findall(r'(3[4-6]\.[0-9]{5,})', html)
        lngs = re.findall(r'(1[23][0-9]\.[0-9]{5,})', html)
        
        if lats and lngs:
            new_lat = float(lats[0])
            new_lng = float(lngs[0])
            # Sanity check - must be in Japan
            if 24 < new_lat < 46 and 122 < new_lng < 146:
                p['lat'] = new_lat
                p['lng'] = new_lng
                updated += 1
    except:
        errors += 1
    
    if (i + 1) % 100 == 0:
        print(f'  [{i+1}/{len(props)}] updated={updated} errors={errors}')
        with open('data/scraped-properties.json', 'w', encoding='utf-8') as f:
            json.dump(props, f, ensure_ascii=False)
    
    time.sleep(1)

with open('data/scraped-properties.json', 'w', encoding='utf-8') as f:
    json.dump(props, f, ensure_ascii=False)
print(f'\nDone! updated={updated} errors={errors}')
