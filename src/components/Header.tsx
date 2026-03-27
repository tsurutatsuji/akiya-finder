"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-bold text-primary">
            Akiya<span className="text-accent">Finder</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/properties"
            className="text-gray-600 hover:text-primary transition"
          >
            Browse Properties
          </Link>
          <Link
            href="/akiya-bank"
            className="text-gray-600 hover:text-primary transition"
          >
            Akiya Bank Search
          </Link>
          <Link
            href="/map"
            className="text-gray-600 hover:text-primary transition"
          >
            Map
          </Link>
          <Link
            href="/how-it-works"
            className="text-gray-600 hover:text-primary transition"
          >
            How It Works
          </Link>
          <Link
            href="/blog"
            className="text-gray-600 hover:text-primary transition"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
