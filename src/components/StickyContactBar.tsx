"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface Props {
  propertyId: string;
  priceDisplay: string;
}

export default function StickyContactBar({ propertyId, priceDisplay }: Props) {
  const t = useTranslations("stickyContact");

  // ユーザー対応不可のため一時非表示
  if (true) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="hidden sm:block min-w-0">
          <p className="text-lg font-bold text-accent truncate">{priceDisplay}</p>
          <p className="text-xs text-gray-400">{t("freeConsultation")}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* WeChat */}
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText("AkiyaFinder");
              }
              alert(t("wechatCopied"));
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 transition text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05a6.66 6.66 0 01-.246-1.784c0-3.726 3.51-6.759 7.843-6.759.276 0 .543.027.811.05C17.074 4.616 13.224 2.188 8.691 2.188zm8.809 5.622c3.87 0 7 2.674 7 5.97 0 1.828-.965 3.473-2.478 4.588a.49.49 0 00-.176.55l.321 1.222c.016.058.04.116.04.176a.243.243 0 01-.24.243.27.27 0 01-.138-.045l-1.57-.92a.714.714 0 00-.592-.08A8.38 8.38 0 0117.5 19.9c-3.87 0-7-2.674-7-5.97s3.13-6.12 7-6.12z"/>
            </svg>
            <span className="hidden md:inline">WeChat</span>
          </button>
          {/* Email */}
          <a
            href={`mailto:helongzhi57@gmail.com?subject=Inquiry: ${propertyId}&body=I'm interested in property ${propertyId}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">Email</span>
          </a>
          {/* Main CTA */}
          <Link
            href={`/contact?property=${propertyId}`}
            className="flex-1 sm:flex-none bg-accent hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm text-center shadow-lg shadow-accent/20"
          >
            {t("inquire")}
          </Link>
        </div>
      </div>
    </div>
  );
}
