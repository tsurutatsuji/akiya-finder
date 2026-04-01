"""
奥多摩町の独自空き家バンクサイトから取得した物件写真を
scraped-properties.json の対応物件に紐づけるスクリプト
"""
import json
import re
import urllib.request
import sys
import os

# UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'scraped-properties.json')
BASE_URL = "https://www.town.okutama.tokyo.jp"

# 奥多摩町独自サイトから取得した物件データ (detail_id -> data)
# detail_id は /cgi-bin/recruit.php/1/detail/{detail_id} のID
okutama_site_properties = [
    {
        "property_no": "116",
        "detail_id": 53,
        "address": "奥多摩町海澤901番地4",
        "landArea": "132.22㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/53/20250613134203859.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/53/20250822131717635.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/53/20250822131734861.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/53/20250822132014294.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/53/20250822132018049.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/53/20250822132123261.png",
        ]
    },
    {
        "property_no": "118",
        "detail_id": 55,
        "address": "奥多摩町海澤字上野895番15他8筆",
        "landArea": "322.06㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/55/20250905095241334.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/55/20250905095307164.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/55/20250905095515695.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/55/20250905095441190.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/55/20250905095538053.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/55/20250905095548330.png",
        ]
    },
    {
        "property_no": "79",
        "detail_id": 2,
        "address": "奥多摩町境944番地",
        "landArea": "195.04㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/2/20220325103130297.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/2/20220325103135211.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/2/20220325103157840.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/2/20220325103204418.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/2/20220325103208869.png",
        ]
    },
    {
        "property_no": "65",
        "detail_id": 8,
        "address": "奥多摩町氷川311-3",
        "landArea": "271.09㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/8/20220328131431333.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/8/20220328131449029.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/8/20220328131500646.jpg",
        ]
    },
    {
        "property_no": "52",
        "detail_id": 11,
        "address": "奥多摩町氷川1370-35",
        "landArea": "162.72㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/11/20220328143854056.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/11/20220328143927443.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/11/20220328144007123.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/11/20220328144047156.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/11/20220328144112435.png",
        ]
    },
    {
        "property_no": "123",
        "detail_id": 60,
        "address": "奥多摩町氷川字長畑676番地2",
        "landArea": "141.81㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/60/20260114134551934.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/60/20260114134607277.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/60/20260114134630292.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/60/20260114134744729.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/60/20260114134721870.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/60/20260114134711890.png",
        ]
    },
    {
        "property_no": "121",
        "detail_id": 58,
        "address": "奥多摩町原字日村73番地6",
        "landArea": "849.01㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/58/20251117175301787.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/58/20251117175411416.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/58/20251117175431270.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/58/20251117175425513.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/58/20251117175438058.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/58/20251117175442808.png",
        ]
    },
    {
        "property_no": "68",
        "detail_id": 7,
        "address": "奥多摩町川井775-1他",
        "landArea": "3351.29㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/7/20220328115739856.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/7/20220328115754189.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/7/20220328115807613.jpg",
        ]
    },
    {
        "property_no": "109",
        "detail_id": 46,
        "address": "奥多摩町留浦字峯899番地",
        "landArea": "175.20㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/46/20241025121209356.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/46/20250625153931490.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/46/20250625153922889.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/46/20241025121749189.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/46/20250625153948691.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/46/20250625153954098.png",
        ]
    },
    {
        "property_no": "61",
        "detail_id": 1,
        "address": "奥多摩町境876",
        "landArea": "152.06㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/1/20220325110330721.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/1/20220325110403757.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/1/20220325110433032.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/1/20220325112946010.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/1/20220325113001602.png",
        ]
    },
    {
        "property_no": "104",
        "detail_id": 42,
        "address": "奥多摩町小丹波字宮ノ下441番1",
        "landArea": "195.50㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/42/20251201165747685.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/42/20251201165752829.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/42/20251201165803084.JPG",
        ]
    },
    {
        "property_no": "122",
        "detail_id": 59,
        "address": "奥多摩町日原字大沢195番3・196番2",
        "landArea": "468.03㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/59/20251117181935431.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/59/20251117181942754.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/59/20251117181951137.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/59/20251117181957024.png",
        ]
    },
    {
        "property_no": "89",
        "detail_id": 27,
        "address": "奥多摩町海澤字上野895番20他1筆",
        "landArea": "162.61㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/27/20230306084437850.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/27/20230306084454300.JPG",
        ]
    },
    {
        "property_no": "17",
        "detail_id": 14,
        "address": "奥多摩町川井144-3",
        "landArea": "184.43㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/14/20220328153330734.jpg",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/14/20220328153343195.jpg",
        ]
    },
    {
        "property_no": "99",
        "detail_id": 37,
        "address": "奥多摩町川野265-8",
        "landArea": "181㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/37/20231130093214023.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/37/20240206152004651.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/37/20240206152023920.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/37/20240206152044240.JPG",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/37/20240206151507439.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/37/20240206151512512.png",
        ]
    },
    {
        "property_no": "50",
        "detail_id": 12,
        "address": "奥多摩町氷川1768",
        "landArea": "130.9㎡",
        "images": [
            "https://www.town.okutama.tokyo.jp/material/recruit/1/12/20220328145511025.png",
            "https://www.town.okutama.tokyo.jp/material/recruit/1/12/20220328145543056.png",
        ]
    },
]


