import Link from "next/link";
import { Property } from "@/data/properties";

export default function PropertyCard({ property }: { property: Property }) {
  const formatPrice = (yen: number, usd: number) => {
    if (yen === 0) return { main: "FREE (¥0)", sub: "$0 USD" };
    return {
      main: `¥${yen.toLocaleString()}`,
      sub: `~$${usd.toLocaleString()} USD`,
    };
  };

  const price = formatPrice(property.price, property.priceUsd);

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer">
        {/* Image placeholder */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl">🏡</span>
            <p className="text-xs text-gray-400 mt-1">{property.prefecture}</p>
          </div>
          {property.price === 0 && (
            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              FREE
            </span>
          )}
          <span className="absolute top-3 right-3 bg-white/90 text-xs px-2 py-1 rounded-full text-gray-600">
            {property.type}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-sm text-primary leading-tight mb-2 line-clamp-2">
            {property.title}
          </h3>

          <p className="text-xs text-gray-500 mb-3">📍 {property.location}</p>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-lg font-bold text-accent">{price.main}</p>
              <p className="text-xs text-gray-400">{price.sub}</p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>
                {property.bedrooms} bed · {property.buildingArea}m²
              </p>
              <p>Land: {property.landArea}m²</p>
            </div>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {property.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded"
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
