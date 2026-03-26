"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties, prefectures, propertyTypes } from "@/data/properties";

export default function PropertiesPage() {
  const [prefecture, setPrefecture] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [type, setType] = useState("");

  const filtered = properties.filter((p) => {
    if (prefecture && p.prefecture !== prefecture) return false;
    if (type && p.type !== type) return false;
    if (priceRange === "free" && p.price !== 0) return false;
    if (priceRange === "under1m" && (p.price === 0 || p.price > 1000000)) return false;
    if (priceRange === "1m-5m" && (p.price < 1000000 || p.price > 5000000)) return false;
    if (priceRange === "5m+" && p.price < 5000000) return false;
    return true;
  });

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Browse Properties
        </h1>
        <p className="text-gray-500 mb-8">
          {properties.length} properties available across Japan
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All Prefectures</option>
            {prefectures.map((p) => (
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
            <option value="under1m">Under ¥1,000,000 (~$6,600)</option>
            <option value="1m-5m">¥1M–5M (~$6,600–$33,000)</option>
            <option value="5m+">Over ¥5,000,000 (~$33,000+)</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All Types</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            No properties match your filters. Try adjusting your search.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
}
