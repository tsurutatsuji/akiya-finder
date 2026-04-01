import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
