/**
 * 自治体バナー・ロゴ・ヘッダー画像ではなく、物件の実写真かどうかを判定する
 */
export function isRealPropertyPhoto(url: string | undefined | null): boolean {
  if (!url) return false;

  const lower = url.toLowerCase();

  // @homeのバナー画像は全て除外
  if (lower.includes("img.akiya-athome.jp")) return false;

  // 自治体サイトのロゴ・ヘッダー・共通画像を除外
  const bannedPatterns = [
    "/css/", "/common/", "/shared/", "/template/",
    "head_", "header", "footer", "logo", "icon",
    "banner", "nav_", "menu_", "btn_", "button",
    "favicon", "sprite", "bg_", "background",
    "sns", "twitter", "facebook", "line_",
    "arrow", "bullet", "spacer", "pixel",
    "/img/head", "/img/foot", "/img/common",
    "ogp.", "og_image", "thumbnail_default",
    ".svg", ".gif",
  ];

  for (const pattern of bannedPatterns) {
    if (lower.includes(pattern)) return false;
  }

  // 画像サイズが小さすぎるパターン（アイコン等）を除外
  // 例: 16x16, 32x32, 1x1 等のファイル名パターン
  if (/\d+x\d+/.test(url)) {
    const match = url.match(/(\d+)x(\d+)/);
    if (match) {
      const w = parseInt(match[1]);
      const h = parseInt(match[2]);
      if (w < 100 || h < 100) return false;
    }
  }

  // 画像拡張子チェック（jpg/jpeg/png/webp のみ許可）
  if (!lower.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)) return false;

  return true;
}

/**
 * 物件の表示用画像URLを取得する
 * allImagesに実写真があればそれを使い、なければnullを返す
 */
export function getDisplayImageUrl(property: {
  thumbnailUrl?: string;
  allImages?: string[];
}): string | null {
  // allImagesに実写真があればそれを使う
  const allImages = (property as any).allImages as string[] | undefined;
  if (allImages && allImages.length > 0) {
    const realPhoto = allImages.find((img) => isRealPropertyPhoto(img));
    if (realPhoto) return realPhoto;
  }
  // thumbnailUrlが実写真ならそれを使う
  if (isRealPropertyPhoto(property.thumbnailUrl)) {
    return property.thumbnailUrl!;
  }
  return null;
}

/**
 * 物件の全画像URLを取得する（実写真のみ）
 */
export function getAllDisplayImages(property: {
  thumbnailUrl?: string;
  allImages?: string[];
}): string[] {
  const allImages = (property as any).allImages as string[] | undefined;
  if (allImages && allImages.length > 0) {
    return allImages.filter((img) => isRealPropertyPhoto(img));
  }
  if (isRealPropertyPhoto(property.thumbnailUrl)) {
    return [property.thumbnailUrl!];
  }
  return [];
}
