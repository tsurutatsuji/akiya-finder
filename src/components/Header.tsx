"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import ViewerCount from "./ViewerCount";

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
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-primary">
              Akiya<span className="text-accent">Finder</span>
            </span>
          </Link>
          <ViewerCount />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          <Link
            href="/properties"
            className="text-gray-600 hover:text-primary transition"
          >
            {t("properties")}
          </Link>
          <Link
            href="/akiya-bank"
            className="text-gray-600 hover:text-primary transition"
          >
            {t("akiyaBank")}
          </Link>
          <Link
            href="/map"
            className="text-gray-600 hover:text-primary transition"
          >
            {t("map")}
          </Link>
          <Link
            href="/how-it-works"
            className="text-gray-600 hover:text-primary transition"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href="/blog"
            className="text-gray-600 hover:text-primary transition"
          >
            {t("blog")}
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-primary transition"
          >
            {t("about")}
          </Link>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm"
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

          <Link
            href="/contact"
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
          >
            {t("getStarted")}
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-gray-600 hover:text-primary"
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

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/properties" className="block text-gray-600 hover:text-primary text-sm" onClick={() => setMobileOpen(false)}>{t("properties")}</Link>
          <Link href="/akiya-bank" className="block text-gray-600 hover:text-primary text-sm" onClick={() => setMobileOpen(false)}>{t("akiyaBank")}</Link>
          <Link href="/map" className="block text-gray-600 hover:text-primary text-sm" onClick={() => setMobileOpen(false)}>{t("map")}</Link>
          <Link href="/how-it-works" className="block text-gray-600 hover:text-primary text-sm" onClick={() => setMobileOpen(false)}>{t("howItWorks")}</Link>
          <Link href="/blog" className="block text-gray-600 hover:text-primary text-sm" onClick={() => setMobileOpen(false)}>{t("blog")}</Link>
          <Link href="/about" className="block text-gray-600 hover:text-primary text-sm" onClick={() => setMobileOpen(false)}>{t("about")}</Link>
          <div className="flex gap-2 pt-2 border-t border-gray-100">
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
          <Link href="/contact" className="block bg-accent text-white px-4 py-2 rounded-lg text-center text-sm font-medium" onClick={() => setMobileOpen(false)}>{t("getStarted")}</Link>
        </div>
      )}
    </header>
  );
}
