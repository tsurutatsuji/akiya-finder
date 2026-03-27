"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LIFESTYLE_CATEGORIES, getLifestyleTags } from "@/lib/lifestyle-tags";
import scrapedData from "../../../data/scraped-properties.json";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-gray-400">Loading map...</p>
    </div>
  ),
});

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
  lat?: number;
  lng?: number;
}

// 物件にタグを付与
const properties = (scrapedData as ScrapedProperty[]).map((p) => ({
  ...p,
  lifestyleTags: getLifestyleTags(p.locationJa, p.prefectureEn, p.price),
}));

const PREF_LIST = [...new Set(properties.map((p) => p.prefectureEn))].sort();

export default function MapPage() {
  const [lifestyle, setLifestyle] = useState("");
  const [prefFilter, setPrefFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (lifestyle && !p.lifestyleTags.includes(lifestyle)) return false;
      if (prefFilter && p.prefectureEn !== prefFilter) return false;
      if (priceRange === "free" && p.price !== 0) return false;
      if (priceRange === "under1m" && (p.price === 0 || p.price > 1000000)) return false;
      if (priceRange === "1m-5m" && (p.price < 1000000 || p.price > 5000000)) return false;
      if (priceRange === "5m+" && p.price < 5000000) return false;
      return true;
    });
  }, [lifestyle, prefFilter, priceRange]);

  // 各カテゴリの件数
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of LIFESTYLE_CATEGORIES) {
      counts[cat.id] = properties.filter((p) => p.lifestyleTags.includes(cat.id)).length;
    }
    return counts;
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Find Your Dream Home in Japan
        </h1>
        <p className="text-gray-500 mb-8">
          {properties.length} properties across all 47 prefectures. What are you looking for?
        </p>

        {/* Lifestyle Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {LIFESTYLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setLifestyle(lifestyle === cat.id ? "" : cat.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                lifestyle === cat.id
                  ? "border-accent bg-accent/5 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <span className="text-2xl block mb-1">{cat.emoji}</span>
              <span className="font-semibold text-sm text-primary block">{cat.label}</span>
              <span className="text-xs text-gray-400">{categoryCounts[cat.id]} homes</span>
            </button>
          ))}
        </div>

        {/* Active filter indicator */}
        {lifestyle && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
              {LIFESTYLE_CATEGORIES.find((c) => c.id === lifestyle)?.emoji}{" "}
              {LIFESTYLE_CATEGORIES.find((c) => c.id === lifestyle)?.label}
            </span>
            <span className="text-gray-400">
              {LIFESTYLE_CATEGORIES.find((c) => c.id === lifestyle)?.description}
            </span>
            <button
              onClick={() => setLifestyle("")}
              className="text-gray-400 hover:text-gray-600 ml-auto"
            >
              Clear
            </button>
          </div>
        )}

        {/* Secondary Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={prefFilter}
            onChange={(e) => setPrefFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All Prefectures</option>
            {PREF_LIST.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All Prices</option>
            <option value="free">Free (¥0)</option>
            <option value="under1m">Under ¥1,000,000</option>
            <option value="1m-5m">¥1M–5M</option>
            <option value="5m+">Over ¥5,000,000</option>
          </select>
          <span className="text-sm text-gray-400 self-center">
            {filtered.length} properties
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Free
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Under ¥1M
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> ¥1M–5M
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Over ¥5M
          </span>
        </div>

        {/* Map */}
        <PropertyMap properties={filtered} />

        {/* CTA */}
        <div className="mt-8 p-6 bg-accent/5 border border-accent/20 rounded-lg text-center">
          <h3 className="font-semibold text-primary mb-2">
            Found something interesting?
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            We&apos;ll connect you with a licensed local agent who can help with the purchase process.
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
