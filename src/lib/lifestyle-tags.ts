/**
 * 物件の住所・都道府県から「欲求ベース」のライフスタイルタグを自動付与
 * 外国人が akiya を買う目的に合わせたカテゴリ
 */

export interface LifestyleCategory {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const LIFESTYLE_CATEGORIES: LifestyleCategory[] = [
  { id: "ski", label: "Ski & Snow", emoji: "🎿", description: "Near world-class ski resorts" },
  { id: "cultural", label: "Traditional & Cultural", emoji: "🏯", description: "Historic towns, machiya, samurai districts" },
  { id: "beach", label: "Beach & Island", emoji: "🏖️", description: "Coastal living, tropical vibes" },
  { id: "onsen", label: "Onsen & Hot Spring", emoji: "♨️", description: "Famous hot spring towns" },
  { id: "mountain", label: "Mountain & Nature", emoji: "🗻", description: "Mt. Fuji views, highlands, forests" },
  { id: "bargain", label: "Under $1,000", emoji: "💰", description: "Dream homes at unbelievable prices" },
];

// 地域 → タグのマッピング（住所のキーワードで判定）
const TAG_RULES: { keywords: string[]; tags: string[] }[] = [
  // スキー・雪
  { keywords: ["白馬", "Hakuba"], tags: ["ski"] },
  { keywords: ["野沢", "Nozawa"], tags: ["ski", "onsen"] },
  { keywords: ["妙高", "Myoko"], tags: ["ski", "onsen"] },
  { keywords: ["湯沢", "Yuzawa"], tags: ["ski", "onsen"] },
  { keywords: ["ニセコ", "Niseko", "倶知安", "Kutchan"], tags: ["ski"] },
  { keywords: ["富良野", "Furano"], tags: ["ski", "mountain"] },
  { keywords: ["蔵王", "Zao"], tags: ["ski", "onsen"] },

  // 文化・伝統
  { keywords: ["京都", "Kyoto"], tags: ["cultural"] },
  { keywords: ["金沢", "Kanazawa"], tags: ["cultural"] },
  { keywords: ["尾道", "Onomichi"], tags: ["cultural"] },
  { keywords: ["高山", "Takayama"], tags: ["cultural"] },
  { keywords: ["奈良", "Nara"], tags: ["cultural"] },
  { keywords: ["鎌倉", "Kamakura"], tags: ["cultural", "beach"] },

  // ビーチ・島
  { keywords: ["沖縄", "Okinawa"], tags: ["beach"] },
  { keywords: ["石垣", "Ishigaki"], tags: ["beach"] },
  { keywords: ["宮古島", "Miyakojima"], tags: ["beach"] },
  { keywords: ["壱岐", "Iki"], tags: ["beach"] },
  { keywords: ["対馬", "Tsushima"], tags: ["beach"] },
  { keywords: ["佐渡", "Sado"], tags: ["beach"] },
  { keywords: ["直島", "Naoshima"], tags: ["beach", "cultural"] },
  { keywords: ["湘南", "Shonan", "葉山", "Hayama", "三浦", "Miura"], tags: ["beach"] },
  { keywords: ["下田", "Shimoda"], tags: ["beach", "onsen"] },

  // 温泉
  { keywords: ["別府", "Beppu"], tags: ["onsen"] },
  { keywords: ["由布院", "湯布院", "Yufuin"], tags: ["onsen"] },
  { keywords: ["熱海", "Atami"], tags: ["onsen", "beach"] },
  { keywords: ["箱根", "Hakone"], tags: ["onsen", "mountain"] },
  { keywords: ["草津", "Kusatsu"], tags: ["onsen"] },
  { keywords: ["有馬", "Arima"], tags: ["onsen"] },
  { keywords: ["鳥羽", "Toba"], tags: ["onsen", "beach"] },
  { keywords: ["伊豆", "Izu"], tags: ["onsen", "beach"] },

  // 山・自然
  { keywords: ["富士吉田", "Fujiyoshida"], tags: ["mountain"] },
  { keywords: ["山梨", "Yamanashi"], tags: ["mountain"] },
  { keywords: ["軽井沢", "Karuizawa"], tags: ["mountain"] },
  { keywords: ["阿蘇", "Aso"], tags: ["mountain"] },
  { keywords: ["八ヶ岳", "Yatsugatake"], tags: ["mountain"] },
];

// 都道府県レベルのデフォルトタグ
const PREF_TAGS: Record<string, string[]> = {
  Hokkaido: ["ski", "mountain"],
  Nagano: ["ski", "mountain"],
  Niigata: ["ski"],
  Kyoto: ["cultural"],
  Okinawa: ["beach"],
  Shizuoka: ["onsen", "mountain"],
  Kanagawa: ["beach"],
  Oita: ["onsen"],
  Ishikawa: ["cultural"],
  Yamanashi: ["mountain"],
  Nara: ["cultural"],
  Kumamoto: ["mountain"],
};

export function getLifestyleTags(locationJa: string, prefectureEn: string, price: number): string[] {
  const tags = new Set<string>();

  // キーワードマッチ（最も精度が高い）
  for (const rule of TAG_RULES) {
    if (rule.keywords.some((kw) => locationJa.includes(kw))) {
      rule.tags.forEach((t) => tags.add(t));
    }
  }

  // キーワードマッチがなければ都道府県デフォルト
  if (tags.size === 0 && PREF_TAGS[prefectureEn]) {
    PREF_TAGS[prefectureEn].forEach((t) => tags.add(t));
  }

  // 価格ベースのタグ
  if (price > 0 && price <= 150000) {
    // ¥150,000 ≒ ~$1,000
    tags.add("bargain");
  }

  return [...tags];
}
