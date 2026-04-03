import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoPropertyCard from "@/components/SeoPropertyCard";
import HeroSlider from "@/components/HeroSlider";
import FaqAccordion from "@/components/FaqAccordion";
import { Link } from "@/i18n/navigation";
import { scrapedProperties } from "@/lib/scraped-properties";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export default function Home() {
  const t = useTranslations();
  // 最新の写真あり物件から6件（投稿日順）
  const featuredScraped = [...scrapedProperties]
    .filter((p) => p.allImages && p.allImages.length > 0)
    .sort((a, b) => (b.scrapedAt || "").localeCompare(a.scrapedAt || ""))
    .slice(0, 6);
  const totalCount = scrapedProperties.length;

  const faqItems = (["q1", "q2", "q3", "q4", "q5"] as const).map((key) => ({
    question: t(`yesSection.${key}`),
    answer: t(`yesSection.${key.replace("q", "a")}`),
    detail: t(`yesSection.${key.replace("q", "a")}detail`),
  }));

  return (
    <>
      <Header />

      {/* 1. Hero — Full-screen photo slideshow */}
      <HeroSlider totalCount={totalCount} />

      {/* 2. Latest Properties (Pick up) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {t("featured.title")}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                {totalCount.toLocaleString()}+ {t("hero.statVacant")}
              </p>
            </div>
            <Link
              href="/properties"
              className="text-primary hover:text-green-800 text-sm font-semibold flex items-center gap-1 transition"
            >
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

      {/* 3. Message — Our Mission */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* 上: 中国語で左→右に流れる */}
        <div className="absolute top-8 left-0 right-0 pointer-events-none select-none" aria-hidden="true">
          <div className="flowing-text-right whitespace-nowrap text-[80px] md:text-[120px] font-bold text-gray-100/60 tracking-wider">
            日本空房网&nbsp;&nbsp;&nbsp;空置房&nbsp;&nbsp;&nbsp;日本空房网&nbsp;&nbsp;&nbsp;空置房&nbsp;&nbsp;&nbsp;日本空房网&nbsp;&nbsp;&nbsp;空置房&nbsp;&nbsp;&nbsp;日本空房网&nbsp;&nbsp;&nbsp;空置房&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        {/* 下: AKIYAで右→左に流れる */}
        <div className="absolute bottom-8 left-0 right-0 pointer-events-none select-none" aria-hidden="true">
          <div className="flowing-text whitespace-nowrap text-[80px] md:text-[120px] font-bold text-gray-100/60 tracking-[0.3em]">
            AKIYA&nbsp;&nbsp;&nbsp;AKIYA&nbsp;&nbsp;&nbsp;AKIYA&nbsp;&nbsp;&nbsp;AKIYA&nbsp;&nbsp;&nbsp;AKIYA&nbsp;&nbsp;&nbsp;AKIYA&nbsp;&nbsp;&nbsp;AKIYA&nbsp;&nbsp;&nbsp;AKIYA&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24 relative z-10 flex flex-col md:flex-row gap-12 md:gap-20">
          {/* 左: テキスト */}
          <div className="flex-1">
            <ScrollFadeIn>
              <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">
                {t("messageSection.label")}
              </p>
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <h2 className="text-2xl md:text-4xl font-light text-gray-900 leading-relaxed mb-10">
                {t("messageSection.title")}
              </h2>
            </ScrollFadeIn>
            <ScrollFadeIn delay={400}>
              <div className="text-base md:text-lg text-gray-500 leading-loose whitespace-pre-line max-w-2xl">
                {t("messageSection.body")}
              </div>
            </ScrollFadeIn>
          </div>

          {/* 右: 代表名 */}
          <ScrollFadeIn delay={600}>
            <div className="md:w-48 flex flex-col items-end justify-end text-right">
              <div className="w-px h-16 bg-gray-300 mb-6" />
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">Founder</p>
              <p className="text-lg font-light text-gray-800 tracking-wider">鶴 竜治</p>
              <p className="text-xs text-gray-400 mt-1 tracking-wider">Tatsuji Tsuru</p>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* 4. About Us — 3 Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 md:px-16">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">About</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-14">
              {t("aboutFeatures.title")}
            </h2>
          </ScrollFadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: 3 Languages */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">{t("aboutFeatures.feature1Title")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("aboutFeatures.feature1Desc")}</p>
            </div>

            {/* Feature 2: Free */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">{t("aboutFeatures.feature2Title")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("aboutFeatures.feature2Desc")}</p>
            </div>

            {/* Feature 3: Property count */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">{t("aboutFeatures.feature3Title")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("aboutFeatures.feature3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-8 md:px-16">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-12">
            {t("yesSection.title")}
          </h2>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />
    </>
  );
}