def normalize_area(area_str):
    """面積文字列から数値を抽出 (㎡単位)"""
    if not area_str:
        return None
    # 全角数字→半角
    area_str = area_str.translate(str.maketrans('０１２３４５６７８９．', '0123456789.'))
    m = re.search(r'([\d.]+)', area_str.replace(',', ''))
    if m:
        return float(m.group(1))
    return None


def extract_district(location_ja):
    """locationJaから地区名を抽出 (例: 東京都西多摩郡奥多摩町氷川 -> 氷川)"""
    m = re.search(r'奥多摩町(.+)$', location_ja)
    if m:
        return m.group(1)
    return None


def extract_district_from_site(address):
    """独自サイトの住所から地区名を抽出 (例: 奥多摩町海澤901番地4 -> 海澤)"""
    m = re.search(r'奥多摩町([^\d字]+)', address)
    if m:
        return m.group(1)
    return None


def normalize_image_url(url):
    """画像URLを正規化 (// で始まるURLにhttps:を追加)"""
    if url.startswith('//'):
        return 'https:' + url
    return url


def match_properties(athome_props, site_props):
    """@home物件と独自サイト物件をマッチング"""
    matches = []
    used_site = set()

    for ap in athome_props:
        ap_land = normalize_area(ap.get('landArea', ''))
        ap_district = extract_district(ap.get('locationJa', ''))

        best_match = None
        best_score = 0

        for i, sp in enumerate(site_props):
            if i in used_site:
                continue

            score = 0
            sp_land = normalize_area(sp['landArea'])
            sp_district = extract_district_from_site(sp['address'])

            # 土地面積の一致 (最重要 - 完全一致はほぼ確実)
            if ap_land and sp_land:
                if abs(ap_land - sp_land) < 0.1:
                    score += 100  # 面積完全一致
                elif abs(ap_land - sp_land) < 1.0:
                    score += 80   # ほぼ一致
                elif abs(ap_land - sp_land) / max(ap_land, sp_land) < 0.05:
                    score += 50   # 5%以内

            # 地区名の一致
            if ap_district and sp_district:
                if ap_district == sp_district:
                    score += 30
                elif ap_district in sp_district or sp_district in ap_district:
                    score += 20

            if score > best_score:
                best_score = score
                best_match = i

        if best_match is not None and best_score >= 80:
            matches.append({
                'athome': ap,
                'site': site_props[best_match],
                'score': best_score,
            })
            used_site.add(best_match)
        else:
            # 面積一致がない場合、地区名+面積の近似でマッチング
            if best_match is not None and best_score >= 30:
                matches.append({
                    'athome': ap,
                    'site': site_props[best_match],
                    'score': best_score,
                    'uncertain': True,
                })
                used_site.add(best_match)
            else:
                matches.append({
                    'athome': ap,
                    'site': None,
                    'score': 0,
                    'unmatched': True,
                })

    return matches


