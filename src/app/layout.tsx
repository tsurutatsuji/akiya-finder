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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
