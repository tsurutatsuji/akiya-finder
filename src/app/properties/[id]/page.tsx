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
import Link from "next/link";

// --- 統合型 ---
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
  const priceUsd =
    p.priceUsd === 0 ? "$0" : `$${p.priceUsd.toLocaleString()}`;

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

// --- ページ ---
export default function PropertyDetail({
  params,
}: {
  params: { id: string };
}) {
  const unified = findProperty(params.id);
  if (!unified) return notFound();

  if (unified.kind === "manual") {
    return <ManualPropertyPage property={unified.data} />;
  }
  return <ScrapedPropertyPage property={unified.data} />;
}

// ============================================================
// 既存の手動データ表示（akiya-001~020）— 変更なし
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
      <div className="max-w-4xl mx-auto px-4 py-10">
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
            <p className="text-gray-500">📍 {property.location}</p>
            <p className="text-xs text-gray-400 mt-1">{property.titleJa}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-accent">{priceDisplay}</p>
            <p className="text-gray-400">{usdDisplay}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {property.bedrooms}
            </p>
            <p className="text-xs text-gray-400">Bedrooms</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {property.buildingArea}m²
            </p>
            <p className="text-xs text-gray-400">Building Area</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {property.landArea}m²
            </p>
            <p className="text-xs text-gray-400">Land Area</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
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

        {/* CTA */}
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
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Inquire About This Property
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            Free consultation · No obligation · Response within 48 hours
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

