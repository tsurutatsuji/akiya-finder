import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import {
  scrapedProperties,
  getPropertiesByPrefecture,
  getMinPrice,
  getMinPriceUsd,
} from "@/lib/scraped-properties";
import { PREFECTURE_SEO_DATA } from "@/lib/prefecture-seo";
import { L, PREF_NAMES, REGION_NAMES } from "@/lib/locale-utils";

export const metadata: Metadata = {
  title:
    "Browse Akiya Houses by Prefecture | All 47 Prefectures | AkiyaFinder",
  description:
    "Find affordable akiya (vacant houses) across all 47 prefectures of Japan. Browse by region — from Hokkaido to Okinawa. 4,335+ properties from $0.",
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

export default function PrefectureIndex({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
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
            {L(locale, "按都道府县浏览空き家", "都道府県から空き家を探す", "Browse Akiya by Prefecture")}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {L(
              locale,
              `日本全国47个都道府县共有 ${scrapedProperties.length}+ 套低价空き家。从北海道到冲绳，从免费房屋到传统町屋。`,
              `日本全国47都道府県から ${scrapedProperties.length} 件以上の空き家を掲載。北海道から沖縄まで、無料物件から伝統的な町家まで。`,
              `Explore ${scrapedProperties.length}+ affordable akiya houses across all 47 prefectures of Japan. From free houses in rural Tohoku to traditional machiya in Kyoto.`
            )}
          </p>
        </div>
      </section>

      {/* Region Grid */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        {REGIONS.map((region) => {
          const regionName = REGION_NAMES[region.name];
          const displayRegionName = regionName
            ? (locale === "zh" ? regionName.zh : locale === "ja" ? regionName.ja : regionName.en)
            : region.name;

          return (
            <div key={region.name} className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-6 border-b border-gray-200 pb-2">
                {displayRegionName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {region.prefectures.map((prefName) => {
                  const props = grouped[prefName] || [];
                  const slug = prefName.toLowerCase();
                  const seo = PREFECTURE_SEO_DATA[slug];
                  const minPrice = getMinPrice(props);
                  const minPriceUsd = getMinPriceUsd(props);
                  const prefNames = PREF_NAMES[slug];
                  const displayName = prefNames
                    ? (locale === "zh" ? prefNames.zh : locale === "ja" ? prefNames.ja : prefNames.en)
                    : prefName;

                  return (
                    <Link
                      key={prefName}
                      href={`/prefecture/${slug}`}
                      className="bg-white rounded-xl p-5 border border-gray-100 card-hover block"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-primary text-lg">
                          {displayName}
                        </h3>
                        <span className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-full">
                          {props.length} {L(locale, "套", "件", "listings")}
                        </span>
                      </div>
                      {locale === "en" && seo && (
                        <p className="text-xs text-gray-400 mb-2">{seo.nameJa}</p>
                      )}
                      {locale !== "en" && (
                        <p className="text-xs text-gray-400 mb-2">{prefName}</p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {locale === "en"
                          ? (seo?.description.slice(0, 100) || `Browse ${props.length} akiya in ${prefName}`) + "..."
                          : L(
                              locale,
                              `${displayName}的 ${props.length} 套空き家`,
                              `${displayName}の空き家 ${props.length} 件`,
                              `Browse ${props.length} akiya in ${prefName}`
                            )}
                      </p>
                      <div className="text-sm">
                        <span className="text-accent font-semibold">
                          {L(locale, "最低 ", "最安 ", "From ")}{" "}
                          {minPrice === 0
                            ? L(locale, "免费（¥0）", "無料（¥0）", "FREE (¥0)")
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
          );
        })}
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {L(locale, "不知道从哪里开始？", "どこから始めればいいかわからない？", "Not Sure Where to Start?")}
          </h2>
          <p className="text-gray-600 mb-6">
            {L(
              locale,
              `使用我们的交互式地图浏览全部 ${scrapedProperties.length}+ 套房产，查看位置、价格、车站距离等信息。`,
              `地図で ${scrapedProperties.length} 件以上の物件を閲覧。場所・価格・駅距離などの情報付き。`,
              `Use our interactive map to explore all ${scrapedProperties.length}+ properties with location, price, and station access information.`
            )}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/map"
              className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              {L(locale, "地图找房", "地図で探す", "Open Property Map")}
            </Link>
            <Link
              href="/price/free"
              className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5 transition"
            >
              {L(locale, "浏览免费房产", "無料物件を見る", "Browse Free Properties")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
