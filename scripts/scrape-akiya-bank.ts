/**
 * アットホーム空き家バンク スクレイパー
 * 物件データ（価格・面積・所在地等の事実データ）を取得する。
 * 写真は著作権があるため元サイトへのリンクのみ。
 *
 * Usage: npx tsx scripts/scrape-akiya-bank.ts
 */

import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://www.akiya-athome.jp";
const DELAY_MS = 2000;

const PREFECTURES: Record<string, string> = {
  "01": "Hokkaido", "02": "Aomori", "03": "Iwate", "04": "Miyagi",
  "05": "Akita", "06": "Yamagata", "07": "Fukushima", "08": "Ibaraki",
  "09": "Tochigi", "10": "Gunma", "11": "Saitama", "12": "Chiba",
  "13": "Tokyo", "14": "Kanagawa", "15": "Niigata", "16": "Toyama",
  "17": "Ishikawa", "18": "Fukui", "19": "Yamanashi", "20": "Nagano",
  "21": "Gifu", "22": "Shizuoka", "23": "Aichi", "24": "Mie",
  "25": "Shiga", "26": "Kyoto", "27": "Osaka", "28": "Hyogo",
  "29": "Nara", "30": "Wakayama", "31": "Tottori", "32": "Shimane",
  "33": "Okayama", "34": "Hiroshima", "35": "Yamaguchi", "36": "Tokushima",
  "37": "Kagawa", "38": "Ehime", "39": "Kochi", "40": "Fukuoka",
  "41": "Saga", "42": "Nagasaki", "43": "Kumamoto", "44": "Oita",
  "45": "Miyazaki", "46": "Kagoshima", "47": "Okinawa",
};

// 外国人に人気のエリアを優先
const PRIORITY_PREFS = ["26", "20", "01", "22", "12", "14", "34", "15", "44", "38", "31", "33", "05", "40"];

