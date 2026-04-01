"""
全物件エンリッチ処理（Python版）
1. 詳細情報取得（enrich-details相当）
2. 座標取得（geocode相当）
3. 投資指標算出（enrich-investment-data相当）

Usage: python scripts/enrich-all.py
"""

import json
import re
import time
import math
import urllib.request
import urllib.parse
import os
import sys
import io
from html import unescape
from datetime import datetime

# Windows cp932エンコーディングエラー回避
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
PROPERTIES_FILE = os.path.join(DATA_DIR, "scraped-properties.json")
DETAIL_CACHE_FILE = os.path.join(DATA_DIR, "detail-cache.json")
GEOCODE_CACHE_FILE = os.path.join(DATA_DIR, "geocode-cache.json")

DETAIL_DELAY_MS = 2.0  # seconds between detail requests
GEOCODE_DELAY_MS = 1.1  # seconds between nominatim requests
JPY_TO_USD = 150

# ============================================================
# Utilities
# ============================================================

def load_json(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def fetch_url(url, headers=None, timeout=30):
    """URL取得。リトライ付き。"""
    if headers is None:
        headers = {}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        return None

def extract_th_td(html, th_name):
    """HTMLテーブルからth名に対応するtd値を抽出"""
    pattern = re.compile(
        r'<th[^>]*>\s*' + re.escape(th_name) + r'[^<]*</th>\s*<td[^>]*>([\s\S]*?)</td>',
        re.IGNORECASE
    )
    m = pattern.search(html)
    if not m:
        return ""
    val = m.group(1)
    val = re.sub(r'<br\s*/?>', ' ', val)
    val = re.sub(r'<[^>]+>', '', val)
    val = re.sub(r'\s+', ' ', val).strip()
    return val


# ============================================================
# Step 1: Detail enrichment
# ============================================================

def parse_detail_page(html):
    # 画像URL
    img_match = re.search(r'//img\.akiya-athome\.jp[^"\'> ]+', html)
    thumbnail_url = ""
    if img_match:
        thumbnail_url = "https:" + img_match.group(0).replace("&amp;", "&")

    access = extract_th_td(html, "交通")
    features = extract_th_td(html, "こだわり条件")
    structure = extract_th_td(html, "建物構造")
    remarks = extract_th_td(html, "備考")
    land_rights = extract_th_td(html, "土地権利")
    zoning = extract_th_td(html, "用途地域")

    return {
        "thumbnailUrl": thumbnail_url,
        "access": access,
        "features": features,
        "structure": structure,
        "remarks": remarks,
        "landRights": land_rights,
        "zoning": zoning,
    }

def enrich_details(properties, detail_cache):
    """Step 1: sourceUrlから詳細情報を取得"""
    print("=" * 60)
    print("Step 1: 詳細情報取得 (enrich-details)")
    print("=" * 60)

    to_fetch = [p for p in properties if p["id"] not in detail_cache and p.get("sourceUrl", "").find("akiya-athome.jp") >= 0]
    already_cached = len([p for p in properties if p["id"] in detail_cache])
    print(f"  全物件: {len(properties)}")
    print(f"  キャッシュ済み: {already_cached}")
    print(f"  取得対象: {len(to_fetch)}")
    print(f"  推定時間: ~{math.ceil(len(to_fetch) * DETAIL_DELAY_MS / 60)}分")
    print()

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "ja,en-US;q=0.9",
    }

    enriched = 0
    errors = 0
    consecutive_errors = 0

    for i, p in enumerate(to_fetch):
        url = p["sourceUrl"]
        print(f"  [{i+1}/{len(to_fetch)}] {p['id']}: {url[:80]}...", end="", flush=True)

        html = None
        for retry in range(3):
            html = fetch_url(url, headers=headers)
            if html:
                break
            backoff = [10, 30, 90][retry]
            print(f" (retry {retry+1}, wait {backoff}s)", end="", flush=True)
            time.sleep(backoff)

        if not html:
            print(" FAIL")
            errors += 1
            consecutive_errors += 1
            if consecutive_errors >= 10:
                print(f"\n  !!! 連続{consecutive_errors}件失敗。サーバーがブロックしている可能性。中断します。")
                break
            time.sleep(DETAIL_DELAY_MS)
            continue

        consecutive_errors = 0
        details = parse_detail_page(html)
        detail_cache[p["id"]] = details
        enriched += 1

        has_img = "img" if details["thumbnailUrl"] else "no-img"
        has_access = details["access"][:30] if details["access"] else "no-access"
        print(f" OK [{has_img}] {has_access}")

        # 50件ごとにキャッシュ保存
        if enriched % 50 == 0:
            save_json(DETAIL_CACHE_FILE, detail_cache)
            print(f"  >>> キャッシュ保存: {len(detail_cache)}件")

        time.sleep(DETAIL_DELAY_MS)

    # 最終保存
    save_json(DETAIL_CACHE_FILE, detail_cache)
    print(f"\n  完了: {enriched}件取得, {errors}件エラー")
    print(f"  キャッシュ合計: {len(detail_cache)}件")

    # キャッシュを物件データに適用
    applied = 0
    for p in properties:
        if p["id"] in detail_cache:
            p.update(detail_cache[p["id"]])
            applied += 1
    print(f"  物件データに適用: {applied}件")
    return enriched, errors


