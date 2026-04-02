import json, urllib.request, re, time, sys, os
sys.stdout.reconfigure(encoding='utf-8')

data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'scraped-properties.json')
with open(data_path, 'r', encoding='utf-8') as f:
    props = json.load(f)

# Find properties that DONT have real photos yet
need_photos = []
for i, p in enumerate(props):
    has_real = False
    if p.get('allImages'):
        has_real = any('akiya-athome' not in img for img in p.get('allImages', []))
    if p.get('municipalityUrl'):
        has_real = True
    if not has_real:
        need_photos.append((i, p))

print(f'Need photos: {len(need_photos)}')
updated = 0
errors = 0

for count, (idx, p) in enumerate(need_photos):
    source_url = p.get('sourceUrl', '')
    if not source_url:
        continue
    try:
        req = urllib.request.Request(source_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        resp = urllib.request.urlopen(req, timeout=15)
        html = resp.read().decode('utf-8', errors='ignore')
        
        links = re.findall(r'href="(https?://[^"]+)"', html)
        external = [l for l in links if 'akiya-athome.jp' not in l and 'athome.co.jp' not in l 
                    and not l.startswith('https://www.google') and not l.startswith('https://maps')
                    and not l.startswith('https://www.youtube')]
        
        if not external:
            errors += 1
            if (count + 1) % 50 == 0:
                print(f'  [{count+1}/{len(need_photos)}] updated={updated} errors={errors}')
            time.sleep(1)
            continue
        
        muni_url = external[0]
        try:
            req2 = urllib.request.Request(muni_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            resp2 = urllib.request.urlopen(req2, timeout=15)
            muni_html = resp2.read().decode('utf-8', errors='ignore')
            
            img_pattern = r'<img[^>]*src="([^"]+)"[^>]*>'
            img_tags = re.findall(img_pattern, muni_html)
            
            base_domain = '/'.join(muni_url.split('/')[:3])
            photo_candidates = []
            
            for img_src in img_tags:
                if img_src.startswith('//'):
                    img_src = 'https:' + img_src
                elif img_src.startswith('/'):
                    img_src = base_domain + img_src
                elif not img_src.startswith('http'):
                    continue
                
                lower = img_src.lower()
                if any(ext in lower for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    if any(skip in lower for skip in ['logo', 'icon', 'banner', 'header', 'footer', 'button', 'arrow', 'nav', 'favicon', 'sprite', 'bg_', 'common/', 'share', 'sns', 'twitter', 'facebook', 'line']):
                        continue
                    photo_candidates.append(img_src)
            
            if photo_candidates:
                props[idx]['thumbnailUrl'] = photo_candidates[0]
                props[idx]['allImages'] = photo_candidates[:6]
                props[idx]['municipalityUrl'] = muni_url
                updated += 1
        except:
            pass
        
        if (count + 1) % 50 == 0:
            print(f'  [{count+1}/{len(need_photos)}] updated={updated} errors={errors}')
            with open(data_path, 'w', encoding='utf-8') as f:
                json.dump(props, f, ensure_ascii=False)
        
        time.sleep(1.5)
    except Exception as e:
        errors += 1

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(props, f, ensure_ascii=False)

print(f'\nDone! updated={updated} errors={errors}')
