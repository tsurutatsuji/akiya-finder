"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ScrapedProperty } from "@/lib/scraped-properties";
import { getDisplayImageUrl } from "@/lib/image-utils";

export default function SeoPropertyCard({
  property,
}: {
  property: ScrapedProperty;
}) {
  const [imgError, setImgError] = useState(false);
  const t = useTranslations("property");
  const displayImage = getDisplayImageUrl(property);
  const priceUsd = property.priceUsd || Math.round(property.price / 150);
  const priceCny = property.price > 0 ? Math.round(property.price / 20) : 0;

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer">
        {/* Image - h-56 for larger display */}
        <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center">
          {displayImage && !imgError ? (
            <img
              src={displayImage}
              alt={`Akiya house in ${property.prefectureEn}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-center">
              <span className="text-4xl">🏡</span>
              <p className="text-xs text-gray-400 mt-1">
                {property.prefectureEn}
              </p>
            </div>
          )}
          {property.price === 0 && (
            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              {t("freeShort")}
            </span>
          )}
          <span className="absolute top-3 right-3 bg-white/90 text-xs px-2 py-1 rounded-full text-gray-600">
            {property.propertyType}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-2">
            📍 {property.location}
          </p>

          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-lg font-bold text-accent">
                {property.price === 0
                  ? t("free")
                  : `¥${property.price.toLocaleString()}`}
              </p>
              <p className="text-xs text-gray-400">
                ~${priceUsd.toLocaleString()} USD
              </p>
              {priceCny > 0 && (
                <p className="text-xs text-orange-500">
                  {t("cny", { amount: priceCny.toLocaleString() })}
                </p>
              )}
            </div>
            <div className="text-right text-xs text-gray-400">
              {property.layout && <p>{property.layout}</p>}
              {property.buildingArea && property.buildingArea !== "-" && (
                <p>{property.buildingArea}</p>
              )}
            </div>
          </div>

          {/* Metrics - max 2 tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {property.pricePerSqmUsd && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                ${property.pricePerSqmUsd}/sqm
              </span>
            )}
            {property.buildingAge && (
              <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">
                {property.buildingAge}y old
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