// ============================================================
// スクレイプ物件表示（athome-XXXXX）
// ============================================================
function ScrapedPropertyPage({ property: p }: { property: ScrapedProperty }) {
  const priceDisplay =
    p.price === 0 ? "FREE (¥0)" : `¥${p.price.toLocaleString()}`;
  const usdDisplay =
    p.priceUsd === 0 ? "$0 USD" : `~$${p.priceUsd.toLocaleString()} USD`;

  // 投資タグ
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

  // 投資指標
  const pricePerSqm = calculatePricePerSqm(p.price, p.buildingArea);
  const pricePerSqmUsd = pricePerSqm ? Math.round(pricePerSqm / 150) : null;
  const age = calculateAge(p.yearBuilt);
  const walkMin = parseWalkingMinutes(p.access || "");

  // 同じ都道府県の関連物件（自分を除く、最大6件）
  const relatedProperties = scrapedProperties
    .filter(
      (rp) => rp.prefectureEn === p.prefectureEn && rp.id !== p.id
    )
    .slice(0, 6);

  // 備考（英語優先）
  const remarksText = p.remarksEnglish || p.remarks || null;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
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

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/properties" className="hover:text-accent">
            Properties
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/akiya/${p.prefectureEn?.toLowerCase()}`}
            className="hover:text-accent"
          >
            {p.prefectureEn}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{p.location}</span>
        </nav>

        {/* Image */}
        <div className="h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative mb-8">
          {p.thumbnailUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.thumbnailUrl}
                alt={`Akiya property in ${p.location}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
                Source: @home空き家バンク
              </span>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="text-6xl">🏡</span>
                <p className="text-gray-400 mt-2">Photo not available</p>
              </div>
            </div>
          )}
          {p.price === 0 && (
            <span className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-4 py-1.5 rounded-full">
              FREE
            </span>
          )}
        </div>

        {/* Investment Tags */}
        {tagCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tagCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/akiya/investment/${cat.id === "free-entry" ? "free-near-free" : cat.id}`}
                className="inline-flex items-center gap-1.5 bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-accent/20 transition"
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Title & Price */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              {p.layout ? `${p.layout} ` : ""}
              {p.propertyType === "売土地" ? "Land" : "House"} in {p.location}
            </h1>
            <p className="text-gray-500">📍 {p.locationJa}</p>
            <p className="text-xs text-gray-400 mt-1">
              {p.propertyType} · Listed {new Date(p.scrapedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-bold text-accent">{priceDisplay}</p>
            <p className="text-gray-400">{usdDisplay}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {p.layout && p.layout !== "-" && (
            <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
              <p className="text-2xl font-bold text-primary">{p.layout}</p>
              <p className="text-xs text-gray-400">Layout</p>
            </div>
          )}
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {p.buildingArea || "-"}
            </p>
            <p className="text-xs text-gray-400">Building Area</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {p.landArea || "-"}
            </p>
            <p className="text-xs text-gray-400">Land Area</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {p.yearBuilt || "-"}
            </p>
            <p className="text-xs text-gray-400">Year Built</p>
          </div>
        </div>

        {/* Investment Metrics */}
        {(pricePerSqm || age !== null || walkMin !== null || p.estimatedRoi) && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-8">
            <h2 className="font-bold text-lg text-primary mb-4">
              Investment Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pricePerSqm && (
                <div>
                  <p className="text-sm text-gray-500">Price / m²</p>
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
                  <p className="text-sm text-gray-500">Building Age</p>
                  <p className="text-lg font-bold text-primary">
                    {age} years
                  </p>
                </div>
              )}
              {walkMin !== null && (
                <div>
                  <p className="text-sm text-gray-500">Station Walk</p>
                  <p className="text-lg font-bold text-primary">
                    {walkMin} min
                  </p>
                </div>
              )}
              {p.estimatedRoi && (
                <div>
                  <p className="text-sm text-gray-500">Est. ROI (Airbnb)</p>
                  <p className="text-lg font-bold text-accent">
                    {p.estimatedRoi}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Property Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
          <h2 className="font-bold text-lg mb-4">Property Details</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <DetailRow label="Property Type" value={p.propertyType} />
            <DetailRow label="Layout" value={p.layout} />
            <DetailRow label="Building Area" value={p.buildingArea} />
            <DetailRow label="Land Area" value={p.landArea} />
            <DetailRow label="Year Built" value={p.yearBuilt} />
            <DetailRow label="Structure" value={p.structure} />
            <DetailRow label="Land Rights" value={p.landRights} />
            <DetailRow label="Zoning" value={p.zoning} />
            <DetailRow label="Prefecture" value={p.prefectureEn} />
          </dl>
        </div>

        {/* Access */}
        {p.access && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
            <h2 className="font-bold text-lg mb-3">Access</h2>
            <p className="text-gray-600">{p.access}</p>
          </div>
        )}

        {/* Area Description */}
        {p.areaDescription && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
            <h2 className="font-bold text-lg mb-3">About This Area</h2>
            <p className="text-gray-600 leading-relaxed">
              {p.areaDescription}
            </p>
          </div>
        )}

        {/* Remarks */}
        {remarksText && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
            <h2 className="font-bold text-lg mb-3">Remarks</h2>
            <p className="text-gray-600">{remarksText}</p>
          </div>
        )}

        {/* Source Link */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              Source: @home空き家バンク (at-home Akiya Bank)
            </p>
            <a
              href={p.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              View original listing
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

        {/* CTA */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-8 text-center mb-12">
          <h2 className="text-xl font-bold text-primary mb-2">
            Interested in This Property?
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;ll connect you with a licensed English-speaking real estate
            agent in {p.prefectureEn} who can help you with viewings,
            negotiations, and the purchase process.
          </p>
          <Link
            href={`/contact?property=${p.id}`}
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Inquire About This Property
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            Free consultation · No obligation · Response within 48 hours
          </p>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-primary mb-6">
              More Properties in {p.prefectureEn}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProperties.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/properties/${rp.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group"
                >
                  <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {rp.thumbnailUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rp.thumbnailUrl}
                          alt={`Akiya in ${rp.location}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute bottom-1 right-1 text-[10px] text-white/70 bg-black/30 px-1 rounded">
                          @home空き家バンク
                        </span>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-3xl">
                        🏡
                      </div>
                    )}
                    {rp.price === 0 && (
                      <span className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-primary truncate">
                      {rp.layout ? `${rp.layout} ` : ""}
                      {rp.propertyType === "売土地" ? "Land" : "House"} in{" "}
                      {rp.location}
                    </p>
                    <p className="text-accent font-bold mt-1">
                      {rp.price === 0
                        ? "FREE"
                        : `¥${rp.price.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {rp.buildingArea} · {rp.landArea}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href={`/akiya/${p.prefectureEn?.toLowerCase()}`}
                className="text-accent hover:underline text-sm font-medium"
              >
                View all properties in {p.prefectureEn} →
              </Link>
            </div>
          </div>
        )}
      </div>
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