# ============================================================
# Step 2: Geocoding
# ============================================================

def extract_municipality(addr):
    """住所から市区町村レベルを抽出"""
    m = re.match(r'^(.+?[都道府県])(.+?[市区町村郡])', addr)
    if m:
        return m.group(1) + m.group(2)
    m = re.match(r'^(.+?[市区町村])', addr)
    if m:
        return m.group(1)
    return addr

def nominatim_geocode(query):
    """Nominatim APIで座標取得"""
    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(query)}&format=json&limit=1&countrycodes=jp"
    headers = {
        "User-Agent": "AkiyaFinder/1.0 (akiya property geocoding)",
        "Accept-Language": "ja,en",
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data and len(data) > 0:
                return (float(data[0]["lat"]), float(data[0]["lon"]))
    except Exception:
        pass
    return None

def geocode_properties(properties, geocode_cache):
    """Step 2: Nominatimで座標取得"""
    print("\n" + "=" * 60)
    print("Step 2: 座標取得 (geocode)")
    print("=" * 60)

    # 市区町村ごとにグループ化
    municipality_map = {}
    for p in properties:
        muni = extract_municipality(p.get("locationJa", ""))
        if muni not in municipality_map:
            municipality_map[muni] = []
        municipality_map[muni].append(p["id"])

    total_munis = len(municipality_map)
    uncached = [m for m in municipality_map if m not in geocode_cache]
    print(f"  全物件: {len(properties)}")
    print(f"  市区町村数: {total_munis}")
    print(f"  キャッシュ済み: {total_munis - len(uncached)}")
    print(f"  取得対象: {len(uncached)}")
    print(f"  推定時間: ~{math.ceil(len(uncached) * GEOCODE_DELAY_MS / 60)}分")
    print()

    done = 0
    for muni in uncached:
        done += 1
        coord = nominatim_geocode(muni)
        if coord:
            geocode_cache[muni] = list(coord)
            print(f"  [{done}/{len(uncached)}] OK {muni} -> {coord[0]:.4f}, {coord[1]:.4f}")
        else:
            # fallback: 都道府県名で再試行
            pref_match = re.match(r'^(.+?[都道府県])', muni)
            if pref_match:
                time.sleep(GEOCODE_DELAY_MS)
                pref_coord = nominatim_geocode(pref_match.group(1))
                if pref_coord:
                    geocode_cache[muni] = list(pref_coord)
                    print(f"  [{done}/{len(uncached)}] FALLBACK {muni} -> {pref_coord[0]:.4f}, {pref_coord[1]:.4f}")
                else:
                    print(f"  [{done}/{len(uncached)}] FAIL {muni}")
            else:
                print(f"  [{done}/{len(uncached)}] FAIL {muni}")

        save_json(GEOCODE_CACHE_FILE, geocode_cache)
        time.sleep(GEOCODE_DELAY_MS)

    # 座標を物件データに適用（ジッター付き）
    matched = 0
    unmatched = 0
    for p in properties:
        muni = extract_municipality(p.get("locationJa", ""))
        coord = geocode_cache.get(muni)
        if coord:
            idx = municipality_map[muni].index(p["id"])
            angle = (idx * 137.508) * (math.pi / 180)
            radius = 0.005 + math.sqrt(idx) * 0.003
            p["lat"] = coord[0] + radius * math.cos(angle)
            p["lng"] = coord[1] + radius * math.sin(angle)
            matched += 1
        else:
            unmatched += 1

    print(f"\n  完了: 座標適用 {matched}件, 未解決 {unmatched}件")
    print(f"  キャッシュ合計: {len(geocode_cache)}件")
    return matched, unmatched


# ============================================================
# Step 3: Investment data
# ============================================================

AIRBNB_DATA = {
    "Kyoto": {"nightlyRate": 15000, "occupancy": 0.65, "description": "Cultural capital. Machiya (traditional townhouses) command premium Airbnb rates. Year-round tourism demand."},
    "Hokkaido": {"nightlyRate": 12000, "occupancy": 0.55, "description": "World-class ski resorts (Niseko, Furano). Peak winter season Dec-Mar. Growing summer tourism."},
    "Okinawa": {"nightlyRate": 10000, "occupancy": 0.60, "description": "Tropical beaches. Year-round warm climate. Popular with domestic and Asian tourists."},
    "Nagano": {"nightlyRate": 11000, "occupancy": 0.50, "description": "Ski resorts (Hakuba, Nozawa) + highland retreats. Strong foreign buyer community in Hakuba."},
    "Shizuoka": {"nightlyRate": 10000, "occupancy": 0.45, "description": "Mt. Fuji views + Izu hot springs. Popular weekend destination from Tokyo."},
    "Kanagawa": {"nightlyRate": 9000, "occupancy": 0.50, "description": "Beach towns (Kamakura, Hayama) + hot springs (Hakone). Easy Tokyo access."},
    "Nara": {"nightlyRate": 9000, "occupancy": 0.45, "description": "Ancient capital with UNESCO sites. Day-trip destination from Osaka/Kyoto."},
    "Ishikawa": {"nightlyRate": 10000, "occupancy": 0.45, "description": "Kanazawa — 'Little Kyoto'. Traditional crafts, gardens, fresh seafood."},
    "Niigata": {"nightlyRate": 9000, "occupancy": 0.40, "description": "Major ski area (Myoko, Yuzawa). Sake country. Growing international interest."},
    "Oita": {"nightlyRate": 9000, "occupancy": 0.50, "description": "Beppu & Yufuin — Japan's top hot spring destinations. Strong tourism infrastructure."},
    "Hiroshima": {"nightlyRate": 8000, "occupancy": 0.45, "description": "Peace Memorial + Onomichi + Setouchi islands. Art tourism growing."},
    "Tokyo": {"nightlyRate": 8000, "occupancy": 0.55, "description": "Capital city. High demand but akiya are rare and expensive. Suburban areas have opportunities."},
    "Osaka": {"nightlyRate": 9000, "occupancy": 0.55, "description": "Food capital. Street-level culture. Strong domestic + international tourism."},
    "Chiba": {"nightlyRate": 7000, "occupancy": 0.35, "description": "Boso Peninsula — surfing + beach. Affordable Tokyo commute option."},
    "Yamanashi": {"nightlyRate": 8000, "occupancy": 0.40, "description": "Mt. Fuji area + wine country. Kawaguchiko is popular with Chinese investors."},
    "Kumamoto": {"nightlyRate": 7000, "occupancy": 0.35, "description": "Aso volcano + hot springs. Affordable properties with dramatic landscapes."},
    "Fukuoka": {"nightlyRate": 8000, "occupancy": 0.45, "description": "Japan's most livable city. Growing startup scene. Excellent food."},
    "Miyagi": {"nightlyRate": 7000, "occupancy": 0.35, "description": "Sendai — Tohoku's largest city. Zao ski resort nearby."},
    "Aichi": {"nightlyRate": 7000, "occupancy": 0.40, "description": "Nagoya — industrial center. Toyota country. Good transport hub."},
    "Hyogo": {"nightlyRate": 8000, "occupancy": 0.40, "description": "Kobe — international port city. Arima Onsen. Mountain + sea lifestyle."},
}
DEFAULT_AIRBNB = {"nightlyRate": 6000, "occupancy": 0.30, "description": "Rural Japan. Peaceful countryside living. Very affordable entry point for property ownership."}

REMARK_TRANSLATIONS = [
    (r'価格は相談可', "Price negotiable"),
    (r'売主の契約不適合責任は免責', "Sold as-is (no seller warranty)"),
    (r'現状渡し', "Sold as-is"),
    (r'リフォーム済', "Renovated"),
    (r'駐車場あり', "Parking available"),
    (r'駐車場', "Parking"),
    (r'即入居可', "Ready for immediate move-in"),
    (r'更地渡し', "Land will be cleared"),
    (r'古家あり', "Old house on site"),
    (r'上下水道', "Water & sewage connected"),
    (r'都市ガス', "City gas available"),
    (r'プロパンガス', "Propane gas"),
    (r'南向き', "South-facing"),
    (r'日当たり良好', "Good sun exposure"),
    (r'角地', "Corner lot"),
    (r'建替え', "Rebuild"),
    (r'増改築', "Extension/renovation"),
    (r'景観法', "Landscape preservation area"),
    (r'宅地造成工事規制区域', "Regulated development zone"),
    (r'傾斜地', "Sloped land"),
    (r'接道', "Road access"),
    (r'セットバック', "Setback required"),
    (r'道路後退', "Road setback required"),
    (r'再建築不可', "Cannot rebuild (no road access)"),
    (r'市街化調整区域', "Urbanization control area (building restrictions)"),
    (r'要リフォーム', "Renovation required"),
    (r'雨漏り', "Roof leak reported"),
    (r'シロアリ', "Termite damage reported"),
    (r'倉庫', "Storage/warehouse included"),
    (r'蔵', "Traditional storehouse (kura) included"),
    (r'畑', "Farmland included"),
    (r'田', "Rice paddy included"),
    (r'山林', "Forest land included"),
]

def translate_remarks(remarks):
    result = remarks
    for pattern, replacement in REMARK_TRANSLATIONS:
        result = re.sub(pattern, replacement, result)
    return result

def estimate_renovation_cost(year_built_str, building_area_str):
    year_match = re.search(r'(\d{4})', year_built_str or "")
    area_match = re.search(r'([\d,.]+)', building_area_str or "")
    if not year_match or not area_match:
        return None
    year = int(year_match.group(1))
    area = float(area_match.group(1).replace(",", ""))
    age = 2026 - year
    if age <= 10:
        cost_low, cost_high = 10000, 30000
    elif age <= 20:
        cost_low, cost_high = 30000, 60000
    elif age <= 40:
        cost_low, cost_high = 50000, 100000
    else:
        cost_low, cost_high = 80000, 150000
    return {"low": round(area * cost_low), "high": round(area * cost_high)}

def estimate_airbnb_revenue(prefecture_en, building_area_str):
    area_match = re.search(r'([\d,.]+)', building_area_str or "")
    if not area_match:
        return None
    area = float(area_match.group(1).replace(",", ""))
    if area < 30:
        return None
    data = AIRBNB_DATA.get(prefecture_en, DEFAULT_AIRBNB)
    gross = round(data["nightlyRate"] * 365 * data["occupancy"])
    net = round(gross * 0.65)
    return {"gross": gross, "net": net}

def enrich_investment_data(properties):
    """Step 3: 投資指標を算出"""
    print("\n" + "=" * 60)
    print("Step 3: 投資指標算出 (enrich-investment-data)")
    print("=" * 60)

    enriched = 0
    for p in properties:
        # USD換算
        p["priceUsd"] = 0 if p.get("price", 0) == 0 else round(p["price"] / JPY_TO_USD)
        p["priceUsdFormatted"] = "FREE" if p.get("price", 0) == 0 else f"${p['priceUsd']:,}"

        # m2単価
        area_match = re.search(r'([\d,.]+)', p.get("buildingArea", "") or "")
        if area_match and p.get("price", 0) > 0:
            area = float(area_match.group(1).replace(",", ""))
            if area > 0:
                p["pricePerSqm"] = round(p["price"] / area)
                p["pricePerSqmUsd"] = round(p["pricePerSqm"] / JPY_TO_USD)

        # 築年数
        year_match = re.search(r'(\d{4})', p.get("yearBuilt", "") or "")
        if year_match:
            p["buildingAge"] = 2026 - int(year_match.group(1))

        # 推定リノベ費用
        reno = estimate_renovation_cost(p.get("yearBuilt"), p.get("buildingArea"))
        if reno:
            p["estimatedRenovation"] = reno
            p["estimatedRenovationUsd"] = {
                "low": round(reno["low"] / JPY_TO_USD),
                "high": round(reno["high"] / JPY_TO_USD),
            }

        # 推定民泊収益
        airbnb = estimate_airbnb_revenue(p.get("prefectureEn", ""), p.get("buildingArea"))
        if airbnb:
            p["estimatedAirbnbRevenue"] = airbnb
            p["estimatedAirbnbRevenueUsd"] = {
                "gross": round(airbnb["gross"] / JPY_TO_USD),
                "net": round(airbnb["net"] / JPY_TO_USD),
            }

        # 推定ROI
        if airbnb and reno and p.get("price", 0) > 0:
            total_inv = p["price"] + reno["low"]
            p["estimatedRoi"] = round((airbnb["net"] / total_inv) * 1000) / 10
        elif airbnb and p.get("price", 0) == 0 and reno:
            p["estimatedRoi"] = round((airbnb["net"] / reno["low"]) * 1000) / 10

        # エリア説明
        airbnb_data = AIRBNB_DATA.get(p.get("prefectureEn", ""), DEFAULT_AIRBNB)
        p["areaDescription"] = airbnb_data["description"]

        # 備考英語化
        if p.get("remarks") and len(p["remarks"]) > 0:
            p["remarksEnglish"] = translate_remarks(p["remarks"])

        enriched += 1

    # 統計
    with_roi = [p for p in properties if p.get("estimatedRoi")]
    with_reno = [p for p in properties if p.get("estimatedRenovation")]
    with_airbnb = [p for p in properties if p.get("estimatedAirbnbRevenue")]
    avg_roi = sum(p["estimatedRoi"] for p in with_roi) / len(with_roi) if with_roi else 0

    print(f"  エンリッチ完了: {enriched}件")
    print(f"  ROI推定あり: {len(with_roi)}件")
    print(f"  リノベ費用推定あり: {len(with_reno)}件")
    print(f"  民泊収益推定あり: {len(with_airbnb)}件")
    print(f"  平均推定ROI: {avg_roi:.1f}%")
    return enriched


# ============================================================
# Main
# ============================================================

def main():
    start_time = datetime.now()
    print(f"AkiyaFinder 全物件エンリッチ処理 開始: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # データ読み込み
    properties = load_json(PROPERTIES_FILE)
    if isinstance(properties, dict):
        properties = list(properties.values())
    detail_cache = load_json(DETAIL_CACHE_FILE)
    geocode_cache = load_json(GEOCODE_CACHE_FILE)

    print(f"物件数: {len(properties)}")
    print(f"詳細キャッシュ: {len(detail_cache)}件")
    print(f"座標キャッシュ: {len(geocode_cache)}件")
    print()

    # Step 1: 詳細情報取得
    detail_enriched, detail_errors = enrich_details(properties, detail_cache)

    # 中間保存
    save_json(PROPERTIES_FILE, properties)
    print("  >>> 物件データ中間保存完了")

    # Step 2: 座標取得
    geo_matched, geo_unmatched = geocode_properties(properties, geocode_cache)

    # 中間保存
    save_json(PROPERTIES_FILE, properties)
    print("  >>> 物件データ中間保存完了")

    # Step 3: 投資指標算出
    invest_enriched = enrich_investment_data(properties)

    # 最終保存
    save_json(PROPERTIES_FILE, properties)

    # 最終統計
    elapsed = (datetime.now() - start_time).total_seconds()
    print("\n" + "=" * 60)
    print("全処理完了!")
    print("=" * 60)
    print(f"  処理時間: {elapsed/60:.1f}分")
    print(f"  Step 1 (詳細): {detail_enriched}件取得, {detail_errors}件エラー")
    print(f"  Step 2 (座標): {geo_matched}件マッチ, {geo_unmatched}件未解決")
    print(f"  Step 3 (投資): {invest_enriched}件算出")
    print(f"  保存先: {PROPERTIES_FILE}")

    # 全体統計
    with_lat = sum(1 for p in properties if p.get("lat"))
    with_usd = sum(1 for p in properties if p.get("priceUsd") is not None)
    with_roi = sum(1 for p in properties if p.get("estimatedRoi"))
    with_thumb = sum(1 for p in properties if p.get("thumbnailUrl"))
    with_access = sum(1 for p in properties if p.get("access"))
    print(f"\n  最終状態:")
    print(f"    座標あり: {with_lat}/{len(properties)}")
    print(f"    USD換算あり: {with_usd}/{len(properties)}")
    print(f"    ROI推定あり: {with_roi}/{len(properties)}")
    print(f"    画像URLあり: {with_thumb}/{len(properties)}")
    print(f"    交通情報あり: {with_access}/{len(properties)}")


if __name__ == "__main__":
    main()
