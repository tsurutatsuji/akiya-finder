/**
 * 物件データに投資家向け情報を自動付与
 * - USD換算、㎡単価、推定リノベ費用、推定民泊収益、ROI、エリア説明
 *
 * Usage: npx tsx scripts/enrich-investment-data.ts
 */

import * as fs from "fs";
import * as path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "scraped-properties.json");
const JPY_TO_USD = 150;

// エリア別の民泊平均宿泊単価（円/泊）と推定稼働率
const AIRBNB_DATA: Record<string, { nightlyRate: number; occupancy: number; description: string }> = {
  // 人気観光地
  "Kyoto": { nightlyRate: 15000, occupancy: 0.65, description: "Cultural capital. Machiya (traditional townhouses) command premium Airbnb rates. Year-round tourism demand." },
  "Hokkaido": { nightlyRate: 12000, occupancy: 0.55, description: "World-class ski resorts (Niseko, Furano). Peak winter season Dec-Mar. Growing summer tourism." },
  "Okinawa": { nightlyRate: 10000, occupancy: 0.60, description: "Tropical beaches. Year-round warm climate. Popular with domestic and Asian tourists." },
  "Nagano": { nightlyRate: 11000, occupancy: 0.50, description: "Ski resorts (Hakuba, Nozawa) + highland retreats. Strong foreign buyer community in Hakuba." },
  "Shizuoka": { nightlyRate: 10000, occupancy: 0.45, description: "Mt. Fuji views + Izu hot springs. Popular weekend destination from Tokyo." },
  "Kanagawa": { nightlyRate: 9000, occupancy: 0.50, description: "Beach towns (Kamakura, Hayama) + hot springs (Hakone). Easy Tokyo access." },
  "Nara": { nightlyRate: 9000, occupancy: 0.45, description: "Ancient capital with UNESCO sites. Day-trip destination from Osaka/Kyoto." },
  "Ishikawa": { nightlyRate: 10000, occupancy: 0.45, description: "Kanazawa — 'Little Kyoto'. Traditional crafts, gardens, fresh seafood." },
  "Niigata": { nightlyRate: 9000, occupancy: 0.40, description: "Major ski area (Myoko, Yuzawa). Sake country. Growing international interest." },
  "Oita": { nightlyRate: 9000, occupancy: 0.50, description: "Beppu & Yufuin — Japan's top hot spring destinations. Strong tourism infrastructure." },
  "Hiroshima": { nightlyRate: 8000, occupancy: 0.45, description: "Peace Memorial + Onomichi + Setouchi islands. Art tourism growing." },
  // 首都圏
  "Tokyo": { nightlyRate: 8000, occupancy: 0.55, description: "Capital city. High demand but akiya are rare and expensive. Suburban areas have opportunities." },
  "Osaka": { nightlyRate: 9000, occupancy: 0.55, description: "Food capital. Street-level culture. Strong domestic + international tourism." },
  "Chiba": { nightlyRate: 7000, occupancy: 0.35, description: "Boso Peninsula — surfing + beach. Affordable Tokyo commute option." },
  // 地方
  "Yamanashi": { nightlyRate: 8000, occupancy: 0.40, description: "Mt. Fuji area + wine country. Kawaguchiko is popular with Chinese investors." },
  "Kumamoto": { nightlyRate: 7000, occupancy: 0.35, description: "Aso volcano + hot springs. Affordable properties with dramatic landscapes." },
  "Fukuoka": { nightlyRate: 8000, occupancy: 0.45, description: "Japan's most livable city. Growing startup scene. Excellent food." },
  "Miyagi": { nightlyRate: 7000, occupancy: 0.35, description: "Sendai — Tohoku's largest city. Zao ski resort nearby." },
  "Aichi": { nightlyRate: 7000, occupancy: 0.40, description: "Nagoya — industrial center. Toyota country. Good transport hub." },
  "Hyogo": { nightlyRate: 8000, occupancy: 0.40, description: "Kobe — international port city. Arima Onsen. Mountain + sea lifestyle." },
};

// デフォルト（上記にないエリア用）
const DEFAULT_AIRBNB = { nightlyRate: 6000, occupancy: 0.30, description: "Rural Japan. Peaceful countryside living. Very affordable entry point for property ownership." };

// 推定リノベ費用（築年数ベース）
function estimateRenovationCost(yearBuiltStr: string, buildingAreaStr: string): { low: number; high: number } | null {
  const yearMatch = yearBuiltStr?.match(/(\d{4})/);
  const areaMatch = buildingAreaStr?.match(/([\d,.]+)/);
  if (!yearMatch || !areaMatch) return null;

  const year = parseInt(yearMatch[1]);
  const area = parseFloat(areaMatch[1].replace(",", ""));
  const age = 2026 - year;

  // 築年数別の㎡あたりリノベ単価
  let costPerSqm: { low: number; high: number };
  if (age <= 10) costPerSqm = { low: 10000, high: 30000 };      // 築10年以内: 軽微
  else if (age <= 20) costPerSqm = { low: 30000, high: 60000 };  // 築20年: 中程度
  else if (age <= 40) costPerSqm = { low: 50000, high: 100000 }; // 築40年: フルリノベ
  else costPerSqm = { low: 80000, high: 150000 };                // 築40年超: 大規模

  return {
    low: Math.round(area * costPerSqm.low),
    high: Math.round(area * costPerSqm.high),
  };
}

// 推定年間民泊収益
function estimateAirbnbRevenue(prefectureEn: string, buildingAreaStr: string): { gross: number; net: number } | null {
  const areaMatch = buildingAreaStr?.match(/([\d,.]+)/);
  if (!areaMatch) return null;
  const area = parseFloat(areaMatch[1].replace(",", ""));
  if (area < 30) return null; // 30㎡未満は民泊に不向き

  const data = AIRBNB_DATA[prefectureEn] || DEFAULT_AIRBNB;
  const gross = Math.round(data.nightlyRate * 365 * data.occupancy);
  const net = Math.round(gross * 0.65); // 運営費35%

  return { gross, net };
}

