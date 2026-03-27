export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              🏠 AkiyaFinder
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              Japan&apos;s akiya property search platform for international
              investors. 901+ listings across all 47 prefectures in English and
              Chinese.
            </p>
            <p className="text-sm">
              <a
                href="mailto:helongzhi57@gmail.com"
                className="hover:text-white transition"
              >
                helongzhi57@gmail.com
              </a>
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/map" className="hover:text-white transition">
                  Investment Map
                </a>
              </li>
              <li>
                <a href="/akiya-bank" className="hover:text-white transition">
                  Akiya Bank Search
                </a>
              </li>
              <li>
                <a href="/properties" className="hover:text-white transition">
                  Browse Properties
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="hover:text-white transition">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/blog" className="hover:text-white transition">
                  Blog (English)
                </a>
              </li>
              <li>
                <a href="/blog?lang=zh" className="hover:text-white transition">
                  Blog (中文)
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Get Started — Free
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Disclaimer</h4>
            <p className="text-sm leading-relaxed">
              AkiyaFinder is an information and referral service. We are not a
              licensed real estate agency. All property transactions are handled
              by licensed Japanese real estate professionals (宅建業者). Property
              information is for reference only.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; 2026 AkiyaFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
