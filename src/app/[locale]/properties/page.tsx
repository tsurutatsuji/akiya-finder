"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoPropertyCard from "@/components/SeoPropertyCard";
import { scrapedProperties, unlistedProperties, ScrapedProperty } from "@/lib/scraped-properties";
import {
  getInvestmentTags,
  INVESTMENT_CATEGORIES,
} from "@/lib/investment-tags";
import { L, PREF_NAMES } from "@/lib/locale-utils";

const PREVIEW_KEY = "akiya2026";

const TAG_MAP = Object.fromEntries(
  INVESTMENT_CATEGORIES.map((c) => [c.id, c])
);

// PREF_LISTはコンポーネント内で動的に生成（プレビューモード対応）

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
    "high-value": { en: "Low price per sqm", ja: "㎡単価が安い", zh: "每平米单价低" },
    "station-close": { en: "Near station", ja: "駅から近い", zh: "近车站" },
    "airbnb-ready": { en: "Ideal for vacation rental", ja: "民泊に最適", zh: "适合民宿经营" },
    "free-entry": { en: "Ultra-low cost", ja: "超低コスト", zh: "超低成本" },
    "move-in-ready": { en: "Low renovation cost", ja: "リフォーム少", zh: "翻新费用低" },
    "cultural-gem": { en: "Historic property", ja: "歴史的物件", zh: "历史性建筑" },
  };
  const entry = map[tagId];
  if (!entry) return "";
  return L(locale, entry.zh, entry.ja, entry.en);
}

