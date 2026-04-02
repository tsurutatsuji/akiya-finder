import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaginatedPropertyList from "@/components/PaginatedPropertyList";
import { Link } from "@/i18n/navigation";
import {
  PRICE_RANGES,
  getPropertiesForPriceRange,
} from "@/lib/scraped-properties";
import { L, getPrefectureName } from "@/lib/locale-utils";

export function generateStaticParams() {
  return PRICE_RANGES.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const range = PRICE_RANGES.find((r) => r.slug === params.slug);
  if (!range) return {};

  const properties = getPropertiesForPriceRange(params.slug);
  const title = `${range.label} — ${properties.length} Akiya Houses in Japan | AkiyaFinder`;
  const description = range.descriptionTemplate.replace(
    "{count}",
    String(properties.length)
  );

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `https://akiya-finder.vercel.app/price/${params.slug}`,
    },
  };
}

// 価格帯の3言語ラベル
const PRICE_LABELS: Record<string, { zh: string; ja: string; en: string }> = {
  "free": { zh: "免费 (¥0)", ja: "無料 (¥0)", en: "Free Akiya Houses (¥0)" },
  "under-100k": { zh: "¥10万以下", ja: "¥10万以下", en: "Under ¥100,000 (~$670)" },
  "under-500k": { zh: "¥50万以下", ja: "¥50万以下", en: "Under ¥500,000 (~$3,300)" },
  "under-1m": { zh: "¥100万以下", ja: "¥100万以下", en: "Under ¥1,000,000 (~$6,700)" },
  "under-5m": { zh: "¥500万以下", ja: "¥500万以下", en: "Under ¥5,000,000 (~$33,000)" },
  "under-10m": { zh: "¥1000万以下", ja: "¥1000万以下", en: "Under ¥10,000,000 (~$67,000)" },
};

function getPriceDescription(slug: string, count: number, locale: string): string {
  const descriptions: Record<string, { zh: string; ja: string; en: string }> = {
    "free": {
      zh: `日本全国${count}套完全免费的空き家。通过自治体的空き家バンク制度，0日元即可获得。`,
      ja: `日本全国${count}件の無料空き家。自治体の空き家バンク制度で、¥0で取得可能です。`,
      en: `Discover ${count} completely free abandoned houses (akiya) in Japan. These properties are offered at ¥0 through municipal akiya bank programs.`,
    },
    "under-100k": {
      zh: `日本${count}套超低价空き家，价格低于¥100,000（约$670）。`,
      ja: `日本全国${count}件の超低価格空き家。¥100,000（約$670）以下。`,
      en: `Find ${count} ultra-cheap akiya houses in Japan under ¥100,000 (~$670 USD).`,
    },
    "under-500k": {
      zh: `日本${count}套实惠空き家，价格低于¥500,000（约$3,300）。适合翻新项目。`,
      ja: `日本全国${count}件のお手頃な空き家。¥500,000（約$3,300）以下。リノベーションにも最適。`,
      en: `Browse ${count} affordable akiya houses in Japan under ¥500,000 (~$3,300 USD). Great value properties for renovation projects.`,
    },
    "under-1m": {
      zh: `日本${count}套空き家，价格低于¥1,000,000（约$6,700）。`,
      ja: `日本全国${count}件の空き家。¥1,000,000（約$6,700）以下。`,
      en: `Find ${count} akiya houses in Japan under ¥1,000,000 (~$6,700 USD).`,
    },
    "under-5m": {
      zh: `日本${count}套空き家，价格低于¥5,000,000（约$33,000）。`,
      ja: `日本全国${count}件の空き家。¥5,000,000（約$33,000）以下。`,
      en: `Find ${count} akiya houses in Japan under ¥5,000,000 (~$33,000 USD).`,
    },
    "under-10m": {
      zh: `日本${count}套空き家，价格低于¥10,000,000（约$67,000）。`,
      ja: `日本全国${count}件の空き家。¥10,000,000（約$67,000）以下。`,
      en: `Find ${count} akiya houses in Japan under ¥10,000,000 (~$67,000 USD).`,
    },
  };
  const desc = descriptions[slug];
  if (!desc) return "";
  return L(locale, desc.zh, desc.ja, desc.en);
}

