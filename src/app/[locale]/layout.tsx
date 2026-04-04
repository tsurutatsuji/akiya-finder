import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import FloatingContact from "@/components/FloatingContact";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "AkiyaFinder",
  url: "https://akiya-finder.vercel.app",
  description:
    "Japan's akiya (vacant house) search platform for international buyers. 4,335+ properties across all 47 prefectures in English, Chinese, and Japanese.",
  areaServed: {
    "@type": "Country",
    name: "Japan",
  },
  serviceType: "Real Estate Referral",
  availableLanguage: ["English", "Chinese", "Japanese"],
  priceRange: "Free – ¥50,000,000+",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Noto Sans SC for Chinese typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Noto+Serif+JP:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <FloatingContact />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
