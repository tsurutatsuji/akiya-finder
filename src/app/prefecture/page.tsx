import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  scrapedProperties,
  getPropertiesByPrefecture,
  getMinPrice,
  getMinPriceUsd,
} from "@/lib/scraped-properties";
import { PREFECTURE_SEO_DATA } from "@/lib/prefecture-seo";
import { PREFECTURE_COORDS } from "@/lib/prefecture-coords";

export const metadata: Metadata = {
  title:
    "Browse Akiya Houses by Prefecture | All 47 Prefectures | AkiyaFinder",
  description:
    "Find affordable akiya (vacant houses) across all 47 prefectures of Japan. Browse by region — from Hokkaido to Okinawa. 901+ properties from $0.",
  openGraph: {
    title: "Browse Akiya Houses by Prefecture | AkiyaFinder",
    description:
      "Explore akiya properties across all 47 Japanese prefectures. From free houses in rural areas to machiya in Kyoto.",
  },
};

// 地方ごとのグループ分け
const REGIONS: { name: string; prefectures: string[] }[] = [
  {
    name: "Hokkaido",
    prefectures: ["Hokkaido"],
  },
  {
    name: "Tohoku",
    prefectures: [
      "Aomori",
      "Iwate",
      "Miyagi",
      "Akita",
      "Yamagata",
      "Fukushima",
    ],
  },
  {
    name: "Kanto",
    prefectures: [
      "Ibaraki",
      "Tochigi",
      "Gunma",
      "Saitama",
      "Chiba",
      "Tokyo",
      "Kanagawa",
    ],
  },
  {
    name: "Chubu",
    prefectures: [
      "Niigata",
      "Toyama",
      "Ishikawa",
      "Fukui",
      "Yamanashi",
      "Nagano",
      "Gifu",
      "Shizuoka",
      "Aichi",
    ],
  },
  {
    name: "Kansai",
    prefectures: [
      "Mie",
      "Shiga",
      "Kyoto",
      "Osaka",
      "Hyogo",
      "Nara",
      "Wakayama",
    ],
  },
  {
    name: "Chugoku",
    prefectures: ["Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi"],
  },
  {
    name: "Shikoku",
    prefectures: ["Tokushima", "Kagawa", "Ehime", "Kochi"],
  },
  {
    name: "Kyushu & Okinawa",
    prefectures: [
      "Fukuoka",
      "Saga",
      "Nagasaki",
      "Kumamoto",
      "Oita",
      "Miyazaki",
      "Kagoshima",
      "Okinawa",
    ],
  },
];

export default function PrefectureIndex() {
  const grouped = getPropertiesByPrefecture();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Browse Akiya Houses by Prefecture",
    description:
      "Find affordable akiya across all 47 prefectures of Japan.",
    url: "https://akiya-finder.vercel.app/prefecture",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: Object.keys(grouped).length,
      itemListElement: Object.entries(grouped).map(([name, props], i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Akiya Houses in ${name}`,
        url: `https://akiya-finder.vercel.app/prefecture/${name.toLowerCase()}`,
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
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Browse Akiya by Prefecture
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore {scrapedProperties.length}+ affordable akiya houses across
            all 47 prefectures of Japan. From free houses in rural Tohoku to
            traditional machiya in Kyoto.
          </p>
        </div>
      </section>

      {/* Region Grid */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        {REGIONS.map((region) => (
          <div key={region.name} className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6 border-b border-gray-200 pb-2">
              {region.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {region.prefectures.map((prefName) => {
                const props = grouped[prefName] || [];
                const slug = prefName.toLowerCase();
                const seo = PREFECTURE_SEO_DATA[slug];
                const minPrice = getMinPrice(props);
                const minPriceUsd = getMinPriceUsd(props);

                return (
                  <Link
                    key={prefName}
                    href={`/prefecture/${slug}`}
                    className="bg-white rounded-xl p-5 border border-gray-100 card-hover block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-primary text-lg">
                        {prefName}
                      </h3>
                      <span className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-full">
                        {props.length} listings
                      </span>
                    </div>
                    {seo && (
                      <p className="text-xs text-gray-400 mb-2">{seo.nameJa}</p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {seo?.description.slice(0, 100) ||
                        `Browse ${props.length} akiya in ${prefName}`}
                      ...
                    </p>
                    <div className="text-sm">
                      <span className="text-accent font-semibold">
                        From{" "}
                        {minPrice === 0
                          ? "FREE (¥0)"
                          : `¥${minPrice.toLocaleString()}`}
                      </span>
                      <span className="text-gray-400 ml-1">
                        (~${minPriceUsd.toLocaleString()})
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-gray-600 mb-6">
            Use our interactive investment map to explore all{" "}
            {scrapedProperties.length}+ properties with price per sqm,
            station access, and Airbnb potential metrics.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/map"
              className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Open Investment Map
            </Link>
            <Link
              href="/price/free"
              className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5 transition"
            >
              Browse Free Properties
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
