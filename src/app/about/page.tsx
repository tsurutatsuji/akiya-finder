import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-primary mb-6">About AkiyaFinder</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            AkiyaFinder helps international buyers discover and invest in
            Japan&apos;s vacant properties. We translate akiya bank listings into
            English and Chinese, add investment metrics, and connect you with
            licensed local agents.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 rounded-xl p-6">
              <span className="text-3xl block mb-2">🏠</span>
              <p className="font-bold text-primary text-2xl">901+</p>
              <p className="text-gray-500 text-sm">Properties listed across 47 prefectures</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <span className="text-3xl block mb-2">🌏</span>
              <p className="font-bold text-primary text-2xl">3</p>
              <p className="text-gray-500 text-sm">Languages (English, Chinese, Japanese)</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <span className="text-3xl block mb-2">🤝</span>
              <p className="font-bold text-primary text-2xl">Free</p>
              <p className="text-gray-500 text-sm">Agent matching — no cost to buyers</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mb-4">Why We Built This</h2>
          <p className="text-gray-600 mb-4">
            Japan has over 9 million vacant homes, and that number is growing every year.
            Many of these properties are available for incredibly low prices — some even
            for free. But there&apos;s a massive information gap: almost all akiya bank
            listings are in Japanese only, scattered across 1,700+ municipal websites
            with no standardized format.
          </p>
          <p className="text-gray-600 mb-8">
            We bridge that gap by automatically collecting, translating, and enriching
            akiya listings with investment-relevant data — price per square meter,
            station access, building condition, Airbnb potential — so international
            buyers can make informed decisions.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">How It Works</h2>
          <ol className="space-y-4 mb-8">
            <li className="flex gap-3">
              <span className="bg-accent/10 text-accent font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <p className="font-semibold text-primary">Browse & Filter</p>
                <p className="text-gray-500 text-sm">Search 901+ properties on our investment map. Filter by price, location, station access, and investment category.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-accent/10 text-accent font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="font-semibold text-primary">Get Matched</p>
                <p className="text-gray-500 text-sm">Submit an inquiry and we&apos;ll connect you with a licensed Japanese real estate agent who speaks English — within 2 business days.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-accent/10 text-accent font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <p className="font-semibold text-primary">Buy with Confidence</p>
                <p className="text-gray-500 text-sm">Your agent handles everything — property visits, negotiation, contracts, and registration. Many purchases can be completed remotely.</p>
              </div>
            </li>
          </ol>

          <h2 className="text-2xl font-bold text-primary mb-4">Our Commitment</h2>
          <ul className="space-y-2 text-gray-600 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>Free for buyers</strong> — We never charge buyers for agent introductions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>Licensed agents only</strong> — Every agent we recommend holds a valid Japanese real estate license (宅建業免許)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>No pressure</strong> — Browse freely, inquire when ready. No obligations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>Updated regularly</strong> — We refresh listings from akiya banks across Japan</span>
            </li>
          </ul>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-primary mb-2">
              Ready to explore?
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Start browsing 901+ properties on our investment map.
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/map"
                className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
              >
                Open Investment Map
              </a>
              <a
                href="/contact"
                className="bg-white border border-gray-200 text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Get Started — Free
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