function main() {
  const properties = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  console.log(`=== 投資データエンリッチ: ${properties.length}件 ===\n`);

  let enriched = 0;

  for (const p of properties) {
    // USD換算
    p.priceUsd = p.price === 0 ? 0 : Math.round(p.price / JPY_TO_USD);
    p.priceUsdFormatted = p.price === 0 ? "FREE" : `$${p.priceUsd.toLocaleString()}`;

    // ㎡単価
    const areaMatch = p.buildingArea?.match(/([\d,.]+)/);
    if (areaMatch && p.price > 0) {
      const area = parseFloat(areaMatch[1].replace(",", ""));
      if (area > 0) {
        p.pricePerSqm = Math.round(p.price / area);
        p.pricePerSqmUsd = Math.round(p.pricePerSqm / JPY_TO_USD);
      }
    }

    // 築年数
    const yearMatch = p.yearBuilt?.match(/(\d{4})/);
    if (yearMatch) {
      p.buildingAge = 2026 - parseInt(yearMatch[1]);
    }

    // 推定リノベ費用
    const reno = estimateRenovationCost(p.yearBuilt, p.buildingArea);
    if (reno) {
      p.estimatedRenovation = reno;
      p.estimatedRenovationUsd = {
        low: Math.round(reno.low / JPY_TO_USD),
        high: Math.round(reno.high / JPY_TO_USD),
      };
    }

    // 推定民泊収益
    const airbnb = estimateAirbnbRevenue(p.prefectureEn, p.buildingArea);
    if (airbnb) {
      p.estimatedAirbnbRevenue = airbnb;
      p.estimatedAirbnbRevenueUsd = {
        gross: Math.round(airbnb.gross / JPY_TO_USD),
        net: Math.round(airbnb.net / JPY_TO_USD),
      };
    }

    // 推定ROI（物件価格 + リノベ低価格に対するネット民泊収益）
    if (airbnb && reno && p.price > 0) {
      const totalInvestment = p.price + reno.low;
      p.estimatedRoi = Math.round((airbnb.net / totalInvestment) * 1000) / 10; // %
    } else if (airbnb && p.price === 0 && reno) {
      p.estimatedRoi = Math.round((airbnb.net / reno.low) * 1000) / 10;
    }

    // エリア説明（英語）
    const airbnbData = AIRBNB_DATA[p.prefectureEn] || DEFAULT_AIRBNB;
    p.areaDescription = airbnbData.description;

    // 備考の簡易英語化（キーワードベース）
    if (p.remarks && p.remarks.length > 0) {
      p.remarksEnglish = translateRemarks(p.remarks);
    }

    enriched++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(properties, null, 2));
  console.log(`エンリッチ完了: ${enriched}件`);

  // 統計
  const withRoi = properties.filter((p: any) => p.estimatedRoi).length;
  const withReno = properties.filter((p: any) => p.estimatedRenovation).length;
  const withAirbnb = properties.filter((p: any) => p.estimatedAirbnbRevenue).length;
  const avgRoi = properties.filter((p: any) => p.estimatedRoi).reduce((s: number, p: any) => s + p.estimatedRoi, 0) / withRoi;

  console.log(`\n=== 統計 ===`);
  console.log(`ROI推定あり: ${withRoi}件`);
  console.log(`リノベ費用推定あり: ${withReno}件`);
  console.log(`民泊収益推定あり: ${withAirbnb}件`);
  console.log(`平均推定ROI: ${avgRoi.toFixed(1)}%`);
}

// 備考の簡易英語訳
function translateRemarks(remarks: string): string {
  const translations: [RegExp, string][] = [
    [/価格は相談可/g, "Price negotiable"],
    [/売主の契約不適合責任は免責/g, "Sold as-is (no seller warranty)"],
    [/現状渡し/g, "Sold as-is"],
    [/リフォーム済/g, "Renovated"],
    [/駐車場あり/g, "Parking available"],
    [/駐車場/g, "Parking"],
    [/即入居可/g, "Ready for immediate move-in"],
    [/更地渡し/g, "Land will be cleared"],
    [/古家あり/g, "Old house on site"],
    [/上下水道/g, "Water & sewage connected"],
    [/都市ガス/g, "City gas available"],
    [/プロパンガス/g, "Propane gas"],
    [/南向き/g, "South-facing"],
    [/日当たり良好/g, "Good sun exposure"],
    [/角地/g, "Corner lot"],
    [/建替え/g, "Rebuild"],
    [/増改築/g, "Extension/renovation"],
    [/景観法/g, "Landscape preservation area"],
    [/宅地造成工事規制区域/g, "Regulated development zone"],
    [/傾斜地/g, "Sloped land"],
    [/接道/g, "Road access"],
    [/セットバック/g, "Setback required"],
    [/道路後退/g, "Road setback required"],
    [/再建築不可/g, "Cannot rebuild (no road access)"],
    [/市街化調整区域/g, "Urbanization control area (building restrictions)"],
    [/要リフォーム/g, "Renovation required"],
    [/雨漏り/g, "Roof leak reported"],
    [/シロアリ/g, "Termite damage reported"],
    [/倉庫/g, "Storage/warehouse included"],
    [/蔵/g, "Traditional storehouse (kura) included"],
    [/畑/g, "Farmland included"],
    [/田/g, "Rice paddy included"],
    [/山林/g, "Forest land included"],
  ];

  let result = remarks;
  for (const [pattern, replacement] of translations) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

main();
