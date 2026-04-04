"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ALL_PREFECTURES = [
  // Hokkaido
  "Hokkaido",
  // Tohoku
  "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima",
  // Kanto
  "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa",
  // Chubu
  "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi",
  // Kansai
  "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama",
  // Chugoku
  "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi",
  // Shikoku
  "Tokushima", "Kagawa", "Ehime", "Kochi",
  // Kyushu & Okinawa
  "Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa",
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-primary text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              🏠 {t("about")}
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              {t("aboutDesc")}
            </p>
            <p className="text-sm">
              <a
                href="mailto:helongzhi57@gmail.com"
                className="hover:text-white transition"
              >
                {t("email")}
              </a>
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t("explore")}</h4>
            <ul className="space-y-2 text-sm">
              {/* マップ — 座標精度改善後に復活 */}
              <li><Link href="/akiya-bank" className="hover:text-white transition">{t("akiyaBankSearch")}</Link></li>
              <li><Link href="/properties" className="hover:text-white transition">{t("browseProperties")}</Link></li>
              <li><Link href="/prefecture" className="hover:text-white transition">{t("byPrefecture")}</Link></li>
              <li><Link href="/price/free" className="hover:text-white transition">{t("freeProperties")}</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition">{t("howItWorks")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t("resources")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition">{t("blogEn")}</Link></li>
              <li><Link href="/blog?lang=zh" className="hover:text-white transition">{t("blogZh")}</Link></li>
              <li><Link href="/about" className="hover:text-white transition">{t("aboutUs")}</Link></li>
              <li><Link href="/support" className="text-accent hover:text-red-400 transition font-medium">{t("purchaseSupport")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t("disclaimer")}</h4>
            <p className="text-sm leading-relaxed">
              {t("disclaimerText")}
            </p>
          </div>
        </div>

        {/* All 47 Prefecture Links for SEO */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <h4 className="text-white font-semibold mb-3 text-sm">
            {t("popularPrefectures")}
          </h4>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {ALL_PREFECTURES.map((name) => (
              <Link
                key={name}
                href={`/prefecture/${name.toLowerCase()}`}
                className="hover:text-white transition"
              >
                {t("akiyaIn", { prefecture: name })}
              </Link>
            ))}
            <Link
              href="/prefecture"
              className="text-accent hover:text-red-400 transition"
            >
              {t("allPrefectures")}
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-4 pt-6 text-center text-sm">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
