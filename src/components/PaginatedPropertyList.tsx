"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import SeoPropertyCard from "./SeoPropertyCard";
import { ScrapedProperty } from "@/lib/scraped-properties";

const ITEMS_PER_PAGE = 20;

function L(locale: string, zh: string, ja: string, en: string): string {
  if (locale === "zh") return zh;
  if (locale === "ja") return ja;
  return en;
}

export default function PaginatedPropertyList({
  properties,
  heading,
}: {
  properties: ScrapedProperty[];
  heading?: string;
}) {
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const paged = properties.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // ページ変更時にトップへスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // ページ番号リスト生成（Google風: 最大7個表示）
  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [];
    if (page <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = page - 1; i <= page + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, properties.length);

  return (
    <>
      {/* 見出し + 件数表示 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        {heading && (
          <h2 className="text-2xl font-bold text-primary">{heading}</h2>
        )}
        {totalPages > 1 && (
          <p className="text-sm text-gray-500">
            {L(
              locale,
              `共${properties.length}件中 ${startItem}-${endItem}件 (${page}/${totalPages}页)`,
              `全${properties.length}件中 ${startItem}-${endItem}件 (${page}/${totalPages}ページ)`,
              `${startItem}-${endItem} of ${properties.length} (Page ${page}/${totalPages})`
            )}
          </p>
        )}
      </div>

      {/* 物件グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paged.map((property) => (
          <SeoPropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-1 mt-10">
          {/* 前へ */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-600"
            aria-label="Previous page"
          >
            &larr;
          </button>

          {/* ページ番号 */}
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="px-2 py-2 text-sm text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition ${
                  p === page
                    ? "bg-accent text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}

          {/* 次へ */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-600"
            aria-label="Next page"
          >
            &rarr;
          </button>
        </nav>
      )}
    </>
  );
}
