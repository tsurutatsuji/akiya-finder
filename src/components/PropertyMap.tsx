"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { PREFECTURE_COORDS, jitterCoord } from "@/lib/prefecture-coords";

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
  [key: string]: any;
}

interface Props {
  properties: MapProperty[];
}

function priceColor(price: number): string {
  if (price === 0) return "#22c55e";
  if (price < 1000000) return "#3b82f6";
  if (price < 5000000) return "#f59e0b";
  return "#ef4444";
}

// MarkerCluster component using Leaflet directly
function MarkerClusterGroup({ properties }: { properties: (MapProperty & { lat: number; lng: number })[] }) {
  const map = useMap();

  useEffect(() => {
    // Load markercluster CSS
    const css1 = document.createElement("link");
    css1.rel = "stylesheet";
    css1.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
    document.head.appendChild(css1);

    const css2 = document.createElement("link");
    css2.rel = "stylesheet";
    css2.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
    document.head.appendChild(css2);

    // Load markercluster JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
    script.onload = () => {
      // Create cluster group
      const cluster = (L as any).markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (clusterObj: any) => {
          const count = clusterObj.getChildCount();
          let size = "small";
          if (count > 50) size = "large";
          else if (count > 10) size = "medium";
          return L.divIcon({
            html: `<div style="
              background: #1a1a2e;
              color: white;
              border-radius: 50%;
              width: ${size === "large" ? 50 : size === "medium" ? 40 : 30}px;
              height: ${size === "large" ? 50 : size === "medium" ? 40 : 30}px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${size === "large" ? 14 : size === "medium" ? 12 : 11}px;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">${count}</div>`,
            className: "",
            iconSize: L.point(size === "large" ? 50 : size === "medium" ? 40 : 30, size === "large" ? 50 : size === "medium" ? 40 : 30),
          });
        },
      });

      // Add markers
      properties.forEach((p) => {
        const color = priceColor(p.price);
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: 7,
          fillColor: color,
          color: "#fff",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85,
        });

        const priceText = p.price < 0 ? "Contact" : p.price === 0 ? "FREE" : `¥${p.price.toLocaleString()}`;
        marker.bindPopup(`
          <div style="min-width:200px; font-family: sans-serif;">
            <strong style="font-size:14px;">${p.location}</strong><br/>
            <span style="color: #e94560; font-weight: bold; font-size: 16px;">${priceText}</span><br/>
            <span style="color:#666; font-size:12px;">${p.propertyType} · ${p.layout || ""} · ${p.buildingArea || ""}</span><br/>
            <a href="/ja/properties/${p.id}" style="color:#3b82f6; font-size:12px; text-decoration: underline;">詳細を見る →</a>
          </div>
        `);

        cluster.addLayer(marker);
      });

      map.addLayer(cluster);

      return () => {
        map.removeLayer(cluster);
      };
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      try {
        document.head.removeChild(css1);
        document.head.removeChild(css2);
        document.head.removeChild(script);
      } catch {}
    };
  }, [map, properties]);

  return null;
}

export default function PropertyMap({ properties }: Props) {
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
  }) as (MapProperty & { lat: number; lng: number })[];

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
        <MarkerClusterGroup properties={markers} />
      </MapContainer>
    </div>
  );
}
