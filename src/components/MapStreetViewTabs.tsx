"use client";

import { useState } from "react";

export default function MapStreetViewTabs({
  lat,
  lng,
  location,
}: {
  lat: number;
  lng: number;
  location: string;
}) {
  const [activeTab, setActiveTab] = useState<"map" | "streetview">("streetview");

  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
  const streetViewUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      {/* タブ */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("streetview")}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "streetview"
              ? "bg-white text-primary border-b-2 border-accent"
              : "bg-gray-50 text-gray-500 hover:text-gray-700"
          }`}
        >
          🔍 ストリートビュー
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "map"
              ? "bg-white text-primary border-b-2 border-accent"
              : "bg-gray-50 text-gray-500 hover:text-gray-700"
          }`}
        >
          🗺️ 地図
        </button>
      </div>

      {/* コンテンツ（正方形） */}
      <div className="aspect-square relative">
        {activeTab === "streetview" ? (
          <iframe
            src={streetViewUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Street View"
          />
        ) : (
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        )}
      </div>

      {/* フッター */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between items-center">
        <p className="text-xs text-gray-500 truncate">📍 {location}</p>
        <a
          href={`https://www.google.com/maps/@${lat},${lng},17z`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline whitespace-nowrap ml-2"
        >
          Google Mapsで開く
        </a>
      </div>
    </div>
  );
}
