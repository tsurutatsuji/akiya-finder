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
import { L, getPrefectureName } from "@/lib/locale-utils";

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

// 投資タグの3言語ラベル
const TAG_LABELS: Record<string, { zh: string; ja: string; en: string }> = {
  "high-value": { zh: "高性价比", ja: "高コスパ", en: "High Value" },
  "station-close": { zh: "近车站", ja: "駅近", en: "Station Close" },
  "airbnb-ready": { zh: "适合民泊", ja: "民泊向き", en: "Airbnb Ready" },
  "free-near-free": { zh: "免费/近免费", ja: "無料/ほぼ無料", en: "Free / Near-Free" },
  "move-in-ready": { zh: "可直接入住", ja: "即入居可", en: "Move-in Ready" },
  "cultural-gem": { zh: "文化遗产", ja: "文化財", en: "Cultural Gem" },
};

const TAG_DESCRIPTIONS: Record<string, { zh: string; ja: string; en: string }> = {
  "high-value": {
    zh: "每平米价格最低——性价比最高",
    ja: "㎡あたりの単価が低い——最もコスパの高い物件",
    en: "Low price per sqm - best value for your budget",
  },
  "station-close": {
    zh: "步行10分钟内可达车站——生活便利",
    ja: "駅から徒歩10分以内——生活に便利",
    en: "Within 10 minute walk to a train station - convenient daily life",
  },
  "airbnb-ready": {
    zh: "位于旅游区＋面积宽敞",
    ja: "観光地＋広い面積",
    en: "Tourist area + spacious",
  },
  "free-near-free": {
    zh: "¥0~¥150,000（~$0-$1,000）——超低价格で手に入る",
    ja: "¥0〜¥150,000（~$0-$1,000）——超低価格で手に入る",
    en: "¥0 to ¥150,000 (~$0-$1,000) - incredibly affordable",
  },
  "move-in-ready": {
    zh: "筑30年以内或坚固结构——翻新成本低",
    ja: "築30年以内または堅牢な構造——リフォーム費用が低い",
    en: "Under 30 years old or solid structure - low renovation cost",
  },
  "cultural-gem": {
    zh: "历史街区的町屋、古民家——日本传统建筑之美",
    ja: "歴史地区の町家・古民家——日本の伝統建築",
    en: "Machiya, kominka in historic areas - traditional Japanese architecture",
  },
};

// 自治体許可取得のため投資関連タグを非表示（将来復活可能）
const HIDDEN_TAG_SLUGS = ["high-value", "airbnb-ready"];

export default function TagPage({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;
  const tagInfo = INVESTMENT_TAG_PAGES.find((t) => t.slug === slug);
  if (!tagInfo) return notFound();
  // 投資色の強いタグは非表示
  if (HIDDEN_TAG_SLUGS.includes(slug)) return notFound();

  const properties = getPropertiesForTag(slug);
  const sorted = [...properties].sort((a, b) => a.price - b.price);
  const tagLabel = TAG_LABELS[slug] || { zh: tagInfo.label, ja: tagInfo.label, en: tagInfo.label };
  const tagDesc = TAG_DESCRIPTIONS[slug] || { zh: tagInfo.description, ja: tagInfo.description, en: tagInfo.description };
  const displayLabel = L(locale, tagLabel.zh, tagLabel.ja, tagLabel.en);
  const displayDesc = L(locale, tagDesc.zh, tagDesc.ja, tagDesc.en);

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
    url: `https://akiya-finder.vercel.app/tag/${slug}`,
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
              {L(locale, "首页", "ホーム", "Home")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">
              {tagInfo.emoji} {displayLabel}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {tagInfo.emoji} {L(
              locale,
              `${displayLabel}空き家`,
              `${displayLabel}の空き家`,
              `${tagInfo.label} Akiya`
            )}
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-2">
            {displayDesc}
          </p>
          <p className="text-gray-400">
            {tagInfo.seoDescription}
          </p>

          <div className="flex flex-wrap gap-6 mt-6">
            <div>
              <p className="text-2xl font-bold text-cyan-300">
                {properties.length}
              </p>
              <p className="text-sm text-gray-400">{L(locale, "套房产", "物件数", "Properties")}</p>
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

      {/* Tag Navigation */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {INVESTMENT_TAG_PAGES.map((t) => {
              const tLabel = TAG_LABELS[t.slug] || { zh: t.label, ja: t.label, en: t.label };
              return (
                <Link
                  key={t.slug}
                  href={`/tag/${t.slug}`}
                  className={`text-sm px-4 py-2 rounded-full transition ${
                    t.slug === slug
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.emoji} {L(locale, tLabel.zh, tLabel.ja, tLabel.en)}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Prefectures */}
      {topPrefectures.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-lg font-bold text-primary mb-4">
              {L(
                locale,
                `${displayLabel}的热门地区`,
                `${displayLabel}の人気エリア`,
                `Top Locations for ${tagInfo.label}`
              )}
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
          <h2 className="text-2xl font-bold text-primary mb-6">
            {L(
              locale,
              `${properties.length} 套${displayLabel}物件`,
              `${displayLabel}物件 ${properties.length} 件`,
              `${properties.length} ${tagInfo.label} Properties`
            )}
          </h2>
          {sorted.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              {L(
                locale,
                "未找到此标签的房产。请尝试",
                "このタグの物件が見つかりませんでした。",
                "No properties found with this tag. Try browsing"
              )}{" "}
              <Link href="/prefecture" className="text-accent hover:underline">
                {L(locale, "按都道府县浏览", "都道府県から探す", "by prefecture")}
              </Link>{" "}
              {L(locale, "", "", "instead.")}
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
            {L(locale, "感兴趣吗？", "気になる物件はありましたか？", "Found Something You Like?")}
          </h2>
          <p className="text-gray-600 mb-6">
            {L(
              locale,
              "我们为您对接日本全国的持牌经纪人。免费咨询，无任何义务。",
              "日本全国の認可不動産業者をご紹介します。無料相談、義務なし。",
              "Our team connects you with licensed agents across Japan. Free consultation, no obligation."
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
