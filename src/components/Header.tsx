"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import ViewerCount from "./ViewerCount";
import ViewHistory from "./ViewHistory";
import WatchlistDropdown from "./WatchlistDropdown";

export default function Header() {
  const t = useTranslations("nav");
  const tLang = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
    setLangOpen(false);
  };

  const locales = [
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
  ];

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
            <span className="text-xl font-bold text-primary">
              {locale === "zh" ? (
                <>日本<span className="text-accent">空房网</span></>
              ) : locale === "ja" ? (
                <span className="tracking-wider">AKI<span className="text-accent">YA</span></span>
              ) : (
                <>Akiya<span className="text-accent">Finder</span></>
              )}
            </span>
          </Link>
          <ViewerCount />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <Link
            href="/properties"
            className="text-gray-600 hover:text-primary hover:bg-gray-50 transition px-3 py-2 rounded-lg"
          >
            {t("properties")}
          </Link>
          <Link
            href="/map"
            className="text-gray-600 hover:text-primary hover:bg-gray-50 transition px-3 py-2 rounded-lg"
          >
            {t("map")}
          </Link>
          <Link
            href="/how-it-works"
            className="text-gray-600 hover:text-primary hover:bg-gray-50 transition px-3 py-2 rounded-lg"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href="/blog"
            className="text-gray-600 hover:text-primary hover:bg-gray-50 transition px-3 py-2 rounded-lg"
          >
            {t("blog")}
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-primary hover:bg-gray-50 transition px-3 py-2 rounded-lg"
          >
            {t("about")}
          </Link>
          <Link
            href="/support"
            className="text-accent hover:text-red-700 hover:bg-red-50 transition px-3 py-2 rounded-lg font-medium"
          >
            {t("support")}
          </Link>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* View History */}
          <ViewHistory />

          {/* Watchlist */}
          <WatchlistDropdown />

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm hover:bg-gray-50"
            >
              <span>{currentLocale.flag}</span>
              <span>{currentLocale.label}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-50">
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLocale(l.code)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                      locale === l.code ? "text-accent font-medium" : "text-gray-600"
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 無料相談ボタン — ユーザー対応不可のため一時非表示 */}
          {false && (
          <Link
            href="/contact"
            className="bg-accent text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold shadow-sm shadow-accent/20"
          >
            {t("getStarted")}
          </Link>
          )}
        </nav>

        {/* Mobile: View History + Menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <ViewHistory />
          <WatchlistDropdown />
          <button
            className="text-gray-600 hover:text-primary p-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          <Link href="/properties" className="block text-gray-600 hover:text-primary hover:bg-gray-50 text-sm px-3 py-2 rounded-lg" onClick={() => setMobileOpen(false)}>{t("properties")}</Link>
          <Link href="/map" className="block text-gray-600 hover:text-primary hover:bg-gray-50 text-sm px-3 py-2 rounded-lg" onClick={() => setMobileOpen(false)}>{t("map")}</Link>
          <Link href="/how-it-works" className="block text-gray-600 hover:text-primary hover:bg-gray-50 text-sm px-3 py-2 rounded-lg" onClick={() => setMobileOpen(false)}>{t("howItWorks")}</Link>
          <Link href="/blog" className="block text-gray-600 hover:text-primary hover:bg-gray-50 text-sm px-3 py-2 rounded-lg" onClick={() => setMobileOpen(false)}>{t("blog")}</Link>
          <Link href="/about" className="block text-gray-600 hover:text-primary hover:bg-gray-50 text-sm px-3 py-2 rounded-lg" onClick={() => setMobileOpen(false)}>{t("about")}</Link>
          <Link href="/support" className="block text-accent hover:text-red-700 hover:bg-red-50 text-sm px-3 py-2 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>{t("support")}</Link>
          <div className="flex gap-2 pt-3 mt-2 border-t border-gray-100">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => { switchLocale(l.code); setMobileOpen(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm border ${
                  locale === l.code ? "border-accent text-accent bg-accent/5" : "border-gray-200 text-gray-600"
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          {/* 無料相談ボタン — ユーザー対応不可のため一時非表示 */}
          {false && (
          <Link href="/contact" className="block bg-accent text-white px-4 py-2.5 rounded-lg text-center text-sm font-semibold mt-2" onClick={() => setMobileOpen(false)}>{t("getStarted")}</Link>
          )}
        </div>
      )}
    </header>
  );
}
