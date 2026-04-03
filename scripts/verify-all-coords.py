"""
全物件の座標を@homeの元ページと照合し、正しい座標に修正する。
1件ずつ@homeのページにアクセスして、ページ内の座標を取得し、
現在のデータと比較して異なる場合は修正する。
"""
import json, urllib.request, re, time, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('data/scraped-properties.json', 'r', encoding='utf-8') as f:
    props = json.load(f)

print(f'Total properties: {len(props)}')

correct = 0
fixed = 0
no_coords = 0
errors = 0

for i, p in enumerate(props):
    url = p.get('sourceUrl', '')
    if not url:
        continue
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=15)
        html = resp.read().decode('utf-8', errors='ignore')
        
        # Extract coordinates from the page
        lats = re.findall(r'(3[4-6]\.[0-9]{5,})', html)
        lngs = re.findall(r'(1[23][0-9]\.[0-9]{5,})', html)
        
        if lats and lngs:
            page_lat = float(lats[0])
            page_lng = float(lngs[0])
            
            # Sanity check - must be in Japan
            if not (24 < page_lat < 46 and 122 < page_lng < 146):
                no_coords += 1
                continue
            
            current_lat = p.get('lat', 0)
            current_lng = p.get('lng', 0)
            
            # Check if different (more than 0.001 degrees = ~100m)
            lat_diff = abs(current_lat - page_lat)
            lng_diff = abs(current_lng - page_lng)
            
            if lat_diff > 0.001 or lng_diff > 0.001:
                p['lat'] = page_lat
                p['lng'] = page_lng
                fixed += 1
                print(f'  FIXED {p["id"]}: ({current_lat},{current_lng}) -> ({page_lat},{page_lng}) diff=({lat_diff:.4f},{lng_diff:.4f})')
            else:
                correct += 1
        else:
            no_coords += 1
    
    except Exception as e:
        errors += 1
    
    if (i + 1) % 100 == 0:
        print(f'[{i+1}/{len(props)}] correct={correct} fixed={fixed} no_coords={no_coords} errors={errors}')
        with open('data/scraped-properties.json', 'w', encoding='utf-8') as f:
            json.dump(props, f, ensure_ascii=False)
    
    time.sleep(1)

# Final save
with open('data/scraped-properties.json', 'w', encoding='utf-8') as f:
    json.dump(props, f, ensure_ascii=False)

print(f'\n=== FINAL RESULT ===')
print(f'Total: {len(props)}')
print(f'Correct (already matched): {correct}')
print(f'Fixed (coordinates updated): {fixed}')
print(f'No coords on page: {no_coords}')
print(f'Errors (page inaccessible): {errors}')
