import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoPropertyCard from "@/components/SeoPropertyCard";
import { Link } from "@/i18n/navigation";
import {
  INVESTMENT_TAG_PAGES,
  getPropertiesForTag,
} from "@/lib/scraped-properties";

export function generateStaticParams() {
  return INVESTMENT_TAG_PAGES.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const tagInfo = INVESTMENT_TAG_PAGES.find((t) => t.slug === params.slug);
  if (!tagInfo) return {};

  const properties = getPropertiesForTag(params.slug);
  const title = `${tagInfo.seoTitle} — ${properties.length} Properties | AkiyaFinder`;
  const description = `${tagInfo.seoDescription} ${properties.length} properties available.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `https://akiya-finder.vercel.app/tag/${params.slug}`,
    },
  };
}

export default function TagPage({ params }: { params: { slug: string } }) {
  const tagInfo = INVESTMENT_TAG_PAGES.find((t) => t.slug === params.slug);
  if (!tagInfo) return notFound();

  const properties = getPropertiesForTag(params.slug);
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
    name: tagInfo.seoTitle,
    description: tagInfo.seoDescription,
    url: `https://akiya-finder.vercel.app/tag/${params.slug}`,
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
            <span className="text-white">
              {tagInfo.emoji} {tagInfo.label}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {tagInfo.emoji} {tagInfo.label} Akiya
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-2">
            {tagInfo.description}
          </p>
          <p className="text-gray-400">
            {tagInfo.seoDescription}
          </p>

          <div className="flex flex-wrap gap-6 mt-6">
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {properties.length}
              </p>
              <p className="text-sm text-gray-400">Properties</p>
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

      {/* Tag Navigation */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {INVESTMENT_TAG_PAGES.map((t) => (
              <Link
                key={t.slug}
                href={`/tag/${t.slug}`}
                className={`text-sm px-4 py-2 rounded-full transition ${
                  t.slug === params.slug
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.emoji} {t.label}
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
              Top Locations for {tagInfo.label}
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
            {properties.length} {tagInfo.label} Properties
          </h2>
          {sorted.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No properties found with this tag. Try browsing{" "}
              <Link href="/prefecture" className="text-accent hover:underline">
                by prefecture
              </Link>{" "}
              instead.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((property) => (
                <SeoPropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Ready to Invest?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team connects you with licensed agents across Japan. Free
            consultation, no obligation.
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
