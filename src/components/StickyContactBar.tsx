"use client";

import { useLocale } from "next-intl";

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

  const subject = encodeURIComponent(
    L(locale,
      `咨询物件: ${propertyTitle || propertyId}`,
      `物件のお問い合わせ: ${propertyTitle || propertyId}`,
      `Inquiry: ${propertyTitle || propertyId}`
    )
  );
  const body = encodeURIComponent(
    L(locale,
      `您好，\n\n我对以下物件感兴趣：\n\n物件ID: ${propertyId}\n物件名: ${propertyTitle || ""}\n价格: ${priceDisplay}\n\n请告诉我更多信息。\n\n谢谢`,
      `お問い合わせ\n\n以下の物件に興味があります：\n\n物件ID: ${propertyId}\n物件名: ${propertyTitle || ""}\n価格: ${priceDisplay}\n\n詳細を教えてください。\n\nよろしくお願いいたします。`,
      `Hello,\n\nI'm interested in the following property:\n\nProperty ID: ${propertyId}\nProperty: ${propertyTitle || ""}\nPrice: ${priceDisplay}\n\nPlease send me more information.\n\nThank you`
    )
  );

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
          <a
            href={`mailto:helongzhi57@gmail.com?subject=${subject}&body=${body}`}
            className="flex-1 sm:flex-none bg-accent hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold transition text-sm text-center shadow-lg shadow-accent/20"
          >
            {L(locale, "邮件咨询这套房产", "この物件についてメールで相談", "Email inquiry about this property")}
          </a>
        </div>
      </div>
    </div>
  );
}
