import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { properties } from "@/data/properties";
import Link from "next/link";

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params.id);
  if (!property) return notFound();

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
            <p className="text-2xl font-bold text-primary">{property.bedrooms}</p>
            <p className="text-xs text-gray-400">Bedrooms</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">{property.buildingArea}m²</p>
            <p className="text-xs text-gray-400">Building Area</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">{property.landArea}m²</p>
            <p className="text-xs text-gray-400">Land Area</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-2xl font-bold text-primary">{property.yearBuilt}</p>
            <p className="text-xs text-gray-400">Year Built</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
          <h2 className="font-bold text-lg mb-3">About This Property</h2>
          <p className="text-gray-600 leading-relaxed">{property.description}</p>
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
            We&apos;ll connect you with a licensed English-speaking real estate agent
            in {property.prefecture} who can help you with viewings, negotiations,
            and the purchase process.
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
