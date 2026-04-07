/**
 * scraped-properties.json を読み込み、SEOページ用のデータを提供するユーティリティ
 */
import rawData from "../../data/scraped-properties.json";
import { getInvestmentTags, INVESTMENT_CATEGORIES } from "./investment-tags";

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
  lat: number;
  lng: number;
  thumbnailUrl?: string;
  access?: string;
  features?: string;
  structure?: string;
  remarks?: string;
  landRights?: string;
  zoning?: string;
  priceUsd: number;
  priceUsdFormatted?: string;
  pricePerSqm?: number;
  pricePerSqmUsd?: number;
  buildingAge?: number;
  estimatedRoi?: number;
  areaDescription?: string;
  remarksEnglish?: string;
  allImages?: string[];
  imageCaptions?: string[];
  carouselPhotoCount?: number;
  municipalityUrl?: string;
  propertyTypeZh?: string;
  prefectureZh?: string;
  prefectureJa?: string;
  locationZh?: string;
  floors?: string;
  currentStatus?: string;
  buildingCoverageRatio?: string;
  floorAreaRatio?: string;
  landCategory?: string;
  cityPlanning?: string;
  delivery?: string;
  publishDate?: string;
  kodawari?: string;
}

// === 掲載許可管理 ===
// 自治体から掲載許可を得たところだけ公開一覧に表示する。
// 許可がない物件は「限定公開」（URL直接アクセスのみ、noindex）。

// 掲載許可済み自治体（許可を得たら都道府県ENを追加）
// 例: 'Okayama' を追加すると岡山県の物件が公開一覧に表示される
const APPROVED_PREFECTURES: string[] = [
  // まだ許可を得た自治体はない
];

// 掲載完全停止（削除要請があった自治体）
const BLOCKED_MUNICIPALITIES: string[] = [
  '笠岡市',   // 2026-04-06 所有者了承なし・価格誤りの指摘 → 完全非公開
  'えびの市',  // 2026-04-06 無断掲載禁止・価格誤りの指摘 → 完全非公開
];

// 全物件をロード
const allProperties: ScrapedProperty[] = rawData as ScrapedProperty[];

// ブロック済み自治体を除外した全物件（限定公開 = URL直接アクセスのみ）
export const unlistedProperties: ScrapedProperty[] = allProperties.filter(
  (p) => !BLOCKED_MUNICIPALITIES.some(m => p.locationJa?.includes(m) || p.location?.includes(m))
);

// 公開物件（許可済み自治体のみ。一覧・検索・地図に表示）
export const scrapedProperties: ScrapedProperty[] = unlistedProperties.filter(
  (p) => APPROVED_PREFECTURES.length === 0
    ? false  // 許可リストが空 = 全て非公開
    : APPROVED_PREFECTURES.includes(p.prefectureEn)
);

// 物件IDで検索（限定公開含む。詳細ページ用）
export function getPropertyById(id: string): ScrapedProperty | undefined {
  return unlistedProperties.find((p) => p.id === id);
}

// 物件が公開一覧に含まれるか（noindex判定用）
export function isPropertyPublic(id: string): boolean {
  return scrapedProperties.some((p) => p.id === id);
}

// プレビューキー
export const PREVIEW_KEY = "akiya2026";

// --- プレビュー用（unlisted版）---

export function getAllPrefectureSlugsAll(): string[] {
  const set = new Set<string>();
  for (const p of unlistedProperties) {
    if (p.prefectureEn) set.add(p.prefectureEn.toLowerCase());
  }
  return [...set].sort();
}

export function getPropertiesForPrefectureAll(slug: string): ScrapedProperty[] {
  return unlistedProperties.filter(
    (p) => p.prefectureEn?.toLowerCase() === slug.toLowerCase()
  );
}

export function getPrefectureDisplayNameAll(slug: string): string | null {
  const prop = unlistedProperties.find(
    (p) => p.prefectureEn?.toLowerCase() === slug.toLowerCase()
  );
  return prop?.prefectureEn || null;
}

/**
 * 都道府県別にグループ化
 */
