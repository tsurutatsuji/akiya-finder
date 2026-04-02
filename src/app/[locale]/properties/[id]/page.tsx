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

// --- Page ---
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
          <div className="text-right">
            <p className="text-3xl font-bold text-accent">{priceDisplay}</p>
            <p className="text-gray-400">{usdDisplay}</p>
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
            className="inline-block bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition shadow-lg shadow-accent/20"
          >
            Inquire About This Property
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            Free consultation · No obligation · Response within 48 hours
          </p>
        </div>
      </div>
      <StickyContactBar propertyId={property.id} priceDisplay={priceDisplay} />
      <Footer />
    </>
  );
}

// ============================================================
// Scraped property display (athome-XXXXX)
// ============================================================
function ScrapedPropertyPage({ property: p }: { property: ScrapedProperty }) {
  const priceDisplay =
    p.price === 0 ? "FREE (¥0)" : `¥${p.price.toLocaleString()}`;
  const usdDisplay =
    p.priceUsd === 0 ? "$0 USD" : `~$${p.priceUsd.toLocaleString()} USD`;

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
  const remarksText = p.remarksEnglish || p.remarks || null;

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
              <p className="text-3xl md:text-4xl font-bold text-accent">{priceDisplay}</p>
              <p className="text-lg text-gray-500">{usdDisplay}</p>
            </div>
            <div className="text-right">
              {p.price > 0 && (
                <p className="text-lg text-orange-500 font-medium">
                  ≈ ¥{Math.round(p.price / 20).toLocaleString()} CNY
                </p>
              )}
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-primary mt-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {p.locationJa}
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-7">{p.location}, {p.prefectureEn}</p>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-xs text-gray-400">
              {p.propertyType} · {p.layout || ""} · {new Date(p.scrapedAt).toLocaleDateString("ja-JP")}
            </span>
            {/* Investment tags */}
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
          </div>
        </div>

        {/* SNS Share */}
        <div className="mb-6">
          <ShareButtons propertyId={p.id} title={`${p.locationJa} - ${priceDisplay} | AkiyaFinder`} />
        </div>

        {/* === 2. Image + Map === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div>
            <ImageGallery property={p} />
          </div>
          {p.lat && p.lng && (
            <MapStreetViewTabs lat={p.lat} lng={p.lng} location={p.locationJa || p.location} />
          )}
        </div>

        {/* === 3. Property Overview === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {p.layout && p.layout !== "-" && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
              <p className="text-2xl font-bold text-primary">{p.layout}</p>
              <p className="text-xs text-gray-400">Layout</p>
            </div>
          )}
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {p.buildingArea || "-"}
            </p>
            <p className="text-xs text-gray-400">Building</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {p.landArea || "-"}
            </p>
            <p className="text-xs text-gray-400">Land</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">
              {p.yearBuilt || "-"}
            </p>
            <p className="text-xs text-gray-400">Year Built</p>
          </div>
        </div>

        {/* Investment Metrics */}
        {(pricePerSqm || age !== null || walkMin !== null || p.estimatedRoi) && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-8">
            <h2 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Investment Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pricePerSqm && (
                <div>
                  <p className="text-sm text-gray-500">Price/sqm</p>
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
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-lg font-bold text-primary">
                    {age} years
                  </p>
                </div>
              )}
              {walkMin !== null && (
                <div>
                  <p className="text-sm text-gray-500">Station</p>
                  <p className="text-lg font-bold text-primary">
                    {walkMin} min walk
                  </p>
                </div>
              )}
              {p.estimatedRoi && (
                <div>
                  <p className="text-sm text-gray-500">Est. ROI</p>
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
            <DetailRow label="Type" value={p.propertyType} />
            <DetailRow label="Layout" value={p.layout} />
            <DetailRow label="Building" value={p.buildingArea} />
            <DetailRow label="Land" value={p.landArea} />
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

        {/* Area Info */}
        {p.areaDescription && (
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
            <h2 className="font-bold text-lg mb-3">Remarks</h2>
            <p className="text-gray-600">{remarksText}</p>
          </div>
        )}

        {/* Source */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              Source: @home Akiya Bank
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

        {/* Contact CTA */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-xl font-bold text-primary mb-2">
            Interested in This Property?
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;ll connect you with a licensed real estate agent in {p.prefectureEn} who can help with viewings, negotiations, and the purchase process.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/contact?property=${p.id}`}
              className="bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition shadow-lg shadow-accent/20"
            >
              Inquire About This Property
            </Link>
            <a
              href={`mailto:helongzhi57@gmail.com?subject=Inquiry: ${p.id}`}
              className="text-gray-500 hover:text-primary px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition text-sm"
            >
              Email Directly
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Free consultation · No obligation · Response within 48 hours
          </p>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-primary mb-6">
              More in {p.prefectureEn}
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
                        FREE
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
                View more in {p.prefectureEn} →
              </Link>
            </div>
          </div>
        )}
      </div>
      <StickyContactBar propertyId={p.id} priceDisplay={priceDisplay} />
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
