import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaginatedPropertyList from "@/components/PaginatedPropertyList";
import { Link } from "@/i18n/navigation";
import {
  getAllPrefectureSlugsAll,
  getPropertiesForPrefecture,
  getPropertiesForPrefectureAll,
  getPrefectureDisplayName,
  getPrefectureDisplayNameAll,
  getMinPrice,
  getMinPriceUsd,
  PREVIEW_KEY,
} from "@/lib/scraped-properties";
import { getPrefectureSeoData } from "@/lib/prefecture-seo";
import { L, getPrefectureName } from "@/lib/locale-utils";

export function generateStaticParams() {
  return getAllPrefectureSlugsAll().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { preview?: string };
}): Metadata {
  const { slug } = params;
  const isPreview = searchParams.preview === PREVIEW_KEY;
  const displayName = isPreview ? getPrefectureDisplayNameAll(slug) : getPrefectureDisplayName(slug);
  if (!displayName) return {};

  const properties = isPreview ? getPropertiesForPrefectureAll(slug) : getPropertiesForPrefecture(slug);
  const minPrice = getMinPrice(properties);
  const minPriceUsd = getMinPriceUsd(properties);

  const title = `Akiya Houses in ${displayName}, Japan | ${properties.length} Properties | AkiyaFinder`;
  const description = `Find ${properties.length} affordable abandoned houses (akiya) in ${displayName}, Japan. Prices from ${
    minPrice === 0 ? "FREE (¥0)" : `¥${minPrice.toLocaleString()}`
  } (~$${minPriceUsd.toLocaleString()} USD). Browse with investment metrics, photos, and agent matching.`;

  return {
    title,
    description,
    openGraph: {
      title: `${properties.length} Akiya Houses in ${displayName} | AkiyaFinder`,
      description,
    },
    alternates: {
      canonical: `https://akiya-finder.vercel.app/prefecture/${slug}`,
    },
  };
}

export default function PrefecturePage({
  params,
  searchParams,
}: {
  params: { slug: string; locale: string };
  searchParams: { preview?: string };
}) {
  const { slug, locale } = params;
  const isPreview = searchParams.preview === PREVIEW_KEY;

  const displayName = isPreview ? getPrefectureDisplayNameAll(slug) : getPrefectureDisplayName(slug);
  if (!displayName) return notFound();

  const properties = isPreview ? getPropertiesForPrefectureAll(slug) : getPropertiesForPrefecture(slug);
  if (properties.length === 0) return notFound();

  const seoData = getPrefectureSeoData(slug, displayName, properties.length);
  const minPrice = getMinPrice(properties);
  const minPriceUsd = getMinPriceUsd(properties);
  const freeCount = properties.filter((p) => p.price === 0).length;
  const localeName = getPrefectureName(slug, locale);

  // 価格順でソート（安い順）
  const sorted = [...properties].sort((a, b) => a.price - b.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Akiya Houses in ${displayName}, Japan`,
    description: seoData.description,
    url: `https://akiya-finder.vercel.app/prefecture/${slug}`,
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
          name: "Prefectures",
          item: "https://akiya-finder.vercel.app/prefecture",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: displayName,
          item: `https://akiya-finder.vercel.app/prefecture/${slug}`,
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
          {/* Breadcrumb */}
          <div className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">
              {L(locale, "首页", "ホーム", "Home")}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/prefecture" className="hover:text-white">
              {L(locale, "都道府县", "都道府県", "Prefectures")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{localeName}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {L(
              locale,
              `${localeName}的空房`,
              `${localeName}の空き家`,
              `Akiya Houses in ${displayName}`
            )}
            {locale === "en" && seoData.nameJa && (
              <span className="text-lg md:text-xl text-gray-400 ml-3">
                ({seoData.nameJa})
              </span>
            )}
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {L(
              locale,
              `${localeName}共有${properties.length}套空房。${minPrice === 0 ? "含免费物件。" : `最低价¥${minPrice.toLocaleString()}起。`}我们为您介绍当地的不动产公司。`,
              `${localeName}の空き家${properties.length}件を掲載中。${minPrice === 0 ? "無料物件あり。" : `最安値¥${minPrice.toLocaleString()}から。`}現地の不動産会社をご紹介します。`,
              seoData.description
            )}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {properties.length}
              </p>
              <p className="text-sm text-gray-400">{L(locale, "套房产", "物件数", "Properties")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {minPrice === 0
                  ? L(locale, "免费", "無料", "FREE")
                  : `¥${minPrice.toLocaleString()}`}
              </p>
              <p className="text-sm text-gray-400">{L(locale, "最低价格", "最安価格", "Starting Price")}</p>
            </div>
            {freeCount > 0 && (
              <div>
                <p className="text-2xl font-bold text-cyan-300">{freeCount}</p>
                <p className="text-sm text-gray-400">{L(locale, "免费房产", "無料物件", "Free Properties")}</p>
              </div>
            )}
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {seoData.region}
              </p>
              <p className="text-sm text-gray-400">{L(locale, "地区", "地方", "Region")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights (English only — SEOデータが英語のため) */}
      {locale === "en" && (
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div>
            <h2 className="text-xl font-bold text-primary mb-4">
              Why {displayName}?
            </h2>
            <ul className="space-y-2">
              {seoData.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Investment Points — 自治体許可取得のため非表示（将来復活可能） */}
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
              `${localeName} ${properties.length} 套房产`,
              `${localeName}の物件 ${properties.length} 件`,
              `${properties.length} Properties in ${displayName}`
            )}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {L(
              locale,
              `对${localeName}的房产感兴趣？`,
              `${localeName}の物件に興味がありますか？`,
              `Interested in ${displayName} Properties?`
            )}
          </h2>
          <p className="text-gray-600 mb-6">
            {L(
              locale,
              `我们为您对接当地持牌的房产经纪人，提供看房、谈判及购买全程支持。`,
              `現地の不動産会社をご紹介します。内覧・交渉・購入手続きをサポートします。`,
              `We connect you with licensed English-speaking agents in ${displayName} who can arrange viewings, handle negotiations, and guide you through the purchase process.`
            )}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              {L(locale, "免费咨询", "無料相談する", "Get Connected — Free")}
            </Link>
            <Link
              href="/prefecture"
              className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              {L(locale, "浏览其他都道府县", "他の都道府県を見る", "Browse Other Prefectures")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