export default function PropertiesPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === PREVIEW_KEY;
  const properties = isPreview ? unlistedProperties : scrapedProperties;
  const PREF_LIST = useMemo(() => [...new Set(properties.map((p) => p.prefectureEn))].sort(), [properties]);

  const [prefFilter, setPrefFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">("price-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filtered = useMemo(() => {
    let result = properties.filter((p) => {
      // 都道府県
      if (prefFilter && p.prefectureEn !== prefFilter) return false;

      // 価格帯
      if (priceRange === "free" && p.price !== 0) return false;
      if (priceRange === "under500k" && (p.price === 0 || p.price > 500000)) return false;
      if (priceRange === "500k-1m" && (p.price < 500000 || p.price > 1000000)) return false;
      if (priceRange === "1m-3m" && (p.price < 1000000 || p.price > 3000000)) return false;
      if (priceRange === "3m-5m" && (p.price < 3000000 || p.price > 5000000)) return false;
      if (priceRange === "5m-10m" && (p.price < 5000000 || p.price > 10000000)) return false;
      if (priceRange === "10m+" && p.price < 10000000) return false;

      // 物件種別
      if (propertyTypeFilter === "house" && p.propertyType !== "売戸建") return false;
      if (propertyTypeFilter === "land" && p.propertyType !== "売土地") return false;
      if (propertyTypeFilter === "business" && p.propertyType !== "売事業用(一棟)") return false;

      // 築年数
      if (ageFilter && p.buildingAge) {
        if (ageFilter === "under10" && p.buildingAge > 10) return false;
        if (ageFilter === "under30" && p.buildingAge > 30) return false;
        if (ageFilter === "under50" && p.buildingAge > 50) return false;
        if (ageFilter === "over50" && p.buildingAge <= 50) return false;
      } else if (ageFilter && !p.buildingAge) {
        return false; // 築年数不明は除外
      }

      // 現況
      if (statusFilter === "vacant" && p.currentStatus !== "空") return false;
      if (statusFilter === "land" && p.currentStatus !== "更地") return false;
      if (statusFilter === "occupied" && p.currentStatus !== "居住中") return false;

      // 目的別
      if (purposeFilter) {
        const tags = getInvestmentTags(p);
        if (purposeFilter === "move-in") {
          // 即入居可: 戸建+空き
          if (p.propertyType !== "売戸建" || p.currentStatus !== "空") return false;
        }
        if (purposeFilter === "airbnb") {
          // 民泊: airbnb-readyタグ
          if (!tags.includes("airbnb-ready")) return false;
        }
        if (purposeFilter === "renovation") {
          // リノベ: 戸建+築40年以上
          if (p.propertyType !== "売戸建") return false;
          if (!p.buildingAge || p.buildingAge < 40) return false;
        }
        if (purposeFilter === "free") {
          // 無料・格安: 50万以下
          if (p.price > 500000) return false;
        }
        if (purposeFilter === "land-only") {
          // 土地のみ
          if (p.propertyType !== "売土地" && p.currentStatus !== "更地") return false;
        }
      }

      // テキスト検索
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
    if (sortBy === "newest") result.sort((a, b) => (b.scrapedAt || "").localeCompare(a.scrapedAt || ""));

    return result;
  }, [prefFilter, priceRange, propertyTypeFilter, ageFilter, statusFilter, purposeFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProperties = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const reset = () => {
    setPrefFilter(""); setPriceRange(""); setPropertyTypeFilter("");
    setAgeFilter(""); setStatusFilter(""); setPurposeFilter("");
    setSearch(""); setSortBy("price-asc"); setCurrentPage(1);
  };

  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const activeFilterCount = [prefFilter, priceRange, propertyTypeFilter, ageFilter, statusFilter, purposeFilter, search].filter(Boolean).length;

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

        {/* 目的別クイックフィルタ */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "", label: L(locale, "全部", "すべて", "All") },
            { id: "move-in", label: L(locale, "即可入住", "即入居可", "Move-in Ready") },
            { id: "free", label: L(locale, "免费・低价", "無料・格安", "Free / Budget") },
            { id: "airbnb", label: L(locale, "民宿经营", "民泊・Airbnb", "Airbnb") },
            { id: "renovation", label: L(locale, "翻新改造", "リノベーション", "Renovation") },
            { id: "land-only", label: L(locale, "仅土地", "土地のみ", "Land Only") },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleFilterChange(setPurposeFilter, purposeFilter === item.id ? "" : item.id)}
              className={`px-4 py-2 rounded-full text-sm transition border ${
                purposeFilter === item.id
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-8 space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
            placeholder={L(
              locale,
              "按地点、都道府县搜索...",
              "地名・都道府県で検索...",
              "Search by location or prefecture..."
            )}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />

          {/* 基本フィルタ */}
          <div className="flex flex-wrap gap-3">
            <select
              value={prefFilter}
              onChange={(e) => handleFilterChange(setPrefFilter, e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">
                {L(locale, `全部都道府县 (${PREF_LIST.length})`, `全都道府県 (${PREF_LIST.length})`, `All Prefectures (${PREF_LIST.length})`)}
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
              <option value="">{L(locale, "全部价格", "全価格帯", "All Prices")}</option>
              <option value="free">{L(locale, "免费 (¥0)", "無料 (¥0)", "Free (¥0)")}</option>
              <option value="under500k">{L(locale, "50万日元以下", "50万円以下", "Under ¥500K (~$3,300)")}</option>
              <option value="500k-1m">{L(locale, "50万〜100万日元", "50万〜100万円", "¥500K–1M (~$3,300–$6,600)")}</option>
              <option value="1m-3m">{L(locale, "100万〜300万日元", "100万〜300万円", "¥1M–3M (~$6,600–$20,000)")}</option>
              <option value="3m-5m">{L(locale, "300万〜500万日元", "300万〜500万円", "¥3M–5M (~$20,000–$33,000)")}</option>
              <option value="5m-10m">{L(locale, "500万〜1000万日元", "500万〜1000万円", "¥5M–10M (~$33,000–$66,000)")}</option>
              <option value="10m+">{L(locale, "1000万日元以上", "1000万円以上", "Over ¥10M (~$66,000+)")}</option>
            </select>

            <select
              value={propertyTypeFilter}
              onChange={(e) => handleFilterChange(setPropertyTypeFilter, e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">{L(locale, "全部类型", "全種別", "All Types")}</option>
              <option value="house">{L(locale, "戸建住宅", "戸建", "House")}</option>
              <option value="land">{L(locale, "土地", "土地", "Land")}</option>
              <option value="business">{L(locale, "事业用", "事��用", "Commercial")}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="price-asc">{L(locale, "价格：从低到高", "価格：安い順", "Price: Low → High")}</option>
              <option value="price-desc">{L(locale, "价格：从高到低", "価格：高い順", "Price: High → Low")}</option>
              <option value="newest">{L(locale, "最新发布", "新着���", "Newest")}</option>
            </select>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                showAdvanced ? "border-accent text-accent bg-accent/5" : "border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {L(locale, "详细条件", "詳細条件", "More Filters")}
              {showAdvanced ? " ▲" : " ▼"}
            </button>
          </div>

          {/* 詳細フィルタ */}
          {showAdvanced && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
              <select
                value={ageFilter}
                onChange={(e) => handleFilterChange(setAgeFilter, e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="">{L(locale, "全部築龄", "全築年数", "Any Age")}</option>
                <option value="under10">{L(locale, "10年以内", "築10年以内", "Under 10 years")}</option>
                <option value="under30">{L(locale, "30年以内", "築30年以内", "Under 30 years")}</option>
                <option value="under50">{L(locale, "50年以内", "築50年以内", "Under 50 years")}</option>
                <option value="over50">{L(locale, "50年以上", "築50年以上", "Over 50 years")}</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="">{L(locale, "全部状态", "全現況", "Any Status")}</option>
                <option value="vacant">{L(locale, "空置（可入住）", "空き（即入居可）", "Vacant (Move-in Ready)")}</option>
                <option value="land">{L(locale, "更地", "更地", "Cleared Land")}</option>
                <option value="occupied">{L(locale, "有人居住", "居住中", "Occupied")}</option>
              </select>
            </div>
          )}

          {/* フィルタ状態 */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {L(
                locale,
                `显示 ${filtered.length} 套中的第 ${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} 套（共 ${properties.length.toLocaleString()} 套）`,
                `${filtered.length} 件中 ${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} 件を表示（全 ${properties.length.toLocaleString()} 件）`,
                `Showing ${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} (${properties.length.toLocaleString()} total)`
              )}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={reset}
                className="text-xs text-accent hover:text-red-600 transition"
              >
                {L(locale, "清除所有条件", "条件をリセット", "Clear all filters")} ({activeFilterCount})
              </button>
            )}
          </div>
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
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">
              {L(locale,
                "没有匹配的房产。请调整搜索条件。",
                "条件に一致する物件がありません。",
                "No properties match your filters."
              )}
            </p>
            <button onClick={reset} className="text-accent hover:text-red-600 text-sm font-medium transition">
              {L(locale, "清除所有条件", "条件をリセット", "Clear all filters")}
            </button>
          </div>
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
