/**
 * @home空き家バンクのバナー画像（自治体の宣伝画像）かどうかを判定する
 * img.akiya-athome.jp ドメインの画像は全て自治体バナーであり、物件写真ではない
 */
export function isRealPropertyPhoto(url: string | undefined | null): boolean {
  if (!url) return false;
  // @homeのバナー画像は除外
  if (url.includes("img.akiya-athome.jp")) return false;
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
