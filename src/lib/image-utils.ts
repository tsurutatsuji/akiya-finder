/**
 * 物件の実写真かどうかを判定する
 * carouselPhotoCountがある物件はカルーセルから取得した実写真
 */
export function isRealPropertyPhoto(url: string | undefined | null): boolean {
  if (!url) return false;
  // img.akiya-athome.jpからの画像も許可（カルーセルから取得した物件写真）
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
