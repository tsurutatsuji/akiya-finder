"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getViewHistory, ViewHistoryItem } from "@/lib/view-history";

const LAST_SEEN_KEY = "viewHistoryLastSeenCount";

function getLastSeenCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(LAST_SEEN_KEY) || "0", 10);
}

function setLastSeenCount(count: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_SEEN_KEY, String(count));
}

export default function ViewHistory() {
  const t = useTranslations("viewHistory");
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ViewHistoryItem[]>([]);
  const [newCount, setNewCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // 初回ロード: 履歴と未読数を取得
  useEffect(() => {
    const h = getViewHistory();
    setHistory(h);
    const lastSeen = getLastSeenCount();
    setNewCount(Math.max(0, h.length - lastSeen));
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

  // 開いたとき: 履歴を更新 + 未読をリセット
  useEffect(() => {
    if (open) {
      const h = getViewHistory();
      setHistory(h);
      setLastSeenCount(h.length);
      setNewCount(0);
    }
  }, [open]);

  const recentItems = history.slice(0, 5);
  const hasHistory = recentItems.length > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-1 text-gray-500 hover:text-primary transition p-1.5 rounded-lg hover:bg-gray-50"
        title={t("title")}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {newCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {newCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">{t("title")}</h3>
            {hasHistory && (
              <span className="text-xs text-gray-400">{t("count", { count: recentItems.length })}</span>
            )}
          </div>
          {!hasHistory ? (
            <div className="px-4 py-8 text-center">
              <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-sm text-gray-400">{t("empty")}</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {recentItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/properties/${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-b-0"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🏡</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">
                      {item.location || item.id}
                    </p>
                    <p className="text-sm font-bold text-accent">
                      {(item.price ?? 0) < 0
                        ? "要相談"
                        : item.price === 0
                        ? t("free")
                        : item.price
                        ? `¥${item.price.toLocaleString()}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(item.viewedAt)}
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

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
}
