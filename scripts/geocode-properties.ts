/**
 * Nominatim（OpenStreetMap）を使って物件の住所→座標を取得
 * 市区町村単位でキャッシュして重複リクエストを最小化
 * Rate limit: 1 req/sec（Nominatim利用規約準拠）
 */

import * as fs from "fs";
import * as path from "path";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const DELAY_MS = 1100; // 1.1秒（Nominatim利用規約: 1req/sec）

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

// 住所から市区町村レベルを抽出（例: "京都府京都市東山区清閑寺山ノ内町" → "京都府京都市東山区"）
function extractMunicipality(addr: string): string {
  // 都道府県 + 市区町村（市・区・町・村まで）
  const match = addr.match(/^(.+?[都道府県])(.+?[市区町村郡])/);
  if (match) return match[1] + match[2];
  // fallback: 最初の市区町村まで
  const match2 = addr.match(/^(.+?[市区町村])/);
  if (match2) return match2[1];
  return addr;
}

async function geocode(query: string): Promise<[number, number] | null> {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=jp`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "AkiyaFinder/1.0 (akiya property geocoding)",
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

async function main() {
  const dataPath = path.join(process.cwd(), "data", "scraped-properties.json");
  const cachePath = path.join(process.cwd(), "data", "geocode-cache.json");

  const properties: Property[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // キャッシュ読み込み
  let cache: Record<string, [number, number]> = {};
  if (fs.existsSync(cachePath)) {
    cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
  }

  // 市区町村ごとにグループ化
  const municipalityMap: Record<string, string[]> = {};
  for (const p of properties) {
    const muni = extractMunicipality(p.locationJa);
    if (!municipalityMap[muni]) municipalityMap[muni] = [];
    municipalityMap[muni].push(p.id);
  }

  const totalMunicipalities = Object.keys(municipalityMap).length;
  const uncached = Object.keys(municipalityMap).filter((m) => !cache[m]);
  console.log(`=== Geocoding ===`);
  console.log(`Properties: ${properties.length}`);
  console.log(`Municipalities: ${totalMunicipalities}`);
  console.log(`Already cached: ${totalMunicipalities - uncached.length}`);
  console.log(`Need to geocode: ${uncached.length}`);
  console.log(`Estimated time: ~${Math.ceil(uncached.length * 1.1 / 60)} minutes\n`);

  let done = 0;
  for (const muni of uncached) {
    done++;
    const coord = await geocode(muni);
    if (coord) {
      cache[muni] = coord;
      console.log(`[${done}/${uncached.length}] ✓ ${muni} → ${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}`);
    } else {
      // fallback: 都道府県名で再試行
      const prefMatch = muni.match(/^(.+?[都道府県])/);
      if (prefMatch) {
        const prefCoord = await geocode(prefMatch[1]);
        if (prefCoord) {
          cache[muni] = prefCoord;
          console.log(`[${done}/${uncached.length}] △ ${muni} → fallback to prefecture: ${prefCoord[0].toFixed(4)}, ${prefCoord[1].toFixed(4)}`);
        } else {
          console.log(`[${done}/${uncached.length}] ✗ ${muni} → not found`);
        }
        await sleep(DELAY_MS);
      } else {
        console.log(`[${done}/${uncached.length}] ✗ ${muni} → not found`);
      }
    }
    // キャッシュ随時保存
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
    await sleep(DELAY_MS);
  }

  // 座標を物件データに適用
  let matched = 0;
  let unmatched = 0;
  for (const p of properties) {
    const muni = extractMunicipality(p.locationJa);
    const coord = cache[muni];
    if (coord) {
      // 同じ市区町村内で少しずらす（重ならないように）
      const idx = municipalityMap[muni].indexOf(p.id);
      const angle = (idx * 137.508) * (Math.PI / 180);
      const radius = 0.005 + Math.sqrt(idx) * 0.003; // ~500m〜2kmの散らばり
      p.lat = coord[0] + radius * Math.cos(angle);
      p.lng = coord[1] + radius * Math.sin(angle);
      matched++;
    } else {
      unmatched++;
    }
  }

  // 保存
  fs.writeFileSync(dataPath, JSON.stringify(properties, null, 2));
  console.log(`\n=== Done ===`);
  console.log(`Matched: ${matched}`);
  console.log(`Unmatched: ${unmatched}`);
  console.log(`Cache entries: ${Object.keys(cache).length}`);
}

main().catch(console.error);