export function getPropertiesByPrefecture(): Record<string, ScrapedProperty[]> {
  const grouped: Record<string, ScrapedProperty[]> = {};
  for (const p of scrapedProperties) {
    const key = p.prefectureEn;
    if (!key) continue;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  }
  return grouped;
}

/**
 * ユニークな都道府県スラッグ一覧
 */
export function getAllPrefectureSlugs(): string[] {
  const set = new Set<string>();
  for (const p of scrapedProperties) {
    if (p.prefectureEn) set.add(p.prefectureEn.toLowerCase());
  }
  return [...set].sort();
}

/**
 * スラッグから都道府県の物件一覧を取得
 */
export function getPropertiesForPrefecture(slug: string): ScrapedProperty[] {
  return scrapedProperties.filter(
    (p) => p.prefectureEn?.toLowerCase() === slug.toLowerCase()
  );
}

/**
 * スラッグから都道府県の英語名（先頭大文字）を取得
 */
export function getPrefectureDisplayName(slug: string): string | null {
  const prop = scrapedProperties.find(
    (p) => p.prefectureEn?.toLowerCase() === slug.toLowerCase()
  );
  return prop?.prefectureEn || null;
}

// --- 価格帯フィルタリング ---

export interface PriceRange {
  slug: string;
  label: string;
  labelShort: string;
  min: number;
  max: number; // Infinity for no upper bound
  descriptionTemplate: string;
}

export const PRICE_RANGES: PriceRange[] = [
  {
    slug: "free",
    label: "Free Akiya Houses (¥0)",
    labelShort: "Free (¥0)",
    min: 0,
    max: 0,
    descriptionTemplate:
      "Discover {count} completely free abandoned houses (akiya) in Japan. These properties are offered at ¥0 through municipal akiya bank programs.",
  },
  {
    slug: "under-100k",
    label: "Under ¥100,000 (~$670)",
    labelShort: "Under ¥100K",
    min: 1,
    max: 100000,
    descriptionTemplate:
      "Find {count} ultra-cheap akiya houses in Japan under ¥100,000 (~$670 USD). Incredible entry-level investment properties.",
  },
  {
    slug: "under-500k",
    label: "Under ¥500,000 (~$3,300)",
    labelShort: "Under ¥500K",
    min: 1,
    max: 500000,
    descriptionTemplate:
      "Browse {count} affordable akiya houses in Japan under ¥500,000 (~$3,300 USD). Great value properties for renovation projects.",
  },
  {
    slug: "under-1m",
    label: "Under ¥1,000,000 (~$6,700)",
    labelShort: "Under ¥1M",
    min: 1,
    max: 1000000,
    descriptionTemplate:
      "Explore {count} cheap akiya houses in Japan under ¥1,000,000 (~$6,700 USD). Affordable properties with high investment potential.",
  },
  {
    slug: "under-5m",
    label: "Under ¥5,000,000 (~$33,000)",
    labelShort: "Under ¥5M",
    min: 1,
    max: 5000000,
    descriptionTemplate:
      "Find {count} akiya houses in Japan under ¥5,000,000 (~$33,000 USD). Mid-range properties with excellent value.",
  },
  {
    slug: "under-10m",
    label: "Under ¥10,000,000 (~$67,000)",
    labelShort: "Under ¥10M",
    min: 1,
    max: 10000000,
    descriptionTemplate:
      "Browse {count} akiya properties in Japan under ¥10,000,000 (~$67,000 USD). Quality houses at a fraction of Western prices.",
  },
];

export function getPropertiesForPriceRange(slug: string): ScrapedProperty[] {
  const range = PRICE_RANGES.find((r) => r.slug === slug);
  if (!range) return [];

  if (range.slug === "free") {
    return scrapedProperties.filter((p) => p.price === 0);
  }

  return scrapedProperties.filter(
    (p) => p.price >= range.min && p.price <= range.max
  );
}

// --- 投資タグフィルタリング ---

