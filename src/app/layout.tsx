import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AkiyaFinder — Find Cheap Houses in Japan | From $0",
  description:
    "Discover 901+ affordable akiya (vacant houses) across all 47 prefectures. Investment map with price per ㎡, station access, Airbnb potential. Free agent matching for foreign buyers.",
  keywords:
    "akiya, japan houses, cheap houses japan, abandoned houses japan, buy house japan, japan real estate, kominka, machiya, japanese property, akiya investment, japan property investment, free houses japan, akiya airbnb",
  openGraph: {
    title: "AkiyaFinder — 901+ Cheap Houses in Japan | From $0",
    description:
      "Investment-focused akiya search platform. 901+ properties across 47 prefectures with photos, investment metrics, and free agent matching.",
    type: "website",
    locale: "en_US",
    siteName: "AkiyaFinder",
  },
  twitter: {
    card: "summary_large_image",
    title: "AkiyaFinder — 901+ Cheap Houses in Japan",
    description:
      "Investment-focused akiya search. Price per ㎡, station access, Airbnb potential. Free agent matching.",
  },
  alternates: {
    canonical: "https://akiya-finder.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "AkiyaFinder",
  url: "https://akiya-finder.vercel.app",
  description:
    "Japan's akiya (vacant house) search platform for international buyers. 901+ properties across all 47 prefectures in English and Chinese.",
  areaServed: {
    "@type": "Country",
    name: "Japan",
  },
  serviceType: "Real Estate Referral",
  availableLanguage: ["English", "Chinese", "Japanese"],
  priceRange: "Free – ¥50,000,000+",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
