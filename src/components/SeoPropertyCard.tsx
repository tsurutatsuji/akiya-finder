"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ScrapedProperty } from "@/lib/scraped-properties";
import { getDisplayImageUrl } from "@/lib/image-utils";
import { getPrefectureName } from "@/lib/locale-utils";
import WatchlistButton from "./WatchlistButton";

export default function SeoPropertyCard({
  property,
}: {
  property: ScrapedProperty;
}) {
  const [imgError, setImgError] = useState(false);
  const t = useTranslations("property");
  const locale = useLocale();

  // ロケールに応じた表示
  const displayLocation = locale === "zh" ? (property.locationZh || property.location)
    : locale === "ja" ? (property.locationJa || property.location)
    : property.location;
  const displayType = locale === "zh" ? (property.propertyTypeZh || property.propertyType)
    : property.propertyType;
  const displayImage = getDisplayImageUrl(property);
  const priceUsd = property.priceUsd || Math.round(property.price / 150);
  const priceCny = property.price > 0 ? Math.round(property.price / 20) : 0;

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer group">
        {/* Image */}
        <div className="h-52 relative overflow-hidden">
          {displayImage && !imgError ? (
            <img
              src={displayImage}
              alt={`Akiya house in ${property.prefectureEn}`}
              className="w-full h-full object-cover property-card-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="no-image-placeholder w-full h-full flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} points="9,22 9,12 15,12 15,22" />
              </svg>
              <p className="text-xs text-gray-400 font-medium">
                {getPrefectureName(property.prefectureEn, locale)}
              </p>
              <p className="text-[10px] text-gray-300 mt-0.5">{t("photoNotAvailable")}</p>
            </div>
          )}
          {/* Badges */}
          {property.price === 0 && (
            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {t("freeShort")}
            </span>
          )}
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full text-gray-600 font-medium shadow-sm">
            {displayType}
          </span>
          {/* Watchlist heart */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <WatchlistButton
              id={property.id}
              title={displayLocation}
              price={property.price}
              location={displayLocation}
              thumbnailUrl={displayImage}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {displayLocation}
          </p>

          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xl font-bold text-accent leading-tight">
                {property.price === 0
                  ? t("free")
                  : locale === "zh" ? `¥${priceCny.toLocaleString()} CNY`
                  : locale === "en" ? `$${priceUsd.toLocaleString()} USD`
                  : `¥${property.price.toLocaleString()}`}
              </p>
              {property.price > 0 && (locale === "zh" || locale === "en") && (
                <p className="text-xs text-gray-400 mt-0.5">
                  ≈ ¥{property.price.toLocaleString()} JPY
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

          {/* Metrics tags */}
          {property.buildingAge && (
            <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-50">
              <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md">
                {locale === "ja" ? `築${property.buildingAge}年`
                  : locale === "zh" ? `房龄${property.buildingAge}年`
                  : `${property.buildingAge}y old`}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
