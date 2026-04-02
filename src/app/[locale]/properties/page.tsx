"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoPropertyCard from "@/components/SeoPropertyCard";
import scrapedData from "../../../../data/scraped-properties.json";
import type { ScrapedProperty } from "@/lib/scraped-properties";

const properties = scrapedData as ScrapedProperty[];
const prefectureList = [...new Set(properties.map((p) => p.prefectureEn))].sort();

function L(locale: string, zh: string, ja: string, en: string) {
  return locale === "zh" ? zh : locale === "ja" ? ja : en;
}

const ITEMS_PER_PAGE = 20;

export default function PropertiesPage() {
  const locale = useLocale();
  const [prefecture, setPrefecture] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [page, setPage] = useState(1);

  const filtered = properties.filter((p) => {
    if (prefecture && p.prefectureEn !== prefecture) return false;
    if (priceRange === "free" && p.price !== 0) return false;
    if (priceRange === "under1m" && (p.price === 0 || p.price > 1000000)) return false;
    if (priceRange === "1m-5m" && (p.price < 1000000 || p.price > 5000000)) return false;
    if (priceRange === "5m+" && p.price < 5000000) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = () => setPage(1);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {L(locale, "浏览房产", "物件一覧", "Browse Properties")}
        </h1>
        <p className="text-gray-500 mb-8">
          {L(
            locale,
            `日本全国 ${properties.length} 套房产`,
            `日本全国 ${properties.length} 件の物件`,
            `${properties.length} properties available across Japan`
          )}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select
            value={prefecture}
            onChange={(e) => { setPrefecture(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">{L(locale, "全部都道府县", "全ての都道府県", "All Prefectures")}</option>
            {prefectureList.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={priceRange}
            onChange={(e) => { setPriceRange(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">{L(locale, "全部价格", "全ての価格", "All Prices")}</option>
            <option value="free">{L(locale, "免费（¥0）", "無料（¥0）", "Free (¥0)")}</option>
            <option value="under1m">{L(locale, "100万日元以下（~$6,600）", "¥100万以下（~$6,600）", "Under ¥1,000,000 (~$6,600)")}</option>
            <option value="1m-5m">{L(locale, "100万~500万日元（~$6,600–$33,000）", "¥100万–500万（~$6,600–$33,000）", "¥1M–5M (~$6,600–$33,000)")}</option>
            <option value="5m+">{L(locale, "500万日元以上（~$33,000+）", "¥500万以上（~$33,000+）", "Over ¥5,000,000 (~$33,000+)")}</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {L(locale,
            `共 ${filtered.length} 套房产，第 ${page} / ${totalPages} 页`,
            `全 ${filtered.length} 件中 ${page} / ${totalPages} ページ`,
            `${filtered.length} properties — Page ${page} of ${totalPages}`
          )}
        </p>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paged.map((property) => (
            <SeoPropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            {L(locale,
              "没有匹配的房产，请调整搜索条件。",
              "条件に一致する物件がありません。検索条件を変更してください。",
              "No properties match your filters. Try adjusting your search."
            )}
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => { setPage(Math.max(1, page - 1)); window.scrollTo(0, 0); }}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 transition"
            >
              ←
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 7) p = i + 1;
              else if (page <= 4) p = i + 1;
              else if (page >= totalPages - 3) p = totalPages - 6 + i;
              else p = page - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                    p === page ? "bg-accent text-white" : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => { setPage(Math.min(totalPages, page + 1)); window.scrollTo(0, 0); }}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 transition"
            >
              →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
