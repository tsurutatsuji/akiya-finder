import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AkiyaFinder — Find Cheap Houses in Japan | From $0",
  description:
    "Discover affordable akiya (vacant houses) and cheap properties across Japan. Traditional homes from $0. Updated weekly. Your gateway to owning a house in Japan.",
  keywords:
    "akiya, japan houses, cheap houses japan, abandoned houses japan, buy house japan, japan real estate, kominka, machiya, japanese property",
  openGraph: {
    title: "AkiyaFinder — Find Cheap Houses in Japan",
    description:
      "Discover affordable akiya and cheap properties across Japan. Traditional homes from $0.",
    type: "website",
    locale: "en_US",
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
