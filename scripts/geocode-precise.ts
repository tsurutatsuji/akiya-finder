/**
 * 高精度ジオコーディング
 * 物件ごとに完全住所→座標変換（Nominatim）
 * 1. まず完全住所で検索
 * 2. 失敗したら市区町村+町名で再試行
 * 3. それでも失敗なら市区町村で再試行
 * 住所単位でキャッシュ
 */

import * as fs from "fs";
import * as path from "path";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const DELAY_MS = 1100;

interface Property {
  id: string;
  locationJa: string;
  prefectureEn: string;
  lat?: number;
  lng?: number;
  [key: string]: any;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocode(query: string): Promise<[number, number] | null> {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=jp`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "AkiyaFinder/1.0 (akiya-finder geocoding for property listings)",
        "Accept-Language": "ja,en",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch {
    return null;
  }
}

// 住所を段階的に短くする（精度を落としながらフォールバック）
function addressVariants(addr: string): string[] {
  const variants: string[] = [addr];

  // 番地以降を削除（数字-数字パターン）
  const noNumber = addr.replace(/\d[\d\-]*$/, "").trim();
  if (noNumber !== addr) variants.push(noNumber);

  // 町名まで（大字・字を含む最後の区切りまで）
  const toTown = addr.match(/^(.+?[都道府県].+?[市区町村郡].+?[町村丁目区])/);
  if (toTown && !variants.includes(toTown[1])) variants.push(toTown[1]);

  // 市区町村まで
  const toCity = addr.match(/^(.+?[都道府県])(.+?[市区町村郡])/);
  if (toCity) {
    const city = toCity[1] + toCity[2];
    if (!variants.includes(city)) variants.push(city);
  }

  // 都道府県まで
  const toPref = addr.match(/^(.+?[都道府県])/);
  if (toPref && !variants.includes(toPref[1])) variants.push(toPref[1]);

  return variants;
}

async function main() {
  const dataPath = path.join(process.cwd(), "data", "scraped-properties.json");
  const cachePath = path.join(process.cwd(), "data", "geocode-cache-precise.json");

  const properties: Property[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // キャッシュ読み込み
  let cache: Record<string, [number, number] | null> = {};
  if (fs.existsSync(cachePath)) {
    cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
  }

  // ユニークな住所を収集
  const uniqueAddresses = [...new Set(properties.map((p) => p.locationJa))];
  const uncached = uniqueAddresses.filter((a) => !(a in cache));

  console.log(`=== Precise Geocoding ===`);
  console.log(`Properties: ${properties.length}`);
  console.log(`Unique addresses: ${uniqueAddresses.length}`);
  console.log(`Already cached: ${uniqueAddresses.length - uncached.length}`);
  console.log(`Need to geocode: ${uncached.length}`);
  console.log(`Estimated time: ~${Math.ceil(uncached.length * 2 * 1.1 / 60)} minutes\n`);

  let done = 0;
  let success = 0;
  let fallbacks = 0;

  for (const addr of uncached) {
    done++;
    const variants = addressVariants(addr);
    let found = false;

    for (let i = 0; i < variants.length; i++) {
      const coord = await geocode(variants[i]);
      await sleep(DELAY_MS);

      if (coord) {
        cache[addr] = coord;
        if (i === 0) {
          console.log(`[${done}/${uncached.length}] ✓ ${addr.substring(0, 30)} → ${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`);
        } else {
          console.log(`[${done}/${uncached.length}] △ ${addr.substring(0, 30)} → fallback(${i}): ${variants[i].substring(0, 20)} → ${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`);
          fallbacks++;
        }
        success++;
        found = true;
        break;
      }
    }

    if (!found) {
      cache[addr] = null;
      console.log(`[${done}/${uncached.length}] ✗ ${addr.substring(0, 30)} → not found`);
    }

    // キャッシュ随時保存
    if (done % 10 === 0) {
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
    }
  }

  // 最終キャッシュ保存
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));

  // 座標を物件データに適用
  // 同じ座標の物件は微小にずらす（100〜300m）
  const coordCount: Record<string, number> = {};
  let matched = 0;
  let unmatched = 0;

  for (const p of properties) {
    const coord = cache[p.locationJa];
    if (coord) {
      const key = `${coord[0].toFixed(4)},${coord[1].toFixed(4)}`;
      const idx = coordCount[key] || 0;
      coordCount[key] = idx + 1;

      if (idx === 0) {
        p.lat = coord[0];
        p.lng = coord[1];
      } else {
        // 同一座標の物件を少しずらす（100〜300m）
        const angle = (idx * 137.508) * (Math.PI / 180);
        const radius = 0.001 + idx * 0.0005; // ~100〜150m
        p.lat = coord[0] + radius * Math.cos(angle);
        p.lng = coord[1] + radius * Math.sin(angle);
      }
      matched++;
    } else {
      unmatched++;
    }
  }

  // 保存
  fs.writeFileSync(dataPath, JSON.stringify(properties, null, 2));

  console.log(`\n=== Done ===`);
  console.log(`Success: ${success} (fallbacks: ${fallbacks})`);
  console.log(`Matched: ${matched}`);
  console.log(`Unmatched: ${unmatched}`);
  console.log(`Cache entries: ${Object.keys(cache).length}`);
}

main().catch(console.error);