def verify_image_url(url, timeout=10):
    """画像URLにアクセスして有効か確認"""
    try:
        req = urllib.request.Request(url, method='HEAD')
        req.add_header('User-Agent', 'Mozilla/5.0')
        resp = urllib.request.urlopen(req, timeout=timeout)
        ct = resp.headers.get('Content-Type', '')
        cl = resp.headers.get('Content-Length', '0')
        return {
            'status': resp.status,
            'content_type': ct,
            'content_length': int(cl) if cl else 0,
            'ok': resp.status == 200 and ('image' in ct or int(cl) > 1000),
        }
    except Exception as e:
        return {'status': 0, 'error': str(e), 'ok': False}


def main():
    # Load data
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        all_properties = json.load(f)

    # Find okutama properties
    okutama_athome = [p for p in all_properties if 'okutama' in p.get('sourceUrl', '').lower()]
    print(f"=== 奥多摩町物件写真更新スクリプト ===")
    print(f"全物件数: {len(all_properties)}")
    print(f"奥多摩@home物件: {len(okutama_athome)}件")
    print(f"奥多摩独自サイト物件: {len(okutama_site_properties)}件")
    print()

    # Match
    matches = match_properties(okutama_athome, okutama_site_properties)

    # Report and update
    matched_count = 0
    updated_count = 0
    total_images = 0
    verified_ok = 0
    verified_fail = 0

    print("=== マッチング結果 ===")
    for m in matches:
        ap = m['athome']
        sp = m['site']
        score = m['score']

        if sp is None:
            print(f"  ✗ {ap['id']} ({ap.get('locationJa','')}, land={ap.get('landArea','')}) → マッチなし")
            continue

        matched_count += 1
        is_uncertain = m.get('uncertain', False)
        marker = "△" if is_uncertain else "✓"
        print(f"  {marker} {ap['id']} ({ap.get('locationJa','')}, land={ap.get('landArea','')}) "
              f"→ 物件No.{sp['property_no']} ({sp['address']}, land={sp['landArea']}) [score={score}]")

        # Normalize image URLs
        images = [normalize_image_url(img) for img in sp['images']]
        print(f"    写真: {len(images)}枚")

        # Verify first image
        first_img = images[0]
        result = verify_image_url(first_img)
        if result['ok']:
            verified_ok += 1
            print(f"    画像検証OK: {first_img[:80]}... (status={result['status']}, size={result.get('content_length',0)})")
        else:
            verified_fail += 1
            print(f"    画像検証NG: {first_img[:80]}... ({result})")

        # Update property in all_properties
        if not is_uncertain:
            for p in all_properties:
                if p['id'] == ap['id']:
                    # 写真を除外 (間取り図=png) して最初の実写真をサムネイルに
                    photo_images = [img for img in images if not img.lower().endswith('.png')]
                    if photo_images:
                        p['thumbnailUrl'] = photo_images[0]
                    else:
                        p['thumbnailUrl'] = images[0]
                    p['allImages'] = images
                    p['okutamaPropertyNo'] = sp['property_no']
                    p['okutamaDetailUrl'] = f"https://www.town.okutama.tokyo.jp/cgi-bin/recruit.php/1/detail/{sp['detail_id']}?ck=1"
                    updated_count += 1
                    total_images += len(images)
                    break

    print()
    print("=== サマリー ===")
    print(f"マッチング成功: {matched_count}/{len(okutama_athome)}件")
    print(f"JSON更新: {updated_count}件")
    print(f"取得画像総数: {total_images}枚")
    print(f"画像検証OK: {verified_ok}件, NG: {verified_fail}件")

    # Save
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(all_properties, f, ensure_ascii=False, indent=2)
    print(f"\n{DATA_PATH} を更新しました。")


if __name__ == '__main__':
    main()
