"""
全物件に対して:
1. @homeの詳細ページから自治体独自サイトのリンクを取得
2. 自治体サイトから物件写真を取得
3. 写真がなければスキップ（後でGoogle Street Viewで対応）
"""
import json, urllib.request, re, time, sys, os

sys.stdout.reconfigure(encoding='utf-8')

data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'scraped-properties.json')
with open(data_path, 'r', encoding='utf-8') as f:
    props = json.load(f)

print(f'Total properties: {len(props)}')

# Skip properties that already have real photos
from_okutama = sum(1 for p in props if p.get('allImages') and any('town.okutama' in img for img in p.get('allImages', [])))
print(f'Already have real photos: {from_okutama}')

updated = 0
errors = 0
no_link = 0
no_photo = 0

for i, p in enumerate(props):
    # Skip if already has real photos (not @home banner)
    if p.get('allImages') and any('akiya-athome' not in img for img in p.get('allImages', [])):
        continue
    
    source_url = p.get('sourceUrl', '')
    if not source_url:
        continue
    
    try:
        # Step 1: Fetch @home detail page
        req = urllib.request.Request(source_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        resp = urllib.request.urlopen(req, timeout=15)
        html = resp.read().decode('utf-8', errors='ignore')
        
        # Step 2: Find external municipality links
        links = re.findall(r'href="(https?://[^"]+)"', html)
        external = [l for l in links if 'akiya-athome.jp' not in l and 'athome.co.jp' not in l 
                    and not l.startswith('https://www.google') and not l.startswith('https://maps')]
        
        if not external:
            no_link += 1
            if (i + 1) % 100 == 0:
                print(f'  [{i+1}/{len(props)}] updated={updated} no_link={no_link} no_photo={no_photo} errors={errors}')
            time.sleep(1)
            continue
        
        # Step 3: Try to fetch municipality page and find photos
        muni_url = external[0]
        try:
            req2 = urllib.request.Request(muni_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            resp2 = urllib.request.urlopen(req2, timeout=15)
            muni_html = resp2.read().decode('utf-8', errors='ignore')
            
            # Find image URLs on municipality page
            img_pattern = r'<img[^>]*src="([^"]+)"[^>]*>'
            img_tags = re.findall(img_pattern, muni_html)
            
            # Filter for actual property photos (jpg/jpeg/png, not icons/logos)
            photo_candidates = []
            base_domain = '/'.join(muni_url.split('/')[:3])
            
            for img_src in img_tags:
                # Make absolute URL
                if img_src.startswith('//'):
                    img_src = 'https:' + img_src
                elif img_src.startswith('/'):
                    img_src = base_domain + img_src
                elif not img_src.startswith('http'):
                    continue
                
                # Filter: must be jpg/jpeg/png, reasonable size indicator
                lower = img_src.lower()
                if any(ext in lower for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    # Skip common non-photo patterns
                    if any(skip in lower for skip in ['logo', 'icon', 'banner', 'header', 'footer', 'button', 'arrow', 'nav', 'favicon', 'sprite', 'bg_', 'common/', 'share']):
                        continue
                    photo_candidates.append(img_src)
            
            if photo_candidates:
                # Use first photo as thumbnail, store all
                p['thumbnailUrl'] = photo_candidates[0]
                p['allImages'] = photo_candidates[:6]  # Max 6 photos
                p['municipalityUrl'] = muni_url
                updated += 1
            else:
                no_photo += 1
                
        except Exception:
            no_photo += 1
        
        if (i + 1) % 100 == 0:
            print(f'  [{i+1}/{len(props)}] updated={updated} no_link={no_link} no_photo={no_photo} errors={errors}')
            # Save progress
            with open(data_path, 'w', encoding='utf-8') as f:
                json.dump(props, f, ensure_ascii=False)
        
        time.sleep(1.5)  # Be nice to servers
        
    except Exception as e:
        errors += 1
        if (i + 1) % 100 == 0:
            print(f'  [{i+1}/{len(props)}] updated={updated} no_link={no_link} no_photo={no_photo} errors={errors} last_err={e}')

# Final save
with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(props, f, ensure_ascii=False)

print(f'\nDone! updated={updated} no_link={no_link} no_photo={no_photo} errors={errors}')