export interface ScrapedProperty {
  id: string;
  price: number;
  priceFormatted: string;
  location: string;
  locationJa: string;
  prefecture: string;
  prefectureEn: string;
  propertyType: string;
  landArea: string;
  buildingArea: string;
  yearBuilt: string;
  layout: string;
  sourceUrl: string;
  scrapedAt: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "ja,en;q=0.9",
        "Referer": BASE_URL,
      },
    });
    if (!res.ok) {
      console.error(`  HTTP ${res.status} for ${url}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.error(`  Fetch error: ${e}`);
    return null;
  }
}

function extractDtDd(html: string, dt: string): string {
  // <dt>価格</dt><dd>800万円</dd> のパターンから値を抽出
  const regex = new RegExp(`<dt[^>]*>${dt}</dt>\\s*<dd[^>]*>(.*?)</dd>`, "s");
  const match = html.match(regex);
  return match ? match[1].replace(/<[^>]+>/g, "").trim() : "";
}

function parsePrice(priceStr: string): number {
  // "800万円" → 8000000, "1,500万円" → 15000000
  const match = priceStr.replace(/,/g, "").match(/(\d+)万/);
  return match ? parseInt(match[1]) * 10000 : 0;
}

function extractProperties(html: string, prefCode: string): ScrapedProperty[] {
  const properties: ScrapedProperty[] = [];

  // <section class="propety"> で各物件カードを分割
  const cards = html.split('<section class="propety">').slice(1);

  for (const card of cards) {
    // 物件ID抽出
    const idMatch = card.match(/bukken\/detail\/buy\/(\d+)/);
    if (!idMatch) continue;
    const id = idMatch[1];

    if (properties.some((p) => p.id === `athome-${id}`)) continue;

    // カテゴリ（売戸建、中古等）
    const catMatch = card.match(/objectCategory[^>]*>([^<]+)/);
    const propertyType = catMatch ? catMatch[1].trim() : "";

    // 自治体名
    const govMatch = card.match(/governmentName[^>]*>([^<]+)/);
    const govName = govMatch ? govMatch[1].trim() : "";

    // dt/ddパターンでデータ抽出
    const priceStr = extractDtDd(card, "価格");
    const locationJa = extractDtDd(card, "所在地") || govName;
    const landArea = extractDtDd(card, "土地面積");
    const buildingArea = extractDtDd(card, "建物面積");
    const yearBuilt = extractDtDd(card, "築年月");
    const layout = extractDtDd(card, "間取");

    // 価格: <span>800</span>万円 パターンにも対応
    let price = parsePrice(priceStr);
    if (price === 0) {
      const spanPrice = card.match(/<dl class="price">[\s\S]*?<span>(\d[\d,]*)<\/span>万円/);
      if (spanPrice) price = parseInt(spanPrice[1].replace(/,/g, "")) * 10000;
    }

    const priceDisplay = price > 0 ? `¥${price.toLocaleString()}` : priceStr || "Contact for price";

    // ソースURL（サブドメイン付き）
    const urlMatch = card.match(/href="(https?:\/\/[^"]*bukken\/detail\/buy\/\d+)"/);
    const sourceUrl = urlMatch ? urlMatch[1] : `${BASE_URL}/buy/detail/${id}/`;

    properties.push({
      id: `athome-${id}`,
      price,
      priceFormatted: priceDisplay,
      location: govName ? `${govName}, ${PREFECTURES[prefCode]}` : `${PREFECTURES[prefCode]}, Japan`,
      locationJa: locationJa || govName,
      prefecture: prefCode,
      prefectureEn: PREFECTURES[prefCode] || "Unknown",
      propertyType: propertyType || "Akiya (Vacant House)",
      landArea: landArea || "-",
      buildingArea: buildingArea || "-",
      yearBuilt: yearBuilt || "-",
      layout: layout || "-",
      sourceUrl,
      scrapedAt: new Date().toISOString(),
    });
  }

  return properties;
}

function countTotalPages(html: string): number {
  // ページネーションから総ページ数を抽出
  const match = html.match(/page=(\d+)[^>]*>\s*(?:最後|>&gt;)/);
  if (match) return parseInt(match[1]);
  // 別パターン: 数字のリンクから最大値を取得
  const pageNums = [...html.matchAll(/page=(\d+)/g)].map((m) => parseInt(m[1]));
  return pageNums.length > 0 ? Math.max(...pageNums) : 1;
}

async function scrapePrefecture(prefCode: string, maxPages: number = 5): Promise<ScrapedProperty[]> {
  const all: ScrapedProperty[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE_URL}/buy/${prefCode}/?page=${page}`;
    console.log(`  Page ${page}: ${url}`);

    const html = await fetchPage(url);
    if (!html) break;

    if (page === 1) {
      const totalPages = countTotalPages(html);
      maxPages = Math.min(totalPages, maxPages);
      console.log(`  Total pages: ${totalPages} (scraping up to ${maxPages})`);
    }

    const props = extractProperties(html, prefCode);
    if (props.length === 0) break;

    all.push(...props);
    console.log(`  Found ${props.length} properties (total: ${all.length})`);

    await sleep(DELAY_MS);
  }

  return all;
}

async function main() {
  const maxPagesPerPref = parseInt(process.argv[2] || "20");

  // 全47都道府県をスクレイプ（優先県を先に）
  const allPrefCodes = Object.keys(PREFECTURES);
  const remaining = allPrefCodes.filter((c) => !PRIORITY_PREFS.includes(c));
  const orderedPrefs = [...PRIORITY_PREFS, ...remaining];

  console.log("=== AkiyaFinder Scraper ===");
  console.log(`Prefectures: ${orderedPrefs.length} (ALL)`);
  console.log(`Max pages per prefecture: ${maxPagesPerPref}`);
  console.log("");

  const allProperties: ScrapedProperty[] = [];

  for (const prefCode of orderedPrefs) {
    console.log(`\n[${PREFECTURES[prefCode]}] (${prefCode})`);
    const properties = await scrapePrefecture(prefCode, maxPagesPerPref);
    allProperties.push(...properties);
  }

  // 重複除去
  const unique = allProperties.filter(
    (p, i, arr) => arr.findIndex((q) => q.id === p.id) === i
  );

  // 保存
  const outDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "scraped-properties.json");
  fs.writeFileSync(outPath, JSON.stringify(unique, null, 2));

  console.log(`\n=== Done ===`);
  console.log(`Total: ${unique.length} unique properties`);
  console.log(`Saved: ${outPath}`);

  // 統計
  const byPref: Record<string, number> = {};
  for (const p of unique) {
    byPref[p.prefectureEn] = (byPref[p.prefectureEn] || 0) + 1;
  }
  console.log("\nBy prefecture:");
  for (const [pref, count] of Object.entries(byPref).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${pref}: ${count}`);
  }
}

main().catch(console.error);
