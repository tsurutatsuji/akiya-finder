"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

function L(locale: string, zh: string, ja: string, en: string) {
  return locale === "zh" ? zh : locale === "ja" ? ja : en;
}

interface Props {
  propertyId: string;
  propertyTitle?: string;
  priceDisplay: string;
}

export default function StickyContactBar({ propertyId, propertyTitle, priceDisplay }: Props) {
  const locale = useLocale();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="hidden sm:block min-w-0">
          <p className="text-lg font-bold text-accent truncate">{priceDisplay}</p>
          <p className="text-xs text-gray-400">
            {L(locale, "免费咨询", "無料相談", "Free consultation")}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href={`/contact?property=${propertyId}`}
            className="flex-1 sm:flex-none bg-accent hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold transition text-sm text-center shadow-lg shadow-accent/20"
          >
            {L(locale, "咨询这套房产", "この物件について相談する", "Inquire about this property")}
          </Link>
        </div>
      </div>
    </div>
  );
}
