import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-primary text-center mb-4">
          How to Buy a House in Japan
        </h1>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-16">
          Buying property in Japan as a foreigner is simpler than you think.
          Here&apos;s everything you need to know.
        </p>

        {/* Can foreigners buy? */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            🌍 Can Foreigners Buy Property in Japan?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>Yes!</strong> Japan is one of the few countries in the world
            with <strong>zero restrictions</strong> on foreign property ownership.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>✅ No visa or residency required</li>
            <li>✅ No citizenship required</li>
            <li>✅ No special permits needed</li>
            <li>✅ Same property rights as Japanese citizens</li>
            <li>✅ You can buy from overseas without visiting Japan</li>
          </ul>
        </div>

        {/* What is Akiya */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            🏚️ What is an Akiya?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>Akiya (空き家)</strong> literally means &quot;empty house&quot; in
            Japanese. Due to Japan&apos;s aging population and urban migration, there
            are over <strong>9 million vacant houses</strong> across the country.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Many local governments offer these houses for free or at very low
            prices through <strong>Akiya Bank (空き家バンク)</strong> programs,
            sometimes with renovation subsidies of ¥1,000,000+ (~$6,600+).
          </p>
          <p className="text-gray-600 leading-relaxed">
            The problem? Almost all akiya information is
            <strong> in Japanese only</strong>. That&apos;s where AkiyaFinder comes in.
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">
            📋 The Buying Process (Step by Step)
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Find a Property on AkiyaFinder",
                desc: "Browse our curated listings, all translated into English. Filter by price, location, and property type.",
              },
              {
                step: "2",
                title: "Submit an Inquiry",
                desc: "Click 'Inquire' on any property. Tell us about yourself and what you're looking for. It's free and no obligation.",
              },
              {
                step: "3",
                title: "Get Connected to a Local Agent",
                desc: "We'll connect you with a licensed, English-speaking real estate agent in that area. They'll handle everything from here.",
              },
              {
                step: "4",
                title: "Property Viewing & Due Diligence",
                desc: "Your agent arranges a viewing (in-person or virtual). They'll check the property condition, legal status, and any issues.",
              },
              {
                step: "5",
                title: "Make an Offer & Sign Contract",
                desc: "Your agent negotiates the price and handles all paperwork in Japanese. You'll receive English translations of key documents.",
              },
              {
                step: "6",
                title: "Payment & Registration",
                desc: "Pay the purchase price (bank transfer). The agent registers the property in your name. You now own a house in Japan!",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Costs */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            💴 Typical Costs
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-500">Cost</th>
                  <th className="text-left py-2 text-gray-500">Amount</th>
                  <th className="text-left py-2 text-gray-500">Notes</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b">
                  <td className="py-2 font-medium">Property Price</td>
                  <td>¥0 – ¥10,000,000+</td>
                  <td>Many akiya are free or under $10,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Agent Fee</td>
                  <td>~3% + ¥60,000</td>
                  <td>Standard real estate commission</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Registration Tax</td>
                  <td>~1-2%</td>
                  <td>Property registration</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Stamp Duty</td>
                  <td>¥1,000 – ¥10,000</td>
                  <td>On contract documents</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Annual Property Tax</td>
                  <td>¥10,000 – ¥50,000/yr</td>
                  <td>Very low for rural properties</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Do I need to visit Japan to buy?",
                a: "Not necessarily. Many purchases can be completed remotely with a power of attorney. However, visiting is recommended to see the property condition firsthand.",
              },
              {
                q: "Can I get a mortgage as a foreigner?",
                a: "Generally, non-resident foreigners cannot get Japanese mortgages. Most akiya purchases are cash transactions, which is feasible given the low prices ($0–$30,000 for many properties).",
              },
              {
                q: "Are there hidden costs?",
                a: "The main additional costs are agent fees (~3%), registration taxes (~1-2%), and renovation costs if needed. Annual property tax is very low for rural properties (often under $300/year).",
              },
              {
                q: "Why are houses so cheap in Japan?",
                a: "Japan's population is shrinking and concentrating in cities. Rural areas have surplus housing with no demand. Japanese houses also depreciate (unlike Western countries), so older houses approach zero value.",
              },
              {
                q: "Is AkiyaFinder a real estate agency?",
                a: "No. We are an information service that curates and translates Japanese property listings. When you're ready to buy, we connect you with licensed Japanese real estate agents.",
              },
            ].map((item) => (
              <details key={item.q} className="group">
                <summary className="cursor-pointer font-semibold text-primary py-2 group-open:text-accent transition">
                  {item.q}
                </summary>
                <p className="text-gray-600 text-sm pb-2 pl-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <Link
            href="/properties"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition text-lg"
          >
            Browse Properties Now
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
