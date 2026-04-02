"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function MapStreetViewTabs({
  lat,
  lng,
  location,
}: {
  lat: number;
  lng: number;
  location: string;
}) {
  const [activeTab, setActiveTab] = useState<"map" | "streetview" | "satellite">("map");
  const t = useTranslations("map");

  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
  const satelliteUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=18&t=k&output=embed`;
  const streetViewUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      {/* タブ */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("map")}
          className={`flex-1 px-3 py-2.5 text-sm font-medium transition ${
            activeTab === "map"
              ? "bg-white text-primary border-b-2 border-accent"
              : "bg-gray-50 text-gray-500 hover:text-gray-700"
          }`}
        >
          🗺️ {t("tabMap")}
        </button>
        <button
          onClick={() => setActiveTab("satellite")}
          className={`flex-1 px-3 py-2.5 text-sm font-medium transition ${
            activeTab === "satellite"
              ? "bg-white text-primary border-b-2 border-accent"
              : "bg-gray-50 text-gray-500 hover:text-gray-700"
          }`}
        >
          🛰️ {t("tabSatellite")}
        </button>
        <button
          onClick={() => setActiveTab("streetview")}
          className={`flex-1 px-3 py-2.5 text-sm font-medium transition ${
            activeTab === "streetview"
              ? "bg-white text-primary border-b-2 border-accent"
              : "bg-gray-50 text-gray-500 hover:text-gray-700"
          }`}
        >
          🔍 {t("tabStreetView")}
        </button>
      </div>

      {/* コンテンツ（正方形） */}
      <div className="aspect-square relative">
        {activeTab === "map" && (
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
        {activeTab === "satellite" && (
          <iframe
            src={satelliteUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t("tabSatellite")}
          />
        )}
        {activeTab === "streetview" && (
          <>
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
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded text-center">
              {t("streetViewNote")}
            </div>
          </>
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
          {t("openInMaps")} ↗
        </a>
      </div>
    </div>
  );
}
