"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoPropertyCard from "@/components/SeoPropertyCard";
import { scrapedProperties, ScrapedProperty } from "@/lib/scraped-properties";
import {
  getInvestmentTags,
  INVESTMENT_CATEGORIES,
} from "@/lib/investment-tags";
import { L, PREF_NAMES } from "@/lib/locale-utils";

const properties = scrapedProperties;

const TAG_MAP = Object.fromEntries(
  INVESTMENT_CATEGORIES.map((c) => [c.id, c])
);

const PREF_LIST = [...new Set(properties.map((p) => p.prefectureEn))].sort();

const ITEMS_PER_PAGE = 20;

function getPrefDisplayName(prefEn: string, locale: string): string {
  const names = PREF_NAMES[prefEn.toLowerCase()];
  if (!names) return prefEn;
  return L(locale, names.zh, names.ja, names.en);
}

function getTagLabel(tagId: string, locale: string): string {
  const map: Record<string, { en: string; ja: string; zh: string }> = {
    "high-value": { en: "High Value", ja: "高コスパ", zh: "高性价比" },
    "station-close": { en: "Station Close", ja: "駅近", zh: "近车站" },
    "airbnb-ready": { en: "Airbnb Ready", ja: "民泊向き", zh: "民宿适合" },
    "free-entry": { en: "Free / Near-Free", ja: "無料・格安", zh: "免费・低价" },
    "move-in-ready": { en: "Move-in Ready", ja: "即入居可", zh: "可直接入住" },
    "cultural-gem": { en: "Cultural Gem", ja: "文化財", zh: "文化瑰宝" },
  };
  const entry = map[tagId];
  if (!entry) return TAG_MAP[tagId]?.label || tagId;
  return L(locale, entry.zh, entry.ja, entry.en);
}

function getTagDescription(tagId: string, locale: string): string {
  const map: Record<string, { en: string; ja: string; zh: string }> = {
    "high-value": {
      en: "Low price per sqm — best bang for your buck",
      ja: "㎡単価が安い — コスパ最高",
      zh: "每平米单价低 — 性价比最高",
    },
    "station-close": {
      en: "Within 10 min walk to a train station",
      ja: "駅から徒歩10分以内",
      zh: "步行10分钟内到车站",
    },
    "airbnb-ready": {
      en: "Tourist area + spacious — ideal for vacation rental",
      ja: "観光地×広い — 民泊に最適",
      zh: "旅游区+宽敞 — 最适合民宿经营",
    },
    "free-entry": {
      en: "¥0–¥150,000 (~$0–$1,000) — ultra-low risk entry",
      ja: "¥0〜¥150,000 — 超低リスク",
      zh: "¥0〜¥150,000 — 超低风险入门",
    },
    "move-in-ready": {
      en: "Under 30 years old or solid structure — low renovation cost",
      ja: "築30年以内またはRC構造 — リフォーム費用が安い",
      zh: "30年以内或RC结构 — 翻新费用低",
    },
    "cultural-gem": {
      en: "Machiya, kominka in historic areas — premium Airbnb potential",
      ja: "歴史エリアの町家・古民家 — 高級民泊向き",
      zh: "历史区域的町屋・古民居 — 高端民宿潜力",
    },
  };
  const entry = map[tagId];
  if (!entry) return TAG_MAP[tagId]?.description || "";
  return L(locale, entry.zh, entry.ja, entry.en);
}

