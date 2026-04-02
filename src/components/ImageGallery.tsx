"use client";

import { useState } from "react";
import { ScrapedProperty } from "@/lib/scraped-properties";
import { getAllDisplayImages } from "@/lib/image-utils";

export default function ImageGallery({ property: p }: { property: ScrapedProperty }) {
  const images = getAllDisplayImages(p);
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
      <div className="mb-8">
        {p.lat && p.lng && (
          <StreetViewEmbed lat={p.lat} lng={p.lng} location={p.locationJa || p.location} />
        )}
        {!p.lat && (
          <div className="h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl">🏡</span>
              <p className="text-gray-400 mt-2">写真はまだありません</p>
            </div>
          </div>
        )}
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
          {images.slice(0, 6).map((img, i) => (
            <div
              key={i}
              className="h-20 md:h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <img
                src={img}
                alt={`写真 ${i + 1}`}
                className="w-full h-full object-cover hover:opacity-80 transition"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Street View */}
      {p.lat && p.lng && (
        <div className="mt-4">
          <StreetViewEmbed lat={p.lat} lng={p.lng} location={p.locationJa || p.location} />
        </div>
      )}

      {/* ライトボックス */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-50"
            onClick={closeLightbox}
          >
            ✕
          </button>

          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-50 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              ‹
            </button>
          )}

          <img
            src={images[lightboxIndex]}
            alt={`写真 ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-50 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              ›
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

function StreetViewEmbed({ lat, lng, location }: { lat: number; lng: number; location: string }) {
  // Google Maps Embed（APIキー不要）でStreet View + 地図を表示
  // layer=c でストリートビューレイヤーを有効化
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&layer=c&cbll=${lat},${lng}&cbp=11,0,0,0,0&output=svembed`;
  const fallbackUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <p className="text-sm font-medium text-gray-600">📍 周辺マップ & ストリートビュー — {location}</p>
        <a
          href={`https://www.google.com/maps/@${lat},${lng},17z/data=!3m1!1e3`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline"
        >
          Google Mapsで開く
        </a>
      </div>
      <iframe
        src={fallbackUrl}
        width="100%"
        height="350"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      />
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <a
          href={`https://www.google.com/maps/@${lat},${lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          🔍 ストリートビューで外観を確認する（Google Mapsで開く）
        </a>
      </div>
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
