"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

function L(locale: string, zh: string, ja: string, en: string) {
  return locale === "zh" ? zh : locale === "ja" ? ja : en;
}

export default function FloatingContact() {
  const locale = useLocale();
  const pathname = usePathname();

  // 物件詳細ページではStickyContactBarが表示されるので非表示
  if (pathname.includes("/properties/")) return null;

  const subject = encodeURIComponent(
    L(locale, "咨询空置房", "空き家についてのお問い合わせ", "Akiya Inquiry")
  );

  return (
    <a
      href={`mailto:helongzhi57@gmail.com?subject=${subject}`}
      className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-red-600 text-white px-5 py-3 rounded-full shadow-lg shadow-accent/30 transition flex items-center gap-2 text-sm font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      {L(locale, "邮件咨询", "メールで相談", "Contact us")}
    </a>
  );
}
