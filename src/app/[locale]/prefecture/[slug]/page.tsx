import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoPropertyCard from "@/components/SeoPropertyCard";
import { Link } from "@/i18n/navigation";
import {
  getAllPrefectureSlugs,
  getPropertiesForPrefecture,
  getPrefectureDisplayName,
  getMinPrice,
  getMinPriceUsd,
  ScrapedProperty,
} from "@/lib/scraped-properties";
import { getPrefectureSeoData } from "@/lib/prefecture-seo";

export function generateStaticParams() {
  return getAllPrefectureSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const { slug } = params;
  const displayName = getPrefectureDisplayName(slug);
  if (!displayName) return {};

  const properties = getPropertiesForPrefecture(slug);
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
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const displayName = getPrefectureDisplayName(slug);
  if (!displayName) return notFound();

  const properties = getPropertiesForPrefecture(slug);
  if (properties.length === 0) return notFound();

  const seoData = getPrefectureSeoData(slug, displayName, properties.length);
  const minPrice = getMinPrice(properties);
  const minPriceUsd = getMinPriceUsd(properties);
  const freeCount = properties.filter((p) => p.price === 0).length;

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
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/prefecture" className="hover:text-white">
              Prefectures
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{displayName}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Akiya Houses in {displayName}
            {seoData.nameJa && (
              <span className="text-lg md:text-xl text-gray-400 ml-3">
                ({seoData.nameJa})
              </span>
            )}
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {seoData.description}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {properties.length}
              </p>
              <p className="text-sm text-gray-400">Properties</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {minPrice === 0
                  ? "FREE"
                  : `¥${minPrice.toLocaleString()}`}
              </p>
              <p className="text-sm text-gray-400">Starting Price</p>
            </div>
            {freeCount > 0 && (
              <div>
                <p className="text-2xl font-bold text-cyan-300">{freeCount}</p>
                <p className="text-sm text-gray-400">Free Properties</p>
              </div>
            )}
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {seoData.region}
              </p>
              <p className="text-sm text-gray-400">Region</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & Investment Points */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
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
          <div>
            <h2 className="text-xl font-bold text-primary mb-4">
              Investment Points
            </h2>
            <ul className="space-y-2">
              {seoData.investmentPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="text-green-500 mt-0.5">💰</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary mb-6">
            {properties.length} Properties in {displayName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((property) => (
              <SeoPropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Interested in {displayName} Properties?
          </h2>
          <p className="text-gray-600 mb-6">
            We connect you with licensed English-speaking agents in{" "}
            {displayName} who can arrange viewings, handle negotiations, and
            guide you through the purchase process.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Get Connected — Free
            </Link>
            <Link
              href="/prefecture"
              className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Browse Other Prefectures
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
