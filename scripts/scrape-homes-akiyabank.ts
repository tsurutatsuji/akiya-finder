/**
 * LIFULL HOME'S 空き家バンク スクレイパー (Playwright版)
 * AWS WAF Bot検知があるためブラウザ自動化で取得
 *
 * Usage: npx tsx scripts/scrape-homes-akiyabank.ts
 */

import * as fs from "fs";
import * as path from "path";
import { chromium } from "playwright";

const DELAY_MS = 3000;
const BACKOFF_DELAYS = [10000, 30000, 90000];

// 地域→都道府県のURL構造
const REGIONS: Record<string, Record<string, string>> = {
  "tohoku": {
    "hokkaido": "Hokkaido", "aomori": "Aomori", "iwate": "Iwate",
    "miyagi": "Miyagi", "akita": "Akita", "yamagata": "Yamagata", "fukushima": "Fukushima",
  },
  "kanto": {
    "ibaraki": "Ibaraki", "tochigi": "Tochigi", "gunma": "Gunma",
    "saitama": "Saitama", "chiba": "Chiba", "tokyo": "Tokyo", "kanagawa": "Kanagawa",
  },
  "hokuriku": {
    "niigata": "Niigata", "toyama": "Toyama", "ishikawa": "Ishikawa",
    "fukui": "Fukui", "yamanashi": "Yamanashi", "nagano": "Nagano",
  },
  "tokai": {
    "gifu": "Gifu", "shizuoka": "Shizuoka", "aichi": "Aichi", "mie": "Mie",
  },
  "kinki": {
    "shiga": "Shiga", "kyoto": "Kyoto", "osaka": "Osaka",
    "hyogo": "Hyogo", "nara": "Nara", "wakayama": "Wakayama",
  },
  "chugoku": {
    "tottori": "Tottori", "shimane": "Shimane", "okayama": "Okayama",
    "hiroshima": "Hiroshima", "yamaguchi": "Yamaguchi",
    "tokushima": "Tokushima", "kagawa": "Kagawa", "ehime": "Ehime", "kochi": "Kochi",
  },
  "kyushu": {
    "fukuoka": "Fukuoka", "saga": "Saga", "nagasaki": "Nagasaki",
    "kumamoto": "Kumamoto", "oita": "Oita", "miyazaki": "Miyazaki",
    "kagoshima": "Kagoshima", "okinawa": "Okinawa",
  },
};

// 需要エリアを優先順に並べる
const PRIORITY_ORDER = [
  "hokkaido", "nagano", "niigata", "kyoto", "shizuoka",
  "kanagawa", "oita", "okinawa", "yamanashi", "ishikawa",
];

interface HomesProperty {
  id: string;
  source: "homes";
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
  thumbnailUrl: string;
  scrapedAt: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function parsePrice(text: string): { price: number; formatted: string } {
  const cleaned = text.replace(/[\s,]/g, "");
  const manMatch = cleaned.match(/(\d+)万円/);
  if (manMatch) {
    const price = parseInt(manMatch[1]) * 10000;
    return { price, formatted: `¥${price.toLocaleString()}` };
  }
  const enMatch = cleaned.match(/(\d+)円/);
  if (enMatch) {
    const price = parseInt(enMatch[1]);
    return { price, formatted: `¥${price.toLocaleString()}` };
  }
  return { price: 0, formatted: text || "Contact for price" };
}

async function scrapePrefecture(
  page: any,
  region: string,
  prefSlug: string,
  prefEn: string,
  maxPages: number
): Promise<HomesProperty[]> {
  const properties: HomesProperty[] = [];
  const seenIds = new Set<string>();

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const url = pageNum === 1
      ? `https://www.homes.co.jp/akiyabank/${region}/${prefSlug}/`
      : `https://www.homes.co.jp/akiyabank/${region}/${prefSlug}?page=${pageNum}`;

    console.log(`  Page ${pageNum}: ${url}`);

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      // WAFチャレンジを待つ
      await page.waitForSelector(".bukkenTitle, .sec-resultList, .mod-result-bukkenBox", { timeout: 15000 }).catch(() => null);
      await sleep(1000);
    } catch (e) {
      console.error(`  Navigation error: ${e}`);
      break;
    }

    // 総件数を取得（1ページ目のみ）
    if (pageNum === 1) {
      const totalText = await page.$eval(".result-count, .search-result-count, .total-count", (el: any) => el.textContent).catch(() => "");
      const totalMatch = totalText.match(/(\d[\d,]*)/);
      const total = totalMatch ? parseInt(totalMatch[1].replace(/,/g, "")) : 0;
      if (total > 0) {
        const totalPages = Math.ceil(total / 30);
        maxPages = Math.min(totalPages, maxPages);
        console.log(`  Total: ${total} properties, ${totalPages} pages (scraping up to ${maxPages})`);
      }
    }

