"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getWatchlist, WatchlistItem } from "@/lib/watchlist";

export default function WatchlistDropdown() {
  const t = useTranslations("watchlist");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Load items on mount
  useEffect(() => {
    setItems(getWatchlist());
  }, []);

  // Listen for watchlist changes (from WatchlistButton toggle)
  useEffect(() => {
    function handleChange() {
      setItems(getWatchlist());
    }
    window.addEventListener("watchlist-changed", handleChange);
    return () => window.removeEventListener("watchlist-changed", handleChange);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Refresh when dropdown opens
  useEffect(() => {
    if (open) {
      setItems(getWatchlist());
    }
  }, [open]);

  const displayItems = items.slice(0, 10);
  const hasItems = displayItems.length > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-1 text-gray-500 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-gray-50"
        title={t("title")}
      >
        {/* Heart icon */}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
          />
        </svg>
        {hasItems && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {displayItems.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">{t("title")}</h3>
            {hasItems && (
              <span className="text-xs text-gray-400">{t("count", { count: displayItems.length })}</span>
            )}
          </div>
          {!hasItems ? (
            <div className="px-4 py-8 text-center">
              <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                />
              </svg>
              <p className="text-sm text-gray-400">{t("empty")}</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {displayItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/properties/${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🏡</span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">
                      {item.location || item.id}
                    </p>
                    <p className="text-sm font-bold text-accent">
                      {item.price === 0
                        ? t("free")
                        : item.price
                        ? `¥${item.price.toLocaleString()}`
                        : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
