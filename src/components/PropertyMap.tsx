"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import { PREFECTURE_COORDS, jitterCoord } from "@/lib/prefecture-coords";
import {
  INVESTMENT_CATEGORIES,
  type InvestmentMetrics,
} from "@/lib/investment-tags";

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProperty {
  id: string;
  price: number;
  priceFormatted: string;
  priceUsdFormatted?: string;
  location: string;
  prefectureEn: string;
  propertyType: string;
  landArea: string;
  buildingArea: string;
  yearBuilt: string;
  layout: string;
  sourceUrl: string;
  lat?: number;
  lng?: number;
  thumbnailUrl?: string;
  access?: string;
  metrics?: InvestmentMetrics;
  investmentTags?: string[];
  pricePerSqm?: number;
  pricePerSqmUsd?: number;
  buildingAge?: number;
  estimatedRenovationUsd?: { low: number; high: number };
  estimatedAirbnbRevenueUsd?: { gross: number; net: number };
  estimatedRoi?: number;
  areaDescription?: string;
  remarksEnglish?: string;
}

interface Props {
  properties: MapProperty[];
}

export default function PropertyMap({ properties }: Props) {
  // Use geocoded lat/lng if available, otherwise fallback to prefecture jitter
  const prefCounts: Record<string, number> = {};
  const markers = properties.map((p) => {
    if (p.lat && p.lng) {
      return { ...p, lat: p.lat, lng: p.lng };
    }
    const baseCoord = PREFECTURE_COORDS[p.prefectureEn] || [36.5, 138.0];
    const idx = prefCounts[p.prefectureEn] || 0;
    prefCounts[p.prefectureEn] = idx + 1;
    const coord = jitterCoord(baseCoord, idx);
    return { ...p, lat: coord[0], lng: coord[1] };
  });

  function priceColor(price: number): string {
    if (price === 0) return "#22c55e"; // green = free
    if (price < 1000000) return "#3b82f6"; // blue = cheap
    if (price < 5000000) return "#f59e0b"; // amber = medium
    return "#ef4444"; // red = expensive
  }

  function priceToUsd(yen: number): string {
    if (yen === 0) return "FREE";
    return `~$${Math.round(yen / 150).toLocaleString()}`;
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={[36.5, 138.0]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lng]}
            radius={6}
            fillColor={priceColor(m.price)}
            color="#fff"
            weight={1.5}
            opacity={1}
            fillOpacity={0.85}
          >
            <Popup maxWidth={280}>
              <div className="text-xs min-w-[240px]">
                {/* サムネイル画像 */}
                {m.thumbnailUrl && (
                  <img
                    src={m.thumbnailUrl}
                    alt={m.location}
                    className="w-full h-28 object-cover rounded mb-2"
                    loading="lazy"
                  />
                )}

                {/* 価格 */}
                <p className="font-bold text-sm mb-1">
                  {m.price === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <>
                      <span>{m.priceUsdFormatted || priceToUsd(m.price)}</span>
                      <span className="text-gray-400 font-normal ml-1 text-xs">
                        ({m.priceFormatted})
                      </span>
                    </>
                  )}
                </p>

                {/* 場所 */}
                <p className="text-gray-600 mb-1">{m.location}</p>

                {/* 基本情報 */}
                <p className="text-gray-500">
                  {m.propertyType}
                  {m.layout !== "-" && ` · ${m.layout}`}
                  {m.buildingArea !== "-" && ` · ${m.buildingArea}`}
                </p>

                {/* 投資指標セクション */}
                <div className="bg-amber-50 border-l-2 border-amber-400 p-2 my-2 rounded-r">
                  <p className="font-semibold text-amber-800 text-xs mb-1">
                    Investment Metrics
                  </p>
                  <div className="space-y-0.5 text-xs text-amber-700">
                    {m.pricePerSqmUsd && (
                      <p>
                        <span className="text-amber-500">$/㎡:</span>{" "}
                        <strong>${m.pricePerSqmUsd.toLocaleString()}</strong>
                      </p>
                    )}
                    {m.buildingAge != null && (
                      <p>
                        <span className="text-amber-500">Age:</span>{" "}
                        {m.buildingAge} years
                      </p>
                    )}
                    {m.metrics?.walkingMinutes != null && (
                      <p>
                        {m.metrics.walkingMinutes <= 10 ? "🚉" : "🚶"}{" "}
                        {m.metrics.walkingMinutes} min walk
                      </p>
                    )}
                    {m.access && m.metrics?.walkingMinutes == null && (
                      <p className="text-amber-500 truncate max-w-[220px]">{m.access}</p>
                    )}
                    {m.estimatedRenovationUsd && (
                      <p>
                        <span className="text-amber-500">Reno est.:</span>{" "}
                        ${m.estimatedRenovationUsd.low.toLocaleString()}–${m.estimatedRenovationUsd.high.toLocaleString()}
                      </p>
                    )}
                    {m.estimatedAirbnbRevenueUsd && (
                      <p>
                        <span className="text-amber-500">Airbnb est.:</span>{" "}
                        ${m.estimatedAirbnbRevenueUsd.net.toLocaleString()}/yr net
                      </p>
                    )}
                    {m.estimatedRoi && (
                      <p>
                        <span className="text-amber-500">Est. ROI:</span>{" "}
                        <strong className={m.estimatedRoi >= 10 ? "text-green-700" : ""}>{m.estimatedRoi}%</strong>
                      </p>
                    )}
                  </div>

                  {/* エリア説明 */}
                  {m.areaDescription && (
                    <p className="text-[10px] text-amber-600 mt-1 leading-tight">
                      {m.areaDescription}
                    </p>
                  )}

                  {/* 備考（英語） */}
                  {m.remarksEnglish && m.remarksEnglish.length > 0 && (
                    <p className="text-[10px] text-amber-500 mt-1 italic truncate max-w-[220px]">
                      Note: {m.remarksEnglish}
                    </p>
                  )}

                  {/* 投資タグバッジ */}
                  {m.investmentTags && m.investmentTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {m.investmentTags.map((tagId) => {
                        const cat = INVESTMENT_CATEGORIES.find(
                          (c) => c.id === tagId
                        );
                        if (!cat) return null;
                        return (
                          <span
                            key={tagId}
                            className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-medium"
                          >
                            {cat.emoji} {cat.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* アクションボタン */}
                <div className="flex gap-1 mt-2">
                  <a
                    href={m.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-200"
                  >
                    Original
                  </a>
                  <a
                    href={`/contact?property=${encodeURIComponent(
                      `${m.location} - ${m.priceFormatted}`
                    )}`}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Inquire
                  </a>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
