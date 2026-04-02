"use client";

import { useState } from "react";
import { ScrapedProperty } from "@/lib/scraped-properties";
import { getAllDisplayImages } from "@/lib/image-utils";

export default function ImageGallery({ property: p, images: propImages, captions: propCaptions }: { property: ScrapedProperty; images?: string[]; captions?: string[] }) {
  const images = propImages && propImages.length > 0 ? propImages : getAllDisplayImages(p);
  const captions = propCaptions && propCaptions.length > 0 ? propCaptions : (p.imageCaptions || []);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % images.length);

  if (images.length === 0) {
    return (
      <div className="h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🏡</span>
          <p className="text-gray-400 mt-2">写真はまだありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* メイン画像 */}
      <div
        className="h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl overflow-hidden relative cursor-pointer"
        onClick={() => openLightbox(0)}
      >
        <img
          src={images[0]}
          alt={p.locationJa || p.location}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {p.price === 0 && (
          <span className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-4 py-1.5 rounded-full">
            無料
          </span>
        )}
        <span className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
          {images.length > 1 ? `全${images.length}枚 — クリックで拡大` : "クリックで拡大"}
        </span>
      </div>

      {/* サムネイル一覧 */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-1 mt-1">
          {images.slice(0, 12).map((img, i) => (
            <div
              key={i}
              className="h-20 md:h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group"
              onClick={() => openLightbox(i)}
            >
              <img
                src={img}
                alt={captions[i] || `写真 ${i + 1}`}
                className="w-full h-full object-cover group-hover:opacity-80 transition"
                loading="lazy"
              />
              {captions[i] && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center truncate">
                  {captions[i]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ライトボックス */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* 左上: キャプション */}
          {captions[lightboxIndex] && (
            <div className="absolute top-4 left-4 z-50 bg-black/70 text-white px-4 py-2 rounded-lg max-w-[60vw]">
              <p className="font-medium text-base">{captions[lightboxIndex]}</p>
              <p className="text-white/60 text-xs mt-0.5">{lightboxIndex + 1} / {images.length}</p>
            </div>
          )}
          {!captions[lightboxIndex] && (
            <div className="absolute top-4 left-4 z-50 bg-black/70 text-white px-4 py-2 rounded-lg">
              <p className="text-white/60 text-xs">{lightboxIndex + 1} / {images.length}</p>
            </div>
          )}

          {/* 右上: 閉じる */}
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-50"
            onClick={closeLightbox}
          >
            ✕
          </button>

          {/* 左: 前へ */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-50 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              ‹
            </button>
          )}

          {/* 画像 */}
          <img
            src={images[lightboxIndex]}
            alt={captions[lightboxIndex] || `写真 ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 右: 次へ */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-50 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ShareButtons({ propertyId, title }: { propertyId: string; title: string }) {
  const url = `https://akiya-finder.vercel.app/zh/properties/${propertyId}`;
  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm text-gray-500">共有:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition"
      >
        X
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
      >
        Facebook
      </a>
      <a
        href={`https://line.me/R/msg/text/?${text}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
      >
        LINE
      </a>
      <a
        href={`https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
      >
        微博
      </a>
      <button
        onClick={() => { navigator.clipboard.writeText(url); }}
        className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-300 transition"
      >
        URLコピー
      </button>
    </div>
  );
}
