import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { properties as manualProperties, Property } from "@/data/properties";
import {
  scrapedProperties,
  ScrapedProperty,
} from "@/lib/scraped-properties";
import {
  getInvestmentTags,
  calculatePricePerSqm,
  calculateAge,
  parseWalkingMinutes,
  INVESTMENT_CATEGORIES,
} from "@/lib/investment-tags";
import { Link } from "@/i18n/navigation";
import { getDisplayImageUrl } from "@/lib/image-utils";
import ImageGallery, { ShareButtons } from "@/components/ImageGallery";
import MapStreetViewTabs from "@/components/MapStreetViewTabs";
import ViewHistoryTracker from "@/components/ViewHistoryTracker";
import StickyContactBar from "@/components/StickyContactBar";
import WatchlistButton from "@/components/WatchlistButton";

// --- Unified type ---
type UnifiedProperty =
  | { kind: "manual"; data: Property }
  | { kind: "scraped"; data: ScrapedProperty };

function findProperty(id: string): UnifiedProperty | null {
  const manual = manualProperties.find((p) => p.id === id);
  if (manual) return { kind: "manual", data: manual };
  const scraped = scrapedProperties.find((p) => p.id === id);
  if (scraped) return { kind: "scraped", data: scraped };
  return null;
}

// --- Static Params ---
export function generateStaticParams() {
  const manualIds = manualProperties.map((p) => ({ id: p.id }));
  const scrapedIds = scrapedProperties.map((p) => ({ id: p.id }));
  return [...manualIds, ...scrapedIds];
}

// --- SEO Metadata ---
export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const unified = findProperty(params.id);
  if (!unified) return { title: "Property Not Found | AkiyaFinder" };

  if (unified.kind === "manual") {
    const p = unified.data;
    return {
      title: `${p.title} | AkiyaFinder`,
      description: p.description.slice(0, 160),
    };
  }

  const p = unified.data;
  const priceYen =
    p.price === 0 ? "FREE" : `¥${p.price.toLocaleString()}`;
  const priceUsdVal = p.priceUsd ?? Math.round(p.price / 150);
  const priceUsd =
    priceUsdVal === 0 ? "$0" : `$${priceUsdVal.toLocaleString()}`;

  const title = `Akiya in ${p.location} - ${priceYen} | AkiyaFinder`;
  const description = `${p.layout || ""} ${p.propertyType} in ${p.location}. ${priceYen} (${priceUsd} USD). Building: ${p.buildingArea}, Land: ${p.landArea}. Browse 900+ akiya houses on AkiyaFinder.`.trim();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: p.thumbnailUrl ? [p.thumbnailUrl] : undefined,
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: title,
        description,
        url: `https://akiyafinder.com/properties/${p.id}`,
        image: p.thumbnailUrl || undefined,
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "JPY",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: p.location,
          addressRegion: p.prefectureEn,
          addressCountry: "JP",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: p.lat,
          longitude: p.lng,
        },
      }),
    },
  };
}

