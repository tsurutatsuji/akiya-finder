import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoPropertyCard from "@/components/SeoPropertyCard";
import Link from "next/link";
import {
  PRICE_RANGES,
  getPropertiesForPriceRange,
} from "@/lib/scraped-properties";

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

export default function PricePage({ params }: { params: { slug: string } }) {
  const range = PRICE_RANGES.find((r) => r.slug === params.slug);
  if (!range) return notFound();

  const properties = getPropertiesForPriceRange(params.slug);
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
    url: `https://akiya-finder.vercel.app/price/${params.slug}`,
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
          item: `https://akiya-finder.vercel.app/price/${params.slug}`,
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
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{range.label}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {range.slug === "free"
              ? "Free Akiya Houses in Japan"
              : `Akiya Houses ${range.label}`}
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {range.descriptionTemplate.replace(
              "{count}",
              String(properties.length)
            )}
          </p>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {properties.length}
              </p>
              <p className="text-sm text-gray-400">Properties Found</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {Object.keys(prefectureCounts).length}
              </p>
              <p className="text-sm text-gray-400">Prefectures</p>
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
                  r.slug === params.slug
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
              Top Prefectures in This Price Range
            </h2>
            <div className="flex flex-wrap gap-2">
              {topPrefectures.map(([name, count]) => (
                <Link
                  key={name}
                  href={`/prefecture/${name.toLowerCase()}`}
                  className="bg-white text-sm px-4 py-2 rounded-full border border-gray-200 hover:border-accent transition"
                >
                  {name}{" "}
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
          <h2 className="text-2xl font-bold text-primary mb-6">
            {properties.length} Properties — {range.label}
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
            Found Something Interesting?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us for a free consultation. We'll connect you with a
            licensed agent who speaks English and can help you purchase any of
            these properties.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Get Started — Free
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
