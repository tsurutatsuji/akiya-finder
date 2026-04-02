/**
 * ロケール別テキスト切替ヘルパー
 * サーバーコンポーネントで params.locale を使ってテキストを切り替える
 */

export function L(locale: string, zh: string, ja: string, en: string): string {
  return locale === "zh" ? zh : locale === "ja" ? ja : en;
}

/**
 * 都道府県名の3言語マッピング（全47都道府県）
 */
export const PREF_NAMES: Record<string, { en: string; ja: string; zh: string }> = {
  hokkaido: { en: "Hokkaido", ja: "北海道", zh: "北海道" },
  aomori: { en: "Aomori", ja: "青森県", zh: "青森县" },
  iwate: { en: "Iwate", ja: "岩手県", zh: "岩手县" },
  miyagi: { en: "Miyagi", ja: "宮城県", zh: "宫城县" },
  akita: { en: "Akita", ja: "秋田県", zh: "秋田县" },
  yamagata: { en: "Yamagata", ja: "山形県", zh: "山形县" },
  fukushima: { en: "Fukushima", ja: "福島県", zh: "福岛县" },
  ibaraki: { en: "Ibaraki", ja: "茨城県", zh: "茨城县" },
  tochigi: { en: "Tochigi", ja: "栃木県", zh: "栃木县" },
  gunma: { en: "Gunma", ja: "群馬県", zh: "群马县" },
  saitama: { en: "Saitama", ja: "埼玉県", zh: "埼玉县" },
  chiba: { en: "Chiba", ja: "千葉県", zh: "千叶县" },
  tokyo: { en: "Tokyo", ja: "東京都", zh: "东京都" },
  kanagawa: { en: "Kanagawa", ja: "神奈川県", zh: "神奈川县" },
  niigata: { en: "Niigata", ja: "新潟県", zh: "新潟县" },
  toyama: { en: "Toyama", ja: "富山県", zh: "富山县" },
  ishikawa: { en: "Ishikawa", ja: "石川県", zh: "石川县" },
  fukui: { en: "Fukui", ja: "福井県", zh: "福井县" },
  yamanashi: { en: "Yamanashi", ja: "山梨県", zh: "山梨县" },
  nagano: { en: "Nagano", ja: "長野県", zh: "长野县" },
  gifu: { en: "Gifu", ja: "岐阜県", zh: "岐阜县" },
  shizuoka: { en: "Shizuoka", ja: "静岡県", zh: "静冈县" },
  aichi: { en: "Aichi", ja: "愛知県", zh: "爱知县" },
  mie: { en: "Mie", ja: "三重県", zh: "三重县" },
  shiga: { en: "Shiga", ja: "滋賀県", zh: "滋贺县" },
  kyoto: { en: "Kyoto", ja: "京都府", zh: "京都府" },
  osaka: { en: "Osaka", ja: "大阪府", zh: "大阪府" },
  hyogo: { en: "Hyogo", ja: "兵庫県", zh: "兵库县" },
  nara: { en: "Nara", ja: "奈良県", zh: "奈良县" },
  wakayama: { en: "Wakayama", ja: "和歌山県", zh: "和歌山县" },
  tottori: { en: "Tottori", ja: "鳥取県", zh: "鸟取县" },
  shimane: { en: "Shimane", ja: "島根県", zh: "岛根县" },
  okayama: { en: "Okayama", ja: "岡山県", zh: "冈山县" },
  hiroshima: { en: "Hiroshima", ja: "広島県", zh: "广岛县" },
  yamaguchi: { en: "Yamaguchi", ja: "山口県", zh: "山口县" },
  tokushima: { en: "Tokushima", ja: "徳島県", zh: "德岛县" },
  kagawa: { en: "Kagawa", ja: "香川県", zh: "香川县" },
  ehime: { en: "Ehime", ja: "愛媛県", zh: "爱媛县" },
  kochi: { en: "Kochi", ja: "高知県", zh: "高知县" },
  fukuoka: { en: "Fukuoka", ja: "福岡県", zh: "福冈县" },
  saga: { en: "Saga", ja: "佐賀県", zh: "佐贺县" },
  nagasaki: { en: "Nagasaki", ja: "長崎県", zh: "长崎县" },
  kumamoto: { en: "Kumamoto", ja: "熊本県", zh: "熊本县" },
  oita: { en: "Oita", ja: "大分県", zh: "大分县" },
  miyazaki: { en: "Miyazaki", ja: "宮崎県", zh: "宫崎县" },
  kagoshima: { en: "Kagoshima", ja: "鹿児島県", zh: "鹿儿岛县" },
  okinawa: { en: "Okinawa", ja: "沖縄県", zh: "冲绳县" },
};

/**
 * 地方名の3言語マッピング
 */
export const REGION_NAMES: Record<string, { en: string; ja: string; zh: string }> = {
  Hokkaido: { en: "Hokkaido", ja: "北海道", zh: "北海道" },
  Tohoku: { en: "Tohoku", ja: "東北", zh: "东北" },
  Kanto: { en: "Kanto", ja: "関東", zh: "关东" },
  Chubu: { en: "Chubu", ja: "中部", zh: "中部" },
  Kansai: { en: "Kansai", ja: "関西", zh: "关西" },
  Chugoku: { en: "Chugoku", ja: "中国", zh: "中国（山阳山阴）" },
  Shikoku: { en: "Shikoku", ja: "四国", zh: "四国" },
  "Kyushu & Okinawa": { en: "Kyushu & Okinawa", ja: "九州・沖縄", zh: "九州・冲绳" },
};

/**
 * 都道府県のスラッグからロケール別名前を取得
 */
export function getPrefectureName(slug: string, locale: string): string {
  const names = PREF_NAMES[slug.toLowerCase()];
  if (!names) return slug;
  return locale === "zh" ? names.zh : locale === "ja" ? names.ja : names.en;
}
