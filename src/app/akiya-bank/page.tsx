"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import scrapedData from "../../../data/scraped-properties.json";

interface ScrapedProperty {
  id: string;
  price: number;
  priceFormatted: string;
  location: string;
  locationJa: string;
  prefecture: string;
  prefectureEn: string;
  propertyType: string;
  landArea: string;
  buildingArea: string;
  yearBuilt: string;
  layout: string;
  sourceUrl: string;
}

const properties = scrapedData as ScrapedProperty[];

const PREF_LIST = [...new Set(properties.map((p) => p.prefectureEn))].sort();

function priceToUsd(yen: number): number {
  return Math.round(yen / 150);
}

export default function AkiyaBankPage() {
  const [prefFilter, setPrefFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">("price-asc");

  const filtered = useMemo(() => {
    let result = properties.filter((p) => {
      if (prefFilter && p.prefectureEn !== prefFilter) return false;
      if (priceRange === "free" && p.price !== 0) return false;
      if (priceRange === "under1m" && (p.price === 0 || p.price > 1000000)) return false;
      if (priceRange === "1m-5m" && (p.price < 1000000 || p.price > 5000000)) return false;
      if (priceRange === "5m-10m" && (p.price < 5000000 || p.price > 10000000)) return false;
      if (priceRange === "10m+" && p.price < 10000000) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.location.toLowerCase().includes(q) ||
          p.locationJa.includes(q) ||
          p.prefectureEn.toLowerCase().includes(q) ||
          p.propertyType.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [prefFilter, priceRange, search, sortBy]);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Akiya Bank Search
          </h1>
          <p className="text-gray-500">
            {properties.length} properties from Japan&apos;s official Akiya Bank system, translated into English.
            Data sourced from municipal vacant house databases across {PREF_LIST.length} prefectures.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-8 space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location, prefecture, or type..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={prefFilter}
              onChange={(e) => setPrefFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">All Prefectures ({PREF_LIST.length})</option>
              {PREF_LIST.map((p) => (
                <option key={p} value={p}>
                  {p} ({properties.filter((x) => x.prefectureEn === p).length})
                </option>
              ))}
            </select>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">All Prices</option>
              <option value="free">Free (¥0)</option>
              <option value="under1m">Under ¥1M (~$6,600)</option>
              <option value="1m-5m">¥1M–5M (~$6,600–$33,000)</option>
              <option value="5m-10m">¥5M–10M (~$33,000–$66,000)</option>
              <option value="10m+">Over ¥10M (~$66,000+)</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {properties.length} properties
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl">🏡</span>
                  <p className="text-xs text-gray-400 mt-1">{p.prefectureEn}</p>
                </div>
                <span className="absolute top-2 right-2 bg-white/90 text-xs px-2 py-0.5 rounded-full text-gray-500">
                  {p.propertyType}
                </span>
                {p.price === 0 && (
                  <span className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-2">📍 {p.location}</p>

                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-accent">
                      {p.price === 0 ? "FREE" : p.priceFormatted}
                    </p>
                    {p.price > 0 && (
                      <p className="text-xs text-gray-400">
                        ~${priceToUsd(p.price).toLocaleString()} USD
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-3">
                  {p.layout !== "-" && <span>🏠 {p.layout}</span>}
                  {p.buildingArea !== "-" && <span>📐 {p.buildingArea}</span>}
                  {p.landArea !== "-" && <span>🌿 Land: {p.landArea}</span>}
                  {p.yearBuilt !== "-" && <span>📅 Built: {p.yearBuilt}</span>}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={p.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    View Original (Japanese)
                  </a>
                  <a
                    href={`/contact?property=${encodeURIComponent(`${p.location} - ${p.priceFormatted}`)}`}
                    className="flex-1 text-center text-xs bg-accent text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Inquire in English
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            No properties match your filters. Try adjusting your search.
          </p>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 p-6 bg-accent/5 border border-accent/20 rounded-lg text-center">
          <h3 className="font-semibold text-primary mb-2">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Tell us your requirements and we&apos;ll match you with a licensed agent who specializes in your area of interest.
          </p>
          <a
            href="/contact"
            className="inline-block bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Get Matched with an Agent — Free
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}