    // 物件カードを取得
    const cards = await page.$$eval(".mod-result-bukkenBox, .bukkenBox, [class*='bukken']", (els: any[]) => {
      return els.map((el: any) => {
        const titleEl = el.querySelector(".bukkenTitle, h3");
        const addressEl = el.querySelector(".address, [class*='address']");
        const categoryEl = el.querySelector(".categoryTag, [class*='category']");
        const linkEl = el.querySelector("a[href*='akiyabank/b-']");
        const imgEl = el.querySelector("img[src*='akiyabank-image']");

        // dt/dd形式のデータ
        const dtDdPairs: Record<string, string> = {};
        el.querySelectorAll("dt, th").forEach((dt: any) => {
          const dd = dt.nextElementSibling;
          if (dd) dtDdPairs[dt.textContent.trim()] = dd.textContent.trim();
        });

        return {
          address: addressEl?.textContent?.trim() || titleEl?.textContent?.trim() || "",
          category: categoryEl?.textContent?.trim() || "",
          href: linkEl?.href || "",
          img: imgEl?.src || "",
          price: dtDdPairs["価格"] || dtDdPairs["賃料"] || "",
          landArea: dtDdPairs["土地面積"] || dtDdPairs["面積"] || "",
          buildingArea: dtDdPairs["建物面積"] || "",
          yearBuilt: dtDdPairs["築年月"] || dtDdPairs["築年"] || "",
          layout: dtDdPairs["間取"] || dtDdPairs["間取り"] || "",
        };
      });
    }).catch(() => []);

    if (cards.length === 0) {
      // フォールバック: リンクだけ取得
      const links = await page.$$eval("a[href*='akiyabank/b-']", (els: any[]) =>
        [...new Set(els.map((el: any) => el.href))]
      ).catch(() => []);

      if (links.length === 0) {
        console.log(`  No properties found on page ${pageNum}, stopping.`);
        break;
      }

      // リンクのみの場合
      for (const link of links) {
        const idMatch = link.match(/b-(\d+)/);
        if (!idMatch || seenIds.has(idMatch[1])) continue;
        seenIds.add(idMatch[1]);
        properties.push({
          id: `homes-${idMatch[1]}`,
          source: "homes",
          price: 0,
          priceFormatted: "See details",
          location: `${prefEn}, Japan`,
          locationJa: prefEn,
          prefecture: prefSlug,
          prefectureEn: prefEn,
          propertyType: "Akiya (Vacant House)",
          landArea: "-",
          buildingArea: "-",
          yearBuilt: "-",
          layout: "-",
          sourceUrl: link,
          thumbnailUrl: "",
          scrapedAt: new Date().toISOString(),
        });
      }
    } else {
      for (const card of cards) {
        const idMatch = card.href.match(/b-(\d+)/);
        if (!idMatch || seenIds.has(idMatch[1])) continue;
        seenIds.add(idMatch[1]);

        const { price, formatted } = parsePrice(card.price);
        const locationJa = card.address.replace(/^[\s\S]*?(北海道|青森|岩手|宮城|秋田|山形|福島|茨城|栃木|群馬|埼玉|千葉|東京|神奈川|新潟|富山|石川|福井|山梨|長野|岐阜|静岡|愛知|三重|滋賀|京都|大阪|兵庫|奈良|和歌山|鳥取|島根|岡山|広島|山口|徳島|香川|愛媛|高知|福岡|佐賀|長崎|熊本|大分|宮崎|鹿児島|沖縄)/, "$1");

        properties.push({
          id: `homes-${idMatch[1]}`,
          source: "homes",
          price,
          priceFormatted: formatted,
          location: `${locationJa.split(/[都道府県]/)[1]?.split(/[市区町村郡]/)[0] || ""}, ${prefEn}`.replace(/^, /, ""),
          locationJa: locationJa || `${prefEn}, Japan`,
          prefecture: prefSlug,
          prefectureEn: prefEn,
          propertyType: card.category || "Akiya (Vacant House)",
          landArea: card.landArea || "-",
          buildingArea: card.buildingArea || "-",
          yearBuilt: card.yearBuilt || "-",
          layout: card.layout || "-",
          sourceUrl: card.href,
          thumbnailUrl: card.img || "",
          scrapedAt: new Date().toISOString(),
        });
      }
    }

    console.log(`  Found ${cards.length || "links only"} → total: ${properties.length}`);

    // ページネーション: 次のページがあるか
    const hasNext = await page.$(`a[href*="page=${pageNum + 1}"]`).catch(() => null);
    if (!hasNext && pageNum < maxPages) {
      console.log(`  No more pages.`);
      break;
    }

    await sleep(DELAY_MS);
  }

  return properties;
}

async function main() {
  const maxPagesPerPref = parseInt(process.argv[2] || "50");

  console.log("=== LIFULL HOME'S Akiya Bank Scraper (Playwright) ===");
  console.log(`Max pages per prefecture: ${maxPagesPerPref}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    locale: "ja-JP",
  });
  const page = await context.newPage();

  const allProperties: HomesProperty[] = [];

  // 全都道府県を地域→県の順で処理（優先県を先に）
  const prefList: { region: string; slug: string; en: string }[] = [];
  for (const [region, prefs] of Object.entries(REGIONS)) {
    for (const [slug, en] of Object.entries(prefs)) {
      prefList.push({ region, slug, en });
    }
  }

  // 優先県を先頭に
  prefList.sort((a, b) => {
    const ai = PRIORITY_ORDER.indexOf(a.slug);
    const bi = PRIORITY_ORDER.indexOf(b.slug);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return 0;
  });

  for (const { region, slug, en } of prefList) {
    console.log(`\n[${en}] (${region}/${slug})`);
    const props = await scrapePrefecture(page, region, slug, en, maxPagesPerPref);
    allProperties.push(...props);
    console.log(`  Subtotal: ${allProperties.length} properties`);
  }

  await browser.close();

  // 重複除去
  const unique = allProperties.filter(
    (p, i, arr) => arr.findIndex((q) => q.id === p.id) === i
  );

  // 保存
  const outDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "homes-properties.json");
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