// --- Page ---
export default function PropertyDetail({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const unified = findProperty(params.id);
  if (!unified) return notFound();

  if (unified.kind === "manual") {
    return <ManualPropertyPage property={unified.data} />;
  }
  return <ScrapedPropertyPage property={unified.data} locale={params.locale} />;
}

// ============================================================
// Manual property display (akiya-001~020)
// ============================================================
function ManualPropertyPage({ property }: { property: Property }) {
  const priceDisplay =
    property.price === 0
      ? "FREE (¥0)"
      : `¥${property.price.toLocaleString()}`;
  const usdDisplay =
    property.priceUsd === 0
      ? "$0 USD"
      : `~$${property.priceUsd.toLocaleString()} USD`;

  return (
    <>
      <Header />
      <ViewHistoryTracker
        id={property.id}
        title={property.title}
        price={property.price}
        location={property.location}
        thumbnailUrl={null}
      />
      <div className="max-w-4xl mx-auto px-4 py-10 pb-sticky-contact">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/properties" className="hover:text-accent">
            Properties
          </Link>
          <span className="mx-2">/</span>
          <span>{property.location}</span>
        </div>

        {/* Image */}
        <div className="h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-8">
          <div className="text-center">
            <span className="text-6xl">🏡</span>
            <p className="text-gray-400 mt-2">Photos coming soon</p>
          </div>
        </div>

        {/* Title & Price */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              {property.title}
            </h1>
            <p className="text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.location}
            </p>
            <p className="text-xs text-gray-400 mt-1">{property.titleJa}</p>
          </div>
          <div className="text-right flex items-start gap-2">
            <div>
              <p className="text-3xl font-bold text-accent">{priceDisplay}</p>
              <p className="text-gray-400">{usdDisplay}</p>
            </div>
            <WatchlistButton
              id={property.id}
              title={property.title}
              price={property.price}
              location={property.location}
              thumbnailUrl={null}
              size="md"
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {property.bedrooms}
            </p>
            <p className="text-xs text-gray-400">Bedrooms</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {property.buildingArea}m²
            </p>
            <p className="text-xs text-gray-400">Building Area</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {property.landArea}m²
            </p>
            <p className="text-xs text-gray-400">Land Area</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {property.yearBuilt}
            </p>
            <p className="text-xs text-gray-400">Year Built</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
          <h2 className="font-bold text-lg mb-3">About This Property</h2>
          <p className="text-gray-600 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
          <h2 className="font-bold text-lg mb-3">Features</h2>
          <div className="flex flex-wrap gap-2">
            {property.features.map((f) => (
              <span
                key={f}
                className="bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* CTA — ユーザー対応不可のため一時非表示 */}
        {false && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-primary mb-2">
            Interested in This Property?
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;ll connect you with a licensed English-speaking real estate
            agent in {property.prefecture} who can help you with viewings,
            negotiations, and the purchase process.
          </p>
          <Link
            href={`/contact?property=${property.id}`}
            className="inline-block bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition shadow-lg shadow-accent/20"
          >
            Inquire About This Property
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            Free consultation · No obligation · Response within 48 hours
          </p>
        </div>
        )}
      </div>
      <StickyContactBar propertyId={property.id} propertyTitle={property.title} priceDisplay={priceDisplay} />
      <Footer />
    </>
  );
}

// ============================================================
// Scraped property display (athome-XXXXX)
// ============================================================
// ロケール別テキスト
function L(locale: string, zh: string, ja: string, en: string) {
  return locale === "zh" ? zh : locale === "ja" ? ja : en;
}

function ScrapedPropertyPage({ property: p, locale = "zh" }: { property: ScrapedProperty; locale?: string }) {
  const priceCny = p.price > 0 ? Math.round(p.price / 20) : 0;
  const priceUsd = p.priceUsd || Math.round(p.price / 150);

  // ロケール別: メイン価格（大きく赤文字）とサブ価格
  // 日本語→JPYのみ、中国語→CNYのみ、英語→USDのみ
  const mainPrice = locale === "zh"
    ? (p.price === 0 ? "免费（¥0）" : `约 ¥${priceCny.toLocaleString()} 人民币`)
    : locale === "ja"
    ? (p.price === 0 ? "無料（¥0）" : `¥${p.price.toLocaleString()}`)
    : (p.price === 0 ? "FREE ($0)" : `$${priceUsd.toLocaleString()} USD`);

  const subPrices = locale === "zh"
    ? (p.price === 0 ? [] : [`¥${p.price.toLocaleString()} JPY`])
    : locale === "ja"
    ? ([] as string[])
    : (p.price === 0 ? [] : [`¥${p.price.toLocaleString()} JPY`]);

  // 互換性のため
  const priceDisplay = p.price === 0 ? "FREE (¥0)" : `¥${p.price.toLocaleString()}`;
  const usdDisplay = `~$${priceUsd.toLocaleString()} USD`;

  // Investment tags
  const tags = getInvestmentTags({
    price: p.price,
    buildingArea: p.buildingArea,
    yearBuilt: p.yearBuilt,
    locationJa: p.locationJa,
    access: p.access,
    structure: p.structure,
    propertyType: p.propertyType,
  });
  const tagCategories = INVESTMENT_CATEGORIES.filter((c) =>
    tags.includes(c.id)
  );

  // Investment metrics
  const pricePerSqm = calculatePricePerSqm(p.price, p.buildingArea);
  const pricePerSqmUsd = pricePerSqm ? Math.round(pricePerSqm / 150) : null;
  const age = calculateAge(p.yearBuilt);
  const walkMin = parseWalkingMinutes(p.access || "");

  // Related properties
  const relatedProperties = scrapedProperties
    .filter(
      (rp) => rp.prefectureEn === p.prefectureEn && rp.id !== p.id
    )
    .slice(0, 6);

  // Remarks
  const remarksText = locale === "en" ? (p.remarksEnglish || p.remarks || null) : (p.remarks || null);

  const displayImageUrl = getDisplayImageUrl(p);

  return (
    <>
      <Header />
      <ViewHistoryTracker
        id={p.id}
        title={p.locationJa || p.location}
        price={p.price}
        location={p.location}
        thumbnailUrl={displayImageUrl}
      />
      <div className="max-w-4xl mx-auto px-4 py-10 pb-sticky-contact">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              name: `Akiya in ${p.location}`,
              description: `${p.layout || ""} ${p.propertyType} in ${p.location}. ${priceDisplay}`,
              url: `https://akiyafinder.com/properties/${p.id}`,
              image: p.thumbnailUrl || undefined,
              offers: {
                "@type": "Offer",
                price: p.price,
                priceCurrency: "JPY",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: p.location,
                addressRegion: p.prefectureEn,
                addressCountry: "JP",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: p.lat,
                longitude: p.lng,
              },
            }),
          }}
        />

        {/* === 1. Price & Address (top) === */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent">{mainPrice}</p>
              {subPrices.map((sp, i) => (
                <p key={i} className="text-sm text-gray-400 mt-0.5">{sp}</p>
              ))}
            </div>
            <WatchlistButton
              id={p.id}
              title={p.locationJa || p.location}
              price={p.price}
              location={p.location}
              thumbnailUrl={displayImageUrl}
              size="md"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-primary mt-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {locale === "zh" ? (p.locationZh || p.locationJa || p.location) : locale === "ja" ? p.locationJa : p.location}
          </h1>
          {locale !== "ja" && (
            <p className="text-sm text-gray-500 mt-1 ml-7">
              {p.locationJa}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-xs text-gray-400">
              {p.propertyType} · {p.layout || ""} · {new Date(p.scrapedAt).toLocaleDateString(locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : "en-US")}
            </span>
            {/* Investment tags — 自治体許可取得のため非表示（将来復活可能）
            {tagCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tag/${cat.id === "free-entry" ? "free-near-free" : cat.id}`}
                className="inline-flex items-center gap-1 bg-accent/10 text-accent border border-accent/20 px-2.5 py-0.5 rounded-full text-xs font-medium hover:bg-accent/20 transition"
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
            */}
          </div>
        </div>

        {/* SNS Share */}
        <div className="mb-6">
          <ShareButtons propertyId={p.id} title={`${p.locationJa} - ${priceDisplay} | AkiyaFinder`} />
        </div>

        {/* === 2. 画像ギャラリー（全幅） === */}
        <ImageGallery property={p} images={p.allImages || []} captions={p.imageCaptions || []} />

        {/* === 3. Property Overview === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {p.layout && p.layout !== "-" && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
              <p className="text-2xl font-bold text-primary">{p.layout}</p>
              <p className="text-xs text-gray-400">{L(locale, "户型", "間取り", "Layout")}</p>
            </div>
          )}
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {p.buildingArea || "-"}
            </p>
            <p className="text-xs text-gray-400">{L(locale, "建筑面积", "建物面積", "Building")}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {p.landArea || "-"}
            </p>
            <p className="text-xs text-gray-400">{L(locale, "土地面积", "土地面積", "Land")}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {p.yearBuilt || "-"}
            </p>
            <p className="text-xs text-gray-400">{L(locale, "建造年月", "築年月", "Year Built")}</p>
          </div>
        </div>

        {/* Investment Metrics — 自治体許可取得のため非表示（将来復活可能）
        {(pricePerSqm || age !== null || walkMin !== null || p.estimatedRoi) && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-8">
            <h2 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {L(locale, "投资指标", "投資指標", "Investment Metrics")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pricePerSqm && (
                <div>
                  <p className="text-sm text-gray-500">{L(locale, "每平米价格", "㎡単価", "Price/sqm")}</p>
                  <p className="text-lg font-bold text-primary">
                    ¥{pricePerSqm.toLocaleString()}
                  </p>
                  {pricePerSqmUsd && (
                    <p className="text-xs text-gray-400">
                      ~${pricePerSqmUsd.toLocaleString()} USD
                    </p>
                  )}
                </div>
              )}
              {age !== null && (
                <div>
                  <p className="text-sm text-gray-500">{L(locale, "房龄", "築年数", "Age")}</p>
                  <p className="text-lg font-bold text-primary">
                    {age}{L(locale, "年", "年", " years")}
                  </p>
                </div>
              )}
              {walkMin !== null && (
                <div>
                  <p className="text-sm text-gray-500">{L(locale, "最近车站", "最寄り駅", "Station")}</p>
                  <p className="text-lg font-bold text-primary">
                    {L(locale, `步行${walkMin}分钟`, `徒歩${walkMin}分`, `${walkMin} min walk`)}
                  </p>
                </div>
              )}
              {p.estimatedRoi && (
                <div>
                  <p className="text-sm text-gray-500">{L(locale, "预估回报率", "想定利回り", "Est. ROI")}</p>
                  <p className="text-lg font-bold text-accent">
                    {p.estimatedRoi}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        */}

        {/* Property Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
          <h2 className="font-bold text-lg mb-4">{L(locale, "物件详情", "物件詳細", "Property Details")}</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <DetailRow label={locale === "zh" ? "物件类型" : locale === "ja" ? "物件種別" : "Type"} value={locale === "zh" ? (p.propertyTypeZh || p.propertyType) : p.propertyType} />
            <DetailRow label={locale === "zh" ? "户型" : locale === "ja" ? "間取り" : "Layout"} value={p.layout} />
            <DetailRow label={locale === "zh" ? "建筑面积" : locale === "ja" ? "建物面積" : "Building"} value={p.buildingArea} />
            <DetailRow label={locale === "zh" ? "土地面积" : locale === "ja" ? "土地面積" : "Land"} value={p.landArea} />
            <DetailRow label={locale === "zh" ? "建造年月" : locale === "ja" ? "築年月" : "Year Built"} value={p.yearBuilt} />
            <DetailRow label={locale === "zh" ? "建筑结构" : locale === "ja" ? "構造" : "Structure"} value={p.structure} />
            <DetailRow label={locale === "zh" ? "楼层" : locale === "ja" ? "階建" : "Floors"} value={p.floors} />
            <DetailRow label={locale === "zh" ? "现状" : locale === "ja" ? "現況" : "Status"} value={p.currentStatus} />
            <DetailRow label={locale === "zh" ? "建蔽率" : locale === "ja" ? "建ぺい率" : "Building Coverage"} value={p.buildingCoverageRatio} />
            <DetailRow label={locale === "zh" ? "容积率" : locale === "ja" ? "容積率" : "Floor Area Ratio"} value={p.floorAreaRatio} />
            <DetailRow label={locale === "zh" ? "土地权利" : locale === "ja" ? "土地権利" : "Land Rights"} value={p.landRights} />
            <DetailRow label={locale === "zh" ? "地目" : locale === "ja" ? "地目" : "Land Category"} value={p.landCategory} />
            <DetailRow label={locale === "zh" ? "城市规划" : locale === "ja" ? "都市計画" : "City Planning"} value={p.cityPlanning} />
            <DetailRow label={locale === "zh" ? "用途地域" : locale === "ja" ? "用途地域" : "Zoning"} value={p.zoning} />
            <DetailRow label={locale === "zh" ? "交付" : locale === "ja" ? "引渡し" : "Delivery"} value={p.delivery} />
            <DetailRow label={locale === "zh" ? "所在都道府县" : locale === "ja" ? "都道府県" : "Prefecture"} value={locale === "zh" ? (p.prefectureZh || p.prefectureEn) : locale === "ja" ? (p.prefectureJa || p.prefectureEn) : p.prefectureEn} />
          </dl>
        </div>

        {/* Features / こだわり条件 */}
        {p.kodawari && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
            <h2 className="font-bold text-lg mb-3">
              {locale === "zh" ? "特色条件" : locale === "ja" ? "こだわり条件" : "Features"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.kodawari.split(/\s+/).filter(Boolean).map((f, i) => (
                <span key={i} className="bg-accent/5 text-accent border border-accent/20 px-3 py-1 rounded-full text-sm">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Access */}
        {p.access && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
            <h2 className="font-bold text-lg mb-3">
              {locale === "zh" ? "交通" : locale === "ja" ? "アクセス" : "Access"}
            </h2>
            <p className="text-gray-600">{p.access}</p>
          </div>
        )}

        {/* Area Info */}
        {locale === "en" && p.areaDescription && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
            <h2 className="font-bold text-lg mb-3">Area Information</h2>
            <p className="text-gray-600 leading-relaxed">
              {p.areaDescription}
            </p>
          </div>
        )}

        {/* Remarks */}
        {remarksText && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
            <h2 className="font-bold text-lg mb-3">{L(locale, "备注", "備考", "Remarks")}</h2>
            <p className="text-gray-600">{remarksText}</p>
          </div>
        )}

        {/* Source */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              {L(locale, "数据来源: @home空置房银行", "出典: @home空き家バンク", "Source: @home Akiya Bank")}
            </p>
            <a
              href={p.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {L(locale, "查看原始页面", "元の掲載ページを見る", "View original listing")}
            </a>
          </div>
          <svg
            className="w-4 h-4 text-gray-400 shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>

        {/* Map & Street View */}
        {p.lat && p.lng && (
          <div className="mb-8">
            <MapStreetViewTabs lat={p.lat} lng={p.lng} location={p.locationJa || p.location} />
          </div>
        )}

        {/* Contact CTA — ユーザー対応不可のため一時非表示 */}
        {false && (
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-xl font-bold text-primary mb-2">
            {L(locale, "对此物件感兴趣？", "この物件に興味がありますか？", "Interested in This Property?")}
          </h2>
          <p className="text-gray-600 mb-6">
            {L(locale,
              `我们将为您介绍${p.prefectureZh || p.prefectureEn}地区的持牌不动产经纪人，协助看房、谈判及购买手续。`,
              `${p.prefectureJa || p.prefectureEn}エリアの不動産会社をご紹介します。内見・交渉・購入手続きをサポートいたします。`,
              `We will connect you with a licensed real estate agent in ${p.prefectureEn} who can help with viewings, negotiations, and the purchase process.`
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/contact?property=${p.id}`}
              className="bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition shadow-lg shadow-accent/20"
            >
              {L(locale, "咨询此物件", "この物件について問い合わせる", "Inquire About This Property")}
            </Link>
            <a
              href={`mailto:info@akiyafinder.homes?subject=Inquiry: ${p.id}`}
              className="text-gray-500 hover:text-primary px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition text-sm"
            >
              {L(locale, "发送邮件", "メールで問い合わせ", "Email Directly")}
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            {L(locale, "免费咨询 · 无义务 · 48小时内回复", "無料相談 · 義務なし · 48時間以内に返信", "Free consultation · No obligation · Response within 48 hours")}
          </p>
        </div>
        )}

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-primary mb-6">
              {L(locale, `${p.prefectureZh || p.prefectureEn}的更多物件`, `${p.prefectureJa || p.prefectureEn}の他の物件`, `More in ${p.prefectureEn}`)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProperties.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/properties/${rp.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group"
                >
                  <div className="h-36 relative overflow-hidden">
                    {getDisplayImageUrl(rp) ? (
                      <img
                        src={getDisplayImageUrl(rp)!}
                        alt={rp.locationJa}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-image-placeholder flex items-center justify-center h-full">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} points="9,22 9,12 15,12 15,22" />
                        </svg>
                      </div>
                    )}
                    {rp.price === 0 && (
                      <span className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {L(locale, "免费", "無料", "FREE")}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-primary truncate group-hover:text-accent transition-colors">
                      {rp.locationJa}
                    </p>
                    <p className="text-accent font-bold mt-1">
                      {rp.price === 0
                        ? "FREE"
                        : `¥${rp.price.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {rp.propertyType} · {rp.buildingArea} · {rp.landArea}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href={`/prefecture/${p.prefectureEn?.toLowerCase()}`}
                className="text-accent hover:text-red-600 text-sm font-semibold transition"
              >
                {L(locale, `查看${p.prefectureZh || p.prefectureEn}的更多物件 →`, `${p.prefectureJa || p.prefectureEn}の物件をもっと見る →`, `View more in ${p.prefectureEn} →`)}
              </Link>
            </div>
          </div>
        )}
      </div>
      <StickyContactBar propertyId={p.id} propertyTitle={p.locationJa || p.location} priceDisplay={priceDisplay} />
      <Footer />
    </>
  );
}

// --- Helper ---
function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value || value === "-") return null;
  return (
    <div className="flex justify-between border-b border-gray-50 pb-2">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-primary">{value}</dd>
    </div>
  );
}
