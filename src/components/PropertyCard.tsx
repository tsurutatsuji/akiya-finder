"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Property } from "@/data/properties";
import { isRealPropertyPhoto } from "@/lib/image-utils";

export default function PropertyCard({ property }: { property: Property }) {
  const [imgError, setImgError] = useState(false);
  const t = useTranslations("property");
  const locale = useLocale();

  const priceCny = property.price > 0 ? Math.round(property.price / 20) : 0;
  const formatPrice = (yen: number, usd: number) => {
    if (yen < 0) return { main: locale === "ja" ? "要相談" : locale === "zh" ? "价格面议" : "Contact", sub: "" };
    if (yen === 0) return { main: t("free"), sub: "" };
    if (locale === "ja") return { main: `¥${yen.toLocaleString()}`, sub: "" };
    if (locale === "zh") return { main: `¥${priceCny.toLocaleString()} CNY`, sub: `≈ ¥${yen.toLocaleString()} JPY` };
    return { main: `$${usd.toLocaleString()} USD`, sub: `≈ ¥${yen.toLocaleString()} JPY` };
  };

  const price = formatPrice(property.price, property.priceUsd);

  const rawImageUrl =
    (property as Property & { thumbnailUrl?: string }).thumbnailUrl ||
    (property.images?.[0] && !property.images[0].includes("placeholder")
      ? property.images[0]
      : null);
  const imageUrl = rawImageUrl && isRealPropertyPhoto(rawImageUrl) ? rawImageUrl : null;

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer group">
        {/* Image */}
        <div className="h-52 relative overflow-hidden">
          {imageUrl && !imgError ? (
            <>
              <img
                src={imageUrl}
                alt={`Akiya property in ${property.prefecture}`}
                className="w-full h-full object-cover property-card-img"
                loading="lazy"
                onError={() => setImgError(true)}
              />
              <span className="absolute bottom-2 right-2 text-[10px] text-white/80 bg-black/40 px-1.5 py-0.5 rounded">
                {t("sourceAtHome")}
              </span>
            </>
          ) : (
            <div className="no-image-placeholder w-full h-full flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} points="9,22 9,12 15,12 15,22" />
              </svg>
              <p className="text-xs text-gray-400 font-medium">{property.prefecture}</p>
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
            {property.type}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-sm text-primary leading-tight mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {property.title}
          </h3>

          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xl font-bold text-accent leading-tight">{price.main}</p>
              {price.sub && <p className="text-xs text-gray-400 mt-0.5">{price.sub}</p>}
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>
                {property.bedrooms} bed · {property.buildingArea}m²
              </p>
              <p>{t("landArea")}: {property.landArea}m²</p>
            </div>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-50">
            {property.features.slice(0, 2).map((f) => (
              <span
                key={f}
                className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
