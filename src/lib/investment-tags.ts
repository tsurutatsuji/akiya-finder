/**
 * 投資家の欲求ベースで物件にタグを付与
 * 外国人投資家が空き家を買う目的に直結する6カテゴリ
 */

export interface InvestmentCategory {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const INVESTMENT_CATEGORIES: InvestmentCategory[] = [
  {
    id: "high-value",
    label: "High Value",
    emoji: "📈",
    description: "Low price per ㎡ — best bang for your buck",
  },
  {
    id: "station-close",
    label: "Station Close",
    emoji: "🚉",
    description: "Within 10 min walk to a train station",
  },
  {
    id: "airbnb-ready",
    label: "Airbnb Ready",
    emoji: "🏨",
    description: "Tourist area + spacious — ideal for vacation rental",
  },
  {
    id: "free-entry",
    label: "Free / Near-Free",
    emoji: "🆓",
    description: "¥0–¥150,000 (~$0–$1,000) — ultra-low risk entry",
  },
  {
    id: "move-in-ready",
    label: "Move-in Ready",
    emoji: "🏗️",
    description: "Under 30 years old or solid structure — low renovation cost",
  },
  {
    id: "cultural-gem",
    label: "Cultural Gem",
    emoji: "🏯",
    description: "Machiya, kominka in historic areas — premium Airbnb potential",
  },
];

// --- パーサー ---

export function parseBuildingArea(str: string): number | null {
  if (!str || str === "-") return null;
  const m = str.match(/([\d,.]+)/);
  return m ? parseFloat(m[1].replace(",", "")) : null;
}

export function parseYearBuilt(str: string): number | null {
  if (!str || str === "-" || str === "不詳") return null;
  const m = str.match(/(\d{4})/);
  return m ? parseInt(m[1]) : null;
}

/** 徒歩分数を抽出。「停歩」も「徒歩」と同等に扱う */
export function parseWalkingMinutes(access: string): number | null {
  if (!access) return null;
  // 「徒歩X分」「停歩X分」を探す
  const m = access.match(/(?:徒歩|停歩)(\d+)分/);
  return m ? parseInt(m[1]) : null;
}

export function calculatePricePerSqm(
  price: number,
  buildingArea: string
): number | null {
  const area = parseBuildingArea(buildingArea);
  if (!area || area === 0 || price === 0) return null;
  return Math.round(price / area);
}

export function calculateAge(yearBuilt: string): number | null {
  const year = parseYearBuilt(yearBuilt);
  if (!year) return null;
  return new Date().getFullYear() - year;
}

// --- 観光地キーワード ---

const TOURIST_KEYWORDS = [
  // 京都エリア
  "京都",
  "東山",
  "嵐山",
  "伏見",
  // スキーリゾート
  "白馬",
  "ニセコ",
  "倶知安",
  "富良野",
  "野沢",
  "妙高",
  "湯沢",
  "蔵王",
  // 温泉
  "別府",
  "由布院",
  "湯布院",
  "熱海",
  "箱根",
  "草津",
  "有馬",
  "伊豆",
  "下田",
  // ビーチ
  "沖縄",
  "石垣",
  "宮古島",
  "鎌倉",
  "湘南",
  // 文化
  "金沢",
  "奈良",
  "尾道",
  "高山",
  "直島",
  // 富士山エリア
  "富士吉田",
  "河口湖",
  "山中湖",
  // その他人気
  "軽井沢",
  "阿蘇",
];

// 町家・古民家キーワード
const CULTURAL_KEYWORDS = [
  "京都",
  "金沢",
  "奈良",
  "高山",
  "倉敷",
  "萩",
  "角館",
  "川越",
  "白川",
  "五箇山",
];

// --- メイン関数 ---

export interface PropertyForTagging {
  price: number;
  buildingArea: string;
  yearBuilt: string;
  locationJa: string;
  access?: string;
  structure?: string;
  propertyType?: string;
}

export function getInvestmentTags(p: PropertyForTagging): string[] {
  const tags = new Set<string>();

  const area = parseBuildingArea(p.buildingArea);
  const pricePerSqm = calculatePricePerSqm(p.price, p.buildingArea);
  const age = calculateAge(p.yearBuilt);
  const walkMin = parseWalkingMinutes(p.access || "");
  const isTourist = TOURIST_KEYWORDS.some((kw) => p.locationJa.includes(kw));
  const isCultural = CULTURAL_KEYWORDS.some((kw) => p.locationJa.includes(kw));

  // 📈 High Value — ㎡単価 ¥50,000以下（土地のみは除外）
  if (pricePerSqm !== null && pricePerSqm <= 50000 && p.price > 0) {
    tags.add("high-value");
  }

  // 🚉 Station Close — 徒歩10分以内
  if (walkMin !== null && walkMin <= 10) {
    tags.add("station-close");
  }

  // 🏨 Airbnb Ready — 観光地 × 80㎡以上
  if (isTourist && area !== null && area >= 80) {
    tags.add("airbnb-ready");
  }

  // 🆓 Free / Near-Free
  if (p.price >= 0 && p.price <= 150000) {
    tags.add("free-entry");
  }

  // 🏗️ Move-in Ready — 築30年以内 or RC/鉄骨構造
  const solidStructure =
    p.structure &&
    (p.structure.includes("RC") ||
      p.structure.includes("鉄骨") ||
      p.structure.includes("鉄筋") ||
      p.structure.includes("PC"));
  if ((age !== null && age <= 30) || solidStructure) {
    tags.add("move-in-ready");
  }

  // 🏯 Cultural Gem — 文化エリアの戸建
  if (isCultural && p.propertyType !== "売土地") {
    tags.add("cultural-gem");
  }

  return [...tags];
}

// --- 投資メトリクス（Popup表示用） ---

export interface InvestmentMetrics {
  pricePerSqm: number | null;
  pricePerSqmUsd: number | null;
  age: number | null;
  walkingMinutes: number | null;
  tags: string[];
}

export function calculateInvestmentMetrics(
  p: PropertyForTagging
): InvestmentMetrics {
  const pricePerSqm = calculatePricePerSqm(p.price, p.buildingArea);
  return {
    pricePerSqm,
    pricePerSqmUsd: pricePerSqm ? Math.round(pricePerSqm / 150) : null,
    age: calculateAge(p.yearBuilt),
    walkingMinutes: parseWalkingMinutes(p.access || ""),
    tags: getInvestmentTags(p),
  };
}
