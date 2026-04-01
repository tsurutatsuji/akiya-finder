import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AkiyaFinder — Find Cheap Houses in Japan | From $0",
  description:
    "Discover 4,335+ affordable akiya (vacant houses) across all 47 prefectures. Investment map with price per sqm, station access, Airbnb potential. Free agent matching for foreign buyers.",
  keywords:
    "akiya, japan houses, cheap houses japan, abandoned houses japan, buy house japan, japan real estate, kominka, machiya, japanese property, akiya investment, japan property investment, free houses japan, akiya airbnb, 日本空置房, 日本房产, 空き家",
  openGraph: {
    title: "AkiyaFinder — 4,335+ Cheap Houses in Japan | From $0",
    description:
      "Investment-focused akiya search platform. 4,335+ properties across 47 prefectures with photos, investment metrics, and free agent matching.",
    type: "website",
    siteName: "AkiyaFinder",
  },
  twitter: {
    card: "summary_large_image",
    title: "AkiyaFinder — 4,335+ Cheap Houses in Japan",
    description:
      "Investment-focused akiya search. Price per sqm, station access, Airbnb potential. Free agent matching.",
  },
  alternates: {
    canonical: "https://akiya-finder.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "jCU4PgQOP_UTIK9JtDyyttrLGAe4ZRzQm8dczbDVXE4",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
