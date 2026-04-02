"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  INVESTMENT_CATEGORIES,
  getInvestmentTags,
  calculateInvestmentMetrics,
} from "@/lib/investment-tags";
import scrapedData from "../../../../data/scraped-properties.json";

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
  thumbnailUrl?: string;
  access?: string;
  structure?: string;
  remarks?: string;
}

function L(locale: string, zh: string, ja: string, en: string) {
  return locale === "zh" ? zh : locale === "ja" ? ja : en;
}

// 物件に投資タグ＋メトリクスを付与
const properties = (scrapedData as ScrapedProperty[]).map((p) => ({
  ...p,
  investmentTags: getInvestmentTags(p),
  metrics: calculateInvestmentMetrics(p),
}));

const PREF_LIST = [...new Set(properties.map((p) => p.prefectureEn))].sort();

export default function MapPage() {
  const locale = useLocale();
  const [category, setCategory] = useState("");
  const [prefFilter, setPrefFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (category && !p.investmentTags.includes(category)) return false;
      if (prefFilter && p.prefectureEn !== prefFilter) return false;
      if (priceRange === "free" && p.price !== 0) return false;
      if (priceRange === "under1m" && (p.price === 0 || p.price > 1000000))
        return false;
      if (
        priceRange === "1m-5m" &&
        (p.price < 1000000 || p.price > 5000000)
      )
        return false;
      if (priceRange === "5m+" && p.price < 5000000) return false;
      return true;
    });
  }, [category, prefFilter, priceRange]);

  // 各カテゴリの件数
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of INVESTMENT_CATEGORIES) {
      counts[cat.id] = properties.filter((p) =>
        p.investmentTags.includes(cat.id)
      ).length;
    }
    return counts;
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {L(locale, "投资日本隐藏的不动产", "日本の隠れた不動産に投資する", "Invest in Japan's Hidden Real Estate")}
        </h1>
        <p className="text-gray-500 mb-8">
          {L(
            locale,
            `全国47个都道府县 ${properties.length} 套房产。您的投资目标是什么？`,
            `47都道府県 ${properties.length} 物件。あなたの投資目標は？`,
            `${properties.length} properties across 47 prefectures. What's your investment goal?`
          )}
        </p>

        {/* Investment Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {INVESTMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(category === cat.id ? "" : cat.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                category === cat.id
                  ? "border-accent bg-accent/5 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <span className="text-2xl block mb-1">{cat.emoji}</span>
              <span className="font-semibold text-sm text-primary block">
                {cat.label}
              </span>
              <span className="text-xs text-gray-400">
                {categoryCounts[cat.id]} {L(locale, "套", "件", "homes")}
              </span>
            </button>
          ))}
        </div>

        {/* Active filter indicator */}
        {category && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
              {INVESTMENT_CATEGORIES.find((c) => c.id === category)?.emoji}{" "}
              {INVESTMENT_CATEGORIES.find((c) => c.id === category)?.label}
            </span>
            <span className="text-gray-400">
              {INVESTMENT_CATEGORIES.find((c) => c.id === category)?.description}
            </span>
            <button
              onClick={() => setCategory("")}
              className="text-gray-400 hover:text-gray-600 ml-auto"
            >
              {L(locale, "清除", "クリア", "Clear")}
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
            <option value="">{L(locale, "全部都道府县", "全ての都道府県", "All Prefectures")}</option>
            {PREF_LIST.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">{L(locale, "全部价格", "全ての価格", "All Prices")}</option>
            <option value="free">{L(locale, "免费（¥0）", "無料（¥0）", "Free (¥0)")}</option>
            <option value="under1m">{L(locale, "100万日元以下", "¥100万以下", "Under ¥1,000,000")}</option>
            <option value="1m-5m">{L(locale, "100万~500万日元", "¥100万–500万", "¥1M–5M")}</option>
            <option value="5m+">{L(locale, "500万日元以上", "¥500万以上", "Over ¥5,000,000")}</option>
          </select>
          <span className="text-sm text-gray-400 self-center">
            {filtered.length} {L(locale, "套房产", "物件", "properties")}
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>{" "}
            {L(locale, "免费", "無料", "Free")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>{" "}
            {L(locale, "100万日元以下", "¥100万以下", "Under ¥1M")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>{" "}
            {L(locale, "100万~500万日元", "¥100万–500万", "¥1M–5M")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>{" "}
            {L(locale, "500万日元以上", "¥500万以上", "Over ¥5M")}
          </span>
        </div>

        {/* Map */}
        <PropertyMap properties={filtered} />

        {/* CTA */}
        <div className="mt-8 p-6 bg-accent/5 border border-accent/20 rounded-lg text-center">
          <h3 className="font-semibold text-primary mb-2">
            {L(locale, "找到了理想的投资物件？", "良い投資物件が見つかりましたか？", "Found a promising investment?")}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {L(
              locale,
              "我们为您对接当地持牌经纪人，全程协助购买流程。",
              "現地の認可不動産業者をご紹介し、購入手続きをサポートします。",
              "We'll connect you with a licensed local agent who speaks English and handles the entire purchase process."
            )}
          </p>
          <a
            href="/contact"
            className="inline-block bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
          >
            {L(locale, "免费匹配经纪人", "無料でエージェントを紹介", "Get Matched with an Agent — Free")}
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}
