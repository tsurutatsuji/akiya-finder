export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              🏠 AkiyaFinder
            </h3>
            <p className="text-sm leading-relaxed">
              Your gateway to affordable property in Japan. We curate the best
              akiya (vacant houses) and cheap properties from across Japan,
              translated into English for international buyers.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
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
              <li>
                <a href="/blog" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="/blog?lang=zh" className="hover:text-white transition">
                  Blog (中文)
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Disclaimer</h4>
            <p className="text-sm leading-relaxed">
              AkiyaFinder is an information service. We are not a licensed real
              estate agency. All property transactions are handled by licensed
              Japanese real estate professionals. Property information is for
              reference only.
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