export default function PropertiesPage() {
  const locale = useLocale();
  const [prefFilter, setPrefFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "roi-desc">("price-asc");
  const [currentPage, setCurrentPage] = useState(1);

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
          (p.locationZh && p.locationZh.includes(q)) ||
          p.prefectureEn.toLowerCase().includes(q) ||
          p.propertyType.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "roi-desc") result.sort((a, b) => (b.estimatedRoi ?? 0) - (a.estimatedRoi ?? 0));

    return result;
  }, [prefFilter, priceRange, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProperties = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {L(locale, "所有房源", "物件一覧", "Browse Properties")}
          </h1>
          <p className="text-gray-500">
            {L(
              locale,
              `来自日本官方空置房银行的 ${properties.length.toLocaleString()} 套房产，覆盖 ${PREF_LIST.length} 个都道府县。`,
              `日本の空き家バンクから ${properties.length.toLocaleString()} 件の物件を掲載。${PREF_LIST.length} 都道府県をカバー。`,
              `${properties.length.toLocaleString()} properties from Japan's official Akiya Bank system across ${PREF_LIST.length} prefectures.`
            )}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-8 space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
            placeholder={L(
              locale,
              "按地点、都道府县或类型搜索...",
              "地名・都道府県・種別で検索...",
              "Search by location, prefecture, or type..."
            )}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={prefFilter}
              onChange={(e) => handleFilterChange(setPrefFilter, e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">
                {L(
                  locale,
                  `全部都道府县 (${PREF_LIST.length})`,
                  `全都道府県 (${PREF_LIST.length})`,
                  `All Prefectures (${PREF_LIST.length})`
                )}
              </option>
              {PREF_LIST.map((p) => (
                <option key={p} value={p}>
                  {getPrefDisplayName(p, locale)} ({properties.filter((x) => x.prefectureEn === p).length})
                </option>
              ))}
            </select>
            <select
              value={priceRange}
              onChange={(e) => handleFilterChange(setPriceRange, e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">
                {L(locale, "全部价格", "全価格帯", "All Prices")}
              </option>
              <option value="free">
                {L(locale, "免费 (¥0)", "無料 (¥0)", "Free (¥0)")}
              </option>
              <option value="under1m">
                {L(locale, "100万日元以下（约5万元）", "100万円以下", "Under ¥1M (~$6,600)")}
              </option>
              <option value="1m-5m">
                {L(locale, "100万〜500万日元（约5万~25万元）", "100万〜500万円", "¥1M–5M (~$6,600–$33,000)")}
              </option>
              <option value="5m-10m">
                {L(locale, "500万〜1000万日元（约25万~50万元）", "500万〜1000万円", "¥5M–10M (~$33,000–$66,000)")}
              </option>
              <option value="10m+">
                {L(locale, "1000万日元以上（约50万元~）", "1000万円以上", "Over ¥10M (~$66,000+)")}
              </option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as typeof sortBy);
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="price-asc">
                {L(locale, "价格：从低到高", "価格：安い順", "Price: Low to High")}
              </option>
              <option value="price-desc">
                {L(locale, "价格：从高到低", "価格：高い順", "Price: High to Low")}
              </option>
            </select>
          </div>
          <p className="text-xs text-gray-400">
            {L(
              locale,
              `显示 ${filtered.length} 套中的第 ${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} 套（共 ${properties.length.toLocaleString()} 套）`,
              `${filtered.length} 件中 ${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} 件を表示（全 ${properties.length.toLocaleString()} 件）`,
              `Showing ${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} properties (${properties.length.toLocaleString()} total)`
            )}
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedProperties.map((p) => {
            const tags = getInvestmentTags(p);
            return (
              <div key={p.id} className="flex flex-col">
                <SeoPropertyCard property={p} />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 px-4 pb-3 -mt-2 bg-white rounded-b-xl border-x border-b border-gray-100">
                    {tags.map((tagId) => {
                      const cat = TAG_MAP[tagId];
                      if (!cat) return null;
                      return (
                        <span
                          key={tagId}
                          title={getTagDescription(tagId, locale)}
                          className="inline-flex items-center gap-0.5 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full font-medium"
                        >
                          {cat.emoji} {getTagLabel(tagId, locale)}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            {L(
              locale,
              "没有匹配的房产。请调整搜索条件。",
              "条件に一致する物件がありません。検索条件を変更してください。",
              "No properties match your filters. Try adjusting your search."
            )}
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
              disabled={safeCurrentPage <= 1}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {L(locale, "上一页", "前へ", "Previous")}
            </button>
            <div className="flex items-center gap-1">
              {(() => {
                const pages: (number | "...")[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (safeCurrentPage > 3) pages.push("...");
                  for (let i = Math.max(2, safeCurrentPage - 1); i <= Math.min(totalPages - 1, safeCurrentPage + 1); i++) {
                    pages.push(i);
                  }
                  if (safeCurrentPage < totalPages - 2) pages.push("...");
                  pages.push(totalPages);
                }
                return pages.map((page, idx) =>
                  page === "..." ? (
                    <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page as number); window.scrollTo(0, 0); }}
                      className={`w-9 h-9 text-sm rounded-lg transition ${
                        safeCurrentPage === page
                          ? "bg-accent text-white font-bold"
                          : "border border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                );
              })()}
            </div>
            <button
              onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
              disabled={safeCurrentPage >= totalPages}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {L(locale, "下一页", "次へ", "Next")}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