export default function PricePage({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;
  const range = PRICE_RANGES.find((r) => r.slug === slug);
  if (!range) return notFound();

  const properties = getPropertiesForPriceRange(slug);
  const sorted = [...properties].sort((a, b) => a.price - b.price);

  // 都道府県別の集計
  const prefectureCounts: Record<string, number> = {};
  properties.forEach((p) => {
    const key = p.prefectureEn;
    if (key) prefectureCounts[key] = (prefectureCounts[key] || 0) + 1;
  });
  const topPrefectures = Object.entries(prefectureCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${range.label} Akiya Houses in Japan`,
    description: range.descriptionTemplate.replace(
      "{count}",
      String(properties.length)
    ),
    url: `https://akiya-finder.vercel.app/price/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: properties.length,
      itemListElement: sorted.slice(0, 10).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "RealEstateListing",
          name: `Akiya in ${p.location}`,
          url: `https://akiya-finder.vercel.app/properties/${p.id}`,
          price: p.price,
          priceCurrency: "JPY",
        },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://akiya-finder.vercel.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Price Ranges",
          item: "https://akiya-finder.vercel.app/price/free",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: range.label,
          item: `https://akiya-finder.vercel.app/price/${slug}`,
        },
      ],
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="hero-gradient text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">
              {L(locale, "首页", "ホーム", "Home")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{L(locale, (PRICE_LABELS[slug] || {}).zh || range.label, (PRICE_LABELS[slug] || {}).ja || range.label, range.label)}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {slug === "free"
              ? L(locale, "日本免费空き家", "無料の空き家", "Free Akiya Houses in Japan")
              : L(
                  locale,
                  `${(PRICE_LABELS[slug] || {}).zh || range.label} 空き家`,
                  `${(PRICE_LABELS[slug] || {}).ja || range.label} の空き家`,
                  `Akiya Houses ${range.label}`
                )}
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {getPriceDescription(slug, properties.length, locale)}
          </p>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {properties.length}
              </p>
              <p className="text-sm text-gray-400">{L(locale, "找到房产", "物件数", "Properties Found")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {Object.keys(prefectureCounts).length}
              </p>
              <p className="text-sm text-gray-400">{L(locale, "都道府县", "都道府県", "Prefectures")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Price Range Navigation */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGES.map((r) => (
              <Link
                key={r.slug}
                href={`/price/${r.slug}`}
                className={`text-sm px-4 py-2 rounded-full transition ${
                  r.slug === slug
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {r.labelShort}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Prefectures */}
      {topPrefectures.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-lg font-bold text-primary mb-4">
              {L(locale, "该价格区间热门都道府县", "この価格帯の人気都道府県", "Top Prefectures in This Price Range")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {topPrefectures.map(([name, count]) => (
                <Link
                  key={name}
                  href={`/prefecture/${name.toLowerCase()}`}
                  className="bg-white text-sm px-4 py-2 rounded-full border border-gray-200 hover:border-accent transition"
                >
                  {getPrefectureName(name.toLowerCase(), locale)}{" "}
                  <span className="text-gray-400">({count})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Property Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <PaginatedPropertyList
            properties={sorted}
            heading={L(
              locale,
              `${properties.length} 套房产 — ${range.label}`,
              `${properties.length} 件の物件 — ${range.label}`,
              `${properties.length} Properties — ${range.label}`
            )}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {L(locale, "找到感兴趣的房产？", "気になる物件がありましたか？", "Found Something Interesting?")}
          </h2>
          <p className="text-gray-600 mb-6">
            {L(
              locale,
              "联系我们获取免费咨询。我们将为您对接持牌经纪人协助购买。",
              "無料相談をご利用ください。認可不動産業者をご紹介し、購入をサポートします。",
              "Contact us for a free consultation. We'll connect you with a licensed agent who speaks English and can help you purchase any of these properties."
            )}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            {L(locale, "免费开始", "無料で始める", "Get Started — Free")}
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
