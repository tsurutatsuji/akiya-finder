import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import NewsletterForm from "@/components/NewsletterForm";
import { properties } from "@/data/properties";
import Link from "next/link";

export default function Home() {
  const featured = properties.slice(0, 6);
  const freeProperties = properties.filter((p) => p.price === 0);
  const cheapest = [...properties].sort((a, b) => a.price - b.price);

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="hero-gradient text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Find Your Dream House
            <br />
            <span className="text-cyan-300">in Japan — From $0</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Japan has over 9 million vacant houses (akiya). Many are available
            for free or at incredibly low prices. We find them, translate them,
            and connect you with local agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-accent hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
            >
              Browse Properties
            </Link>
            <Link
              href="/how-it-works"
              className="border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
            >
              How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            <div>
              <p className="text-3xl font-bold text-cyan-300">9M+</p>
              <p className="text-sm text-gray-400">Vacant Houses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-300">$0</p>
              <p className="text-sm text-gray-400">Starting Price</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-300">47</p>
              <p className="text-sm text-gray-400">Prefectures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Japan */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Why Buy Property in Japan?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <span className="text-4xl mb-4 block">🌍</span>
              <h3 className="font-bold text-lg mb-2">No Restrictions</h3>
              <p className="text-gray-600 text-sm">
                Japan is one of the few countries where foreigners can buy
                property with no restrictions — no visa, no residency required.
              </p>
            </div>
            <div className="text-center p-6">
              <span className="text-4xl mb-4 block">💰</span>
              <h3 className="font-bold text-lg mb-2">Incredibly Affordable</h3>
              <p className="text-gray-600 text-sm">
                Houses starting from $0 (free akiya programs). Average rural
                properties cost $3,000–$30,000. A fraction of Western prices.
              </p>
            </div>
            <div className="text-center p-6">
              <span className="text-4xl mb-4 block">🏯</span>
              <h3 className="font-bold text-lg mb-2">Unique Architecture</h3>
              <p className="text-gray-600 text-sm">
                Traditional kominka, machiya townhouses, and countryside
                farmhouses offer character and charm found nowhere else in the
                world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary">
              Featured Properties
            </h2>
            <Link
              href="/properties"
              className="text-accent hover:underline text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">
            How AkiyaFinder Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold mb-2">We Find Properties</h3>
              <p className="text-gray-600 text-sm">
                We search Japanese-only property databases, akiya banks, and
                SUUMO daily to find the best deals across Japan.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold mb-2">We Translate Everything</h3>
              <p className="text-gray-600 text-sm">
                All property information, including location details, pricing,
                and features, is translated into clear English for you.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold mb-2">We Connect You</h3>
              <p className="text-gray-600 text-sm">
                When you find a property you love, we connect you with a
                licensed Japanese real estate agent who speaks English.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition mt-10"
          >
            Start Your Search
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 hero-gradient text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get New Properties in Your Inbox
          </h2>
          <p className="text-gray-300 mb-8">
            We add new properties every week. Subscribe to get notified about
            the best deals before anyone else.
          </p>
          <NewsletterForm />
          <p className="text-xs text-gray-400 mt-3">
            Free weekly updates. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
