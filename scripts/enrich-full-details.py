"""
全物件に追加情報（建ぺい率、容積率、階建、現況、こだわり条件）を取得
+ キャプション復元
"""
import json, urllib.request, re, time, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('data/scraped-properties.json', 'r', encoding='utf-8') as f:
    props = json.load(f)

print(f'Total: {len(props)}')
updated = 0
errors = 0

for i, p in enumerate(props):
    # Skip if already has buildingCoverageRatio (already enriched)
    if p.get('buildingCoverageRatio') and p.get('imageCaptions'):
        continue
    
    url = p.get('sourceUrl', '')
    if not url:
        continue
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        resp = urllib.request.urlopen(req, timeout=15)
        html = resp.read().decode('utf-8', errors='ignore')
        
        # Extract th/td pairs
        pairs = re.findall(r'<th[^>]*>(.*?)</th>\s*<td[^>]*>(.*?)</td>', html, re.DOTALL)
        fields = {}
        for label, value in pairs:
            label = re.sub(r'<[^>]+>', '', label).strip()
            value = re.sub(r'<[^>]+>', '', value).strip()
            value = re.sub(r'\s+', ' ', value).strip()
            if label and value and value != '-':
                fields[label] = value
        
        # Update fields
        if not p.get('buildingCoverageRatio'):
            floors_raw = fields.get('階建/階', '')
            p['floors'] = floors_raw.split('/')[0].strip() if floors_raw else ''
            p['currentStatus'] = fields.get('現況', '')
            p['buildingCoverageRatio'] = fields.get('建ぺい率', '')
            p['floorAreaRatio'] = fields.get('容積率', '')
            p['landCategory'] = fields.get('地目', '')
            p['cityPlanning'] = fields.get('都市計画', '')
            p['delivery'] = fields.get('引渡し', '')
            p['publishDate'] = fields.get('情報公開日', '')
            kodawari = fields.get('こだわり条件', '')
            if kodawari:
                p['kodawari'] = kodawari
        
        # Captions
        if not p.get('imageCaptions'):
            match = re.search(r'image_tile_carousel_image_s\s*=\s*(\[.*?\]);', html, re.DOTALL)
            if match:
                raw = match.group(1).replace('\/','/')
                try:
                    data = json.loads(raw)
                    caps = [item.get('title','') or item.get('abstract','') or '' for item in data]
                    if any(c for c in caps):
                        p['imageCaptions'] = caps
                except:
                    pass
        
        updated += 1
        
        if (i + 1) % 100 == 0:
            print(f'  [{i+1}/{len(props)}] updated={updated} errors={errors}')
            with open('data/scraped-properties.json', 'w', encoding='utf-8') as f:
                json.dump(props, f, ensure_ascii=False)
        
        time.sleep(1)
    
    except Exception as e:
        errors += 1
        if (i + 1) % 100 == 0:
            print(f'  [{i+1}/{len(props)}] updated={updated} errors={errors} last={e}')

with open('data/scraped-properties.json', 'w', encoding='utf-8') as f:
    json.dump(props, f, ensure_ascii=False)
print(f'\nDone! updated={updated} errors={errors}')
