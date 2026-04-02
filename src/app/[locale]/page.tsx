import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import SeoPropertyCard from "@/components/SeoPropertyCard";
import NewsletterForm from "@/components/NewsletterForm";
import { properties } from "@/data/properties";
import { Link } from "@/i18n/navigation";
import { scrapedProperties } from "@/lib/scraped-properties";

export default function Home() {
  const t = useTranslations();
  // 写真あり+価格ありのスクレイプ物件から6件ピックアップ（異なる都道府県）
  const seenPrefs = new Set<string>();
  const featuredScraped = scrapedProperties.filter((p) => {
    if (!p.allImages || p.allImages.length === 0) return false;
    if (!p.price && p.price !== 0) return false;
    if (seenPrefs.has(p.prefectureEn)) return false;
    seenPrefs.add(p.prefectureEn);
    return true;
  }).slice(0, 6);
  const totalCount = scrapedProperties.length;

  return (
    <>
      <Header />

      {/* Hero - Inspired by Shenjumiaosuan's clean, trust-building approach */}
      <section className="hero-gradient text-white py-20 md:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">{totalCount.toLocaleString()}+ {t("hero.statVacant")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            {t("hero.title")}
            <br />
            <span className="stat-number">{t("hero.titleAccent")}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-accent hover:bg-red-600 text-white px-10 py-4 rounded-xl font-semibold transition text-lg shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40"
            >
              {t("hero.cta")}
            </Link>
            <Link
              href="/map"
              className="border border-white/30 hover:bg-white/10 text-white px-10 py-4 rounded-xl font-semibold transition text-lg backdrop-blur-sm"
            >
              {t("nav.map")}
            </Link>
          </div>

          {/* Stats - Larger, more prominent */}
          <div className="grid grid-cols-3 gap-6 mt-20 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <p className="text-4xl md:text-5xl font-bold stat-number">{totalCount.toLocaleString()}+</p>
              <p className="text-sm text-gray-400 mt-1">{t("hero.statVacant")}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <p className="text-4xl md:text-5xl font-bold stat-number">$0</p>
              <p className="text-sm text-gray-400 mt-1">{t("hero.statPrice")}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <p className="text-4xl md:text-5xl font-bold stat-number">47</p>
              <p className="text-sm text-gray-400 mt-1">{t("hero.statPrefectures")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Yes, Yes, Yes — 障壁除去セクション */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {t("yesSection.title")}
          </h2>
          <div className="space-y-6">
            {(["q1", "q2", "q3", "q4", "q5"] as const).map((key) => (
              <div key={key} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <span className="text-accent font-bold text-lg">Q</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-primary text-lg mb-2">
                      {t(`yesSection.${key}`)}
                    </p>
                    <p className="text-2xl font-bold text-accent mb-1">
                      {t(`yesSection.${key.replace("q", "a")}`)}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {t(`yesSection.${key.replace("q", "a")}detail`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Japan */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            {t("whyJapan.title")}
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            {t("hero.subtitle").slice(0, 50)}...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-accent/20 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-primary">{t("whyJapan.noRestrictions")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("whyJapan.noRestrictionsDesc")}</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-accent/20 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-primary">{t("whyJapan.affordable")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("whyJapan.affordableDesc")}</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-accent/20 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">🏯</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-primary">{t("whyJapan.architecture")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("whyJapan.architectureDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">{t("featured.title")}</h2>
              <p className="text-gray-500 mt-1 text-sm">{totalCount.toLocaleString()}+ {t("hero.statVacant")}</p>
            </div>
            <Link href="/properties" className="text-accent hover:text-red-600 text-sm font-semibold flex items-center gap-1 transition">
              {t("featured.viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredScraped.map((property) => (
              <SeoPropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Prefecture */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">{t("browsePrefecture.title")}</h2>
            <Link href="/prefecture" className="text-accent hover:text-red-600 text-sm font-semibold transition">
              {t("browsePrefecture.viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { en: "Hokkaido", ja: "北海道", zh: "北海道" },
              { en: "Tokyo", ja: "東京都", zh: "东京都" },
              { en: "Kyoto", ja: "京都府", zh: "京都府" },
              { en: "Osaka", ja: "大阪府", zh: "大阪府" },
              { en: "Nagano", ja: "長野県", zh: "长野县" },
              { en: "Okinawa", ja: "沖縄県", zh: "冲绳县" },
              { en: "Chiba", ja: "千葉県", zh: "千叶县" },
              { en: "Shizuoka", ja: "静岡県", zh: "静冈县" },
              { en: "Fukuoka", ja: "福岡県", zh: "福冈县" },
              { en: "Kanagawa", ja: "神奈川県", zh: "神奈川县" },
              { en: "Niigata", ja: "新潟県", zh: "新潟县" },
              { en: "Hiroshima", ja: "広島県", zh: "广岛县" },
            ].map((pref) => (
              <Link key={pref.en} href={`/prefecture/${pref.en.toLowerCase()}`} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100 hover:border-accent hover:shadow-md hover:bg-white transition-all text-sm font-semibold text-primary group">
                <span className="group-hover:text-accent transition-colors">{t("nav.home") === "首页" ? pref.zh : t("nav.home") === "ホーム" ? pref.ja : pref.en}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Price */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 text-center">{t("browsePrice.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { href: "/price/free", label: t("browsePrice.free"), accent: true },
              { href: "/price/under-100k", label: t("browsePrice.under100k"), accent: false },
              { href: "/price/under-500k", label: t("browsePrice.under500k"), accent: false },
              { href: "/price/under-1m", label: t("browsePrice.under1m"), accent: false },
              { href: "/price/under-5m", label: t("browsePrice.under5m"), accent: false },
              { href: "/price/under-10m", label: t("browsePrice.under10m"), accent: false },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`rounded-xl p-5 text-center border transition-all font-semibold text-sm hover:shadow-md ${item.accent ? "bg-accent text-white border-accent hover:bg-red-600 shadow-lg shadow-accent/20" : "bg-white text-primary border-gray-200 hover:border-accent"}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 text-center">{t("browseInvestment.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { slug: "high-value", emoji: "📈", label: t("browseInvestment.highValue"), desc: t("browseInvestment.highValueDesc") },
              { slug: "station-close", emoji: "🚉", label: t("browseInvestment.stationClose"), desc: t("browseInvestment.stationCloseDesc") },
              { slug: "airbnb-ready", emoji: "🏨", label: t("browseInvestment.airbnbReady"), desc: t("browseInvestment.airbnbReadyDesc") },
              { slug: "free-near-free", emoji: "🆓", label: t("browseInvestment.freeNearFree"), desc: t("browseInvestment.freeNearFreeDesc") },
              { slug: "move-in-ready", emoji: "🏗️", label: t("browseInvestment.moveInReady"), desc: t("browseInvestment.moveInReadyDesc") },
              { slug: "cultural-gem", emoji: "🏯", label: t("browseInvestment.culturalGem"), desc: t("browseInvestment.culturalGemDesc") },
            ].map((tag) => (
              <Link key={tag.slug} href={`/tag/${tag.slug}`} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 card-hover flex items-start gap-4 hover:border-accent/20 transition-all">
                <span className="text-3xl mt-0.5">{tag.emoji}</span>
                <div>
                  <h3 className="font-bold text-primary text-base">{tag.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tag.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works CTA */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">{t("howItWorksSection.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { num: "1", title: t("howItWorksSection.step1Title"), desc: t("howItWorksSection.step1Desc") },
              { num: "2", title: t("howItWorksSection.step2Title"), desc: t("howItWorksSection.step2Desc") },
              { num: "3", title: t("howItWorksSection.step3Title"), desc: t("howItWorksSection.step3Desc") },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <span className="text-accent font-bold text-2xl">{step.num}</span>
                </div>
                <h3 className="font-bold mb-2 text-primary text-lg">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/contact" className="inline-block bg-accent text-white px-10 py-4 rounded-xl font-semibold hover:bg-red-600 transition mt-12 shadow-lg shadow-accent/20 text-lg">
            {t("howItWorksSection.cta")}
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("newsletter.title")}</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">{t("newsletter.subtitle")}</p>
          <NewsletterForm />
          <p className="text-xs text-gray-400 mt-4">{t("newsletter.note")}</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
