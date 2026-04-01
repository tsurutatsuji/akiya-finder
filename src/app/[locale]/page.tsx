import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import NewsletterForm from "@/components/NewsletterForm";
import { properties } from "@/data/properties";
import { Link } from "@/i18n/navigation";

export default function Home() {
  const t = useTranslations();
  const featured = properties.slice(0, 6);

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="hero-gradient text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {t("hero.title")}
            <br />
            <span className="text-cyan-300">{t("hero.titleAccent")}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-accent hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
            >
              {t("hero.cta")}
            </Link>
            <Link
              href="/how-it-works"
              className="border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
            >
              {t("hero.howItWorks")}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            <div>
              <p className="text-3xl font-bold text-cyan-300">9M+</p>
              <p className="text-sm text-gray-400">{t("hero.statVacant")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-300">$0</p>
              <p className="text-sm text-gray-400">{t("hero.statPrice")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-300">47</p>
              <p className="text-sm text-gray-400">{t("hero.statPrefectures")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Japan */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            {t("whyJapan.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <span className="text-4xl mb-4 block">🌍</span>
              <h3 className="font-bold text-lg mb-2">{t("whyJapan.noRestrictions")}</h3>
              <p className="text-gray-600 text-sm">{t("whyJapan.noRestrictionsDesc")}</p>
            </div>
            <div className="text-center p-6">
              <span className="text-4xl mb-4 block">💰</span>
              <h3 className="font-bold text-lg mb-2">{t("whyJapan.affordable")}</h3>
              <p className="text-gray-600 text-sm">{t("whyJapan.affordableDesc")}</p>
            </div>
            <div className="text-center p-6">
              <span className="text-4xl mb-4 block">🏯</span>
              <h3 className="font-bold text-lg mb-2">{t("whyJapan.architecture")}</h3>
              <p className="text-gray-600 text-sm">{t("whyJapan.architectureDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary">{t("featured.title")}</h2>
            <Link href="/properties" className="text-accent hover:underline text-sm font-medium">
              {t("featured.viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Prefecture */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary">{t("browsePrefecture.title")}</h2>
            <Link href="/prefecture" className="text-accent hover:underline text-sm font-medium">
              {t("browsePrefecture.viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {["Hokkaido","Tokyo","Kyoto","Osaka","Nagano","Okinawa","Chiba","Shizuoka","Fukuoka","Kanagawa","Niigata","Hiroshima"].map((name) => (
              <Link key={name} href={`/prefecture/${name.toLowerCase()}`} className="bg-white rounded-lg p-3 text-center border border-gray-100 hover:border-accent hover:shadow-sm transition text-sm font-medium text-primary">
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Price */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">{t("browsePrice.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { href: "/price/free", label: t("browsePrice.free"), accent: true },
              { href: "/price/under-100k", label: t("browsePrice.under100k"), accent: false },
              { href: "/price/under-500k", label: t("browsePrice.under500k"), accent: false },
              { href: "/price/under-1m", label: t("browsePrice.under1m"), accent: false },
              { href: "/price/under-5m", label: t("browsePrice.under5m"), accent: false },
              { href: "/price/under-10m", label: t("browsePrice.under10m"), accent: false },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`rounded-lg p-4 text-center border transition font-semibold text-sm ${item.accent ? "bg-accent text-white border-accent hover:bg-red-600" : "bg-gray-50 text-primary border-gray-200 hover:border-accent"}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">{t("browseInvestment.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { slug: "high-value", emoji: "📈", label: t("browseInvestment.highValue"), desc: t("browseInvestment.highValueDesc") },
              { slug: "station-close", emoji: "🚉", label: t("browseInvestment.stationClose"), desc: t("browseInvestment.stationCloseDesc") },
              { slug: "airbnb-ready", emoji: "🏨", label: t("browseInvestment.airbnbReady"), desc: t("browseInvestment.airbnbReadyDesc") },
              { slug: "free-near-free", emoji: "🆓", label: t("browseInvestment.freeNearFree"), desc: t("browseInvestment.freeNearFreeDesc") },
              { slug: "move-in-ready", emoji: "🏗️", label: t("browseInvestment.moveInReady"), desc: t("browseInvestment.moveInReadyDesc") },
              { slug: "cultural-gem", emoji: "🏯", label: t("browseInvestment.culturalGem"), desc: t("browseInvestment.culturalGemDesc") },
            ].map((tag) => (
              <Link key={tag.slug} href={`/tag/${tag.slug}`} className="bg-white rounded-xl p-5 border border-gray-100 card-hover flex items-start gap-4">
                <span className="text-3xl">{tag.emoji}</span>
                <div>
                  <h3 className="font-bold text-primary">{tag.label}</h3>
                  <p className="text-sm text-gray-500">{tag.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">{t("howItWorksSection.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              { num: "1", title: t("howItWorksSection.step1Title"), desc: t("howItWorksSection.step1Desc") },
              { num: "2", title: t("howItWorksSection.step2Title"), desc: t("howItWorksSection.step2Desc") },
              { num: "3", title: t("howItWorksSection.step3Title"), desc: t("howItWorksSection.step3Desc") },
            ].map((step) => (
              <div key={step.num}>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent font-bold text-xl">{step.num}</span>
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/contact" className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition mt-10">
            {t("howItWorksSection.cta")}
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 hero-gradient text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("newsletter.title")}</h2>
          <p className="text-gray-300 mb-8">{t("newsletter.subtitle")}</p>
          <NewsletterForm />
          <p className="text-xs text-gray-400 mt-3">{t("newsletter.note")}</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