export interface InvestmentTagInfo {
  slug: string;
  tagId: string;
  label: string;
  emoji: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

export const INVESTMENT_TAG_PAGES: InvestmentTagInfo[] = [
  {
    slug: "high-value",
    tagId: "high-value",
    label: "High Value",
    emoji: "📈",
    description: "Low price per sqm - best bang for your buck",
    seoTitle: "High Value Akiya Houses in Japan | Best Price per sqm",
    seoDescription:
      "Find akiya houses with the lowest price per square meter in Japan. Investment-grade properties offering maximum value.",
  },
  {
    slug: "station-close",
    tagId: "station-close",
    label: "Station Close",
    emoji: "🚉",
    description: "Within 10 minute walk to a train station",
    seoTitle: "Akiya Houses Near Train Stations in Japan",
    seoDescription:
      "Browse akiya houses within 10 minutes walk of a train station. Convenient locations with excellent rental potential.",
  },
  {
    slug: "airbnb-ready",
    tagId: "airbnb-ready",
    label: "Airbnb Ready",
    emoji: "🏨",
    description: "Tourist area + spacious - ideal for vacation rental",
    seoTitle: "Airbnb-Ready Akiya Houses in Japan | Vacation Rental Properties",
    seoDescription:
      "Discover spacious akiya houses in tourist areas, ideal for Airbnb and vacation rental business in Japan.",
  },
  {
    slug: "free-near-free",
    tagId: "free-entry",
    label: "Free / Near-Free",
    emoji: "🆓",
    description: "¥0 to ¥150,000 (~$0-$1,000) - ultra-low risk entry",
    seoTitle: "Free & Near-Free Akiya Houses in Japan | From ¥0",
    seoDescription:
      "Find free and near-free akiya houses in Japan. Properties from ¥0 to ¥150,000 for ultra-low risk real estate investment.",
  },
  {
    slug: "move-in-ready",
    tagId: "move-in-ready",
    label: "Move-in Ready",
    emoji: "🏗️",
    description: "Under 30 years old or solid structure - low renovation cost",
    seoTitle:
      "Move-in Ready Akiya Houses in Japan | Low Renovation Cost Properties",
    seoDescription:
      "Browse move-in ready akiya houses with solid structures and low renovation costs. Under 30 years old or RC/steel frame construction.",
  },
  {
    slug: "cultural-gem",
    tagId: "cultural-gem",
    label: "Cultural Gem",
    emoji: "🏯",
    description: "Machiya, kominka in historic areas - premium Airbnb potential",
    seoTitle: "Cultural Gem Akiya | Machiya & Kominka in Japan",
    seoDescription:
      "Discover traditional machiya townhouses and kominka farmhouses in Japan's historic areas. Premium Airbnb and cultural tourism potential.",
  },
];

export function getPropertiesForTag(slug: string): ScrapedProperty[] {
  const tagInfo = INVESTMENT_TAG_PAGES.find((t) => t.slug === slug);
  if (!tagInfo) return [];

  return scrapedProperties.filter((p) => {
    const tags = getInvestmentTags({
      price: p.price,
      buildingArea: p.buildingArea,
      yearBuilt: p.yearBuilt,
      locationJa: p.locationJa,
      access: p.access,
      structure: p.structure,
      propertyType: p.propertyType,
    });
    return tags.includes(tagInfo.tagId);
  });
}

// --- ヘルパー ---

export function getMinPrice(properties: ScrapedProperty[]): number {
  if (properties.length === 0) return 0;
  return Math.min(...properties.map((p) => p.price));
}

export function getMinPriceUsd(properties: ScrapedProperty[]): number {
  if (properties.length === 0) return 0;
  const minPriceProperty = properties.reduce((min, p) =>
    p.price < min.price ? p : min
  );
  return minPriceProperty.priceUsd || Math.round(minPriceProperty.price / 150);
}

export function formatPriceYen(price: number): string {
  if (price < 0) return "要相談";
  if (price === 0) return "¥0 (FREE)";
  if (price >= 10000000) return `¥${(price / 10000000).toFixed(1)}M`;
  if (price >= 1000000) return `¥${(price / 1000000).toFixed(1)}M`;
  return `¥${price.toLocaleString()}`;
}

export function formatPriceUsd(price: number): string {
  if (price < 0) return "Contact";
  if (price === 0) return "$0";
  return `$${price.toLocaleString()}`;
}

// 価格が「要相談」かどうか
export function isPriceNegotiable(price: number): boolean {
  return price < 0;
}
