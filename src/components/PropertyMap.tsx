"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import { PREFECTURE_COORDS, jitterCoord } from "@/lib/prefecture-coords";

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProperty {
  id: string;
  price: number;
  priceFormatted: string;
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
            <Popup>
              <div className="text-xs min-w-[200px]">
                <p className="font-bold text-sm mb-1">
                  {m.price === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>{m.priceFormatted}</span>
                  )}
                  <span className="text-gray-400 font-normal ml-1">
                    ({priceToUsd(m.price)})
                  </span>
                </p>
                <p className="text-gray-600 mb-1">📍 {m.location}</p>
                <p className="text-gray-500">
                  {m.propertyType}
                  {m.layout !== "-" && ` · ${m.layout}`}
                  {m.buildingArea !== "-" && ` · ${m.buildingArea}`}
                </p>
                {m.yearBuilt !== "-" && (
                  <p className="text-gray-400">Built: {m.yearBuilt}</p>
                )}
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
                    href={`/contact?property=${encodeURIComponent(`${m.location} - ${m.priceFormatted}`)}`}
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
