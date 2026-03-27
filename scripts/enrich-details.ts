/**
 * 物件詳細ページから追加データを取得してエンリッチ
 * - 画像URL (img.akiya-athome.jp)
 * - 交通（最寄り駅/バス停）
 * - こだわり条件
 * - 建物構造
 * - 備考
 *
 * Usage: npx tsx scripts/enrich-details.ts
 */

import * as fs from "fs";
import * as path from "path";

const DELAY_MS = 2000;
const BACKOFF_DELAYS = [10000, 30000, 90000];
const CACHE_FILE = path.join(process.cwd(), "data", "detail-cache.json");

interface EnrichedFields {
  thumbnailUrl: string;
  access: string;
  features: string;
  structure: string;
  remarks: string;
  landRights: string;
  zoning: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function loadCache(): Record<string, EnrichedFields> {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, EnrichedFields>) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function extractThTd(html: string, thName: string): string {
  const regex = new RegExp(
    `<th[^>]*>\\s*${thName}[^<]*</th>\\s*<td[^>]*>([\\s\\S]*?)</td>`,
    "i"
  );
  const match = html.match(regex);
  if (!match) return "";
  return match[1]
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchDetail(url: string, retryCount = 0): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ja,en-US;q=0.9",
      },
    });
    if (res.status === 429 || res.status === 503) {
      if (retryCount < BACKOFF_DELAYS.length) {
        console.warn(`  HTTP ${res.status} — backoff ${BACKOFF_DELAYS[retryCount] / 1000}s`);
        await sleep(BACKOFF_DELAYS[retryCount]);
        return fetchDetail(url, retryCount + 1);
      }
      return null;
    }
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function parseDetailPage(html: string): EnrichedFields {
  // 画像URL
  const imgMatch = html.match(/\/\/img\.akiya-athome\.jp[^"' >]+/);
  const thumbnailUrl = imgMatch ? `https:${imgMatch[0].replace(/&amp;/g, "&")}` : "";

  // 交通
  const access = extractThTd(html, "交通");

  // こだわり条件
  const features = extractThTd(html, "こだわり条件");

  // 建物構造
  const structure = extractThTd(html, "建物構造");

  // 備考
  const remarks = extractThTd(html, "備考");

  // 土地権利
  const landRights = extractThTd(html, "土地権利");

  // 用途地域
  const zoning = extractThTd(html, "用途地域");

  return { thumbnailUrl, access, features, structure, remarks, landRights, zoning };
}

async function main() {
  const dataPath = path.join(process.cwd(), "data", "scraped-properties.json");
  const properties = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  console.log("=== Enrich Property Details ===");
  console.log(`Properties: ${properties.length}`);

  const cache = loadCache();
  const cached = Object.keys(cache).length;
  console.log(`Cached: ${cached}`);
  console.log(`To fetch: ${properties.length - cached}`);
  console.log("");

  let enriched = 0;
  let errors = 0;

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];

    // キャッシュにあればスキップ
    if (cache[p.id]) {
      Object.assign(p, cache[p.id]);
      enriched++;
      continue;
    }

    // sourceUrlが無効ならスキップ
    if (!p.sourceUrl || !p.sourceUrl.includes("akiya-athome.jp")) {
      continue;
    }

    console.log(`[${i + 1}/${properties.length}] ${p.id}: ${p.sourceUrl}`);

    const html = await fetchDetail(p.sourceUrl);
    if (!html) {
      console.log("  ✗ Failed to fetch");
      errors++;
      await sleep(DELAY_MS);
      continue;
    }

    const details = parseDetailPage(html);
    cache[p.id] = details;
    Object.assign(p, details);
    enriched++;

    const hasImg = details.thumbnailUrl ? "✓ img" : "✗ no img";
    const hasAccess = details.access ? `✓ ${details.access.substring(0, 40)}` : "✗ no access";
    console.log(`  ${hasImg} | ${hasAccess}`);

    // 50件ごとにキャッシュ保存
    if (enriched % 50 === 0) {
      saveCache(cache);
      console.log(`  (cache saved: ${Object.keys(cache).length} entries)`);
    }

    await sleep(DELAY_MS);
  }

  // 最終保存
  saveCache(cache);
  fs.writeFileSync(dataPath, JSON.stringify(properties, null, 2));

  // 統計
  const withImage = properties.filter((p: any) => p.thumbnailUrl).length;
  const withAccess = properties.filter((p: any) => p.access).length;
  const withFeatures = properties.filter((p: any) => p.features).length;

  console.log(`\n=== Done ===`);
  console.log(`Enriched: ${enriched}`);
  console.log(`Errors: ${errors}`);
  console.log(`With image: ${withImage}`);
  console.log(`With access: ${withAccess}`);
  console.log(`With features: ${withFeatures}`);
  console.log(`Saved: ${dataPath}`);
}

main().catch(console.error);
