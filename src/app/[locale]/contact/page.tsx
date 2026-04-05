"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { properties } from "@/data/properties";
import { scrapedProperties } from "@/lib/scraped-properties";
import { getDisplayImageUrl } from "@/lib/image-utils";
import { Link } from "@/i18n/navigation";
import { Suspense } from "react";

function L(locale: string, zh: string, ja: string, en: string) {
  return locale === "zh" ? zh : locale === "ja" ? ja : en;
}

function ContactForm() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("property");

  // manual + scraped両方から物件を探す
  const manualProperty = propertyId ? properties.find((p) => p.id === propertyId) : null;
  const scrapedProperty = propertyId ? scrapedProperties.find((p) => p.id === propertyId) : null;
  const property = manualProperty || scrapedProperty;

  // 物件情報をまとめる
  const propertyInfo = property ? (() => {
    if ("title" in property) {
      // manual property
      const p = property as any;
      return {
        id: p.id,
        location: p.location,
        price: p.price as number,
        image: p.images?.[0] || null,
        display: `${p.title} (${p.location})`,
      };
    } else {
      // scraped property
      const p = property as any;
      const loc = locale === "zh" ? (p.locationZh || p.location)
        : locale === "ja" ? (p.locationJa || p.location)
        : p.location;
      return {
        id: p.id,
        location: loc,
        price: p.price as number,
        image: getDisplayImageUrl(p),
        display: `${p.locationJa || p.location} (${p.id})`,
      };
    }
  })() : null;

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          country: formData.get("country"),
          message: formData.get("message"),
          property: propertyInfo?.display || null,
          propertyId: propertyId || null,
          locale,
        }),
      });
    } catch (e) {
      console.error("Failed to send inquiry:", e);
    }

    setSending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <span className="text-6xl mb-4 block">✅</span>
        <h2 className="text-2xl font-bold text-primary mb-4">
          {L(locale, "感谢您的咨询！", "お問い合わせありがとうございます！", "Thank You for Your Inquiry!")}
        </h2>
        <p className="text-gray-600 mb-4">
          {L(locale, "接下来的流程：", "今後の流れ：", "Here's what happens next:")}
        </p>
        <ol className="text-left max-w-md mx-auto text-gray-600 text-sm space-y-3 mb-8">
          <li className="flex gap-3">
            <span className="bg-accent/10 text-accent font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
            <span>{L(locale,
              "我们将在2个工作日内通过邮件回复您。",
              "2営業日以内にメールでご返信いたします。",
              "We'll reply to your email within 2 business days."
            )}</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-accent/10 text-accent font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
            <span>{L(locale,
              "根据您的需求，为您介绍当地的不动产公司。",
              "ご要望に応じて、現地の不動産会社をご紹介いたします。",
              "Based on your needs, we'll connect you with a local real estate agent."
            )}</span>
          </li>
        </ol>
        <a
          href={`/${locale}/properties`}
          className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          {L(locale, "浏览更多房产", "他の物件を見る", "Browse More Properties")}
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-2">
        {L(locale, "免费咨询", "お問い合わせ", "Contact Us")}
      </h1>
      <p className="text-gray-500 mb-8">
        {L(locale,
          "告诉我们您感兴趣的物件或需求，我们将在2个工作日内通过邮件回复。",
          "気になる物件やご要望をお聞かせください。2営業日以内にメールでご返信いたします。",
          "Tell us about the property you're interested in or your requirements. We'll reply by email within 2 business days."
        )}
      </p>

      {propertyInfo && (
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-8">
          <p className="text-xs text-gray-400 mb-3">{L(locale, "咨询的物件：", "お問い合わせ対象：", "Inquiring about:")}</p>
          <div className="flex gap-4">
            {propertyInfo.image && (
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={propertyInfo.image}
                  alt={propertyInfo.location}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-primary text-sm leading-tight mb-1">{propertyInfo.location}</p>
              <p className="text-accent font-bold">
                {propertyInfo.price === 0
                  ? L(locale, "免费（¥0）", "無料（¥0）", "FREE (¥0)")
                  : `¥${propertyInfo.price.toLocaleString()}`}
              </p>
              <p className="text-xs text-gray-400 mt-1">ID: {propertyInfo.id}</p>
              <Link
                href={`/properties/${propertyInfo.id}`}
                className="text-xs text-accent hover:text-red-600 mt-1 inline-block"
              >
                {L(locale, "查看物件详情 →", "物件詳細を見る →", "View property →")}
              </Link>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {L(locale, "姓名 *", "お名前 *", "Name *")}
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder={L(locale, "您的姓名", "お名前", "Your name")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {L(locale, "邮箱 *", "メールアドレス *", "Email *")}
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {L(locale, "国家/地区", "お住まいの国", "Country")}
          </label>
          <input
            type="text"
            name="country"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder={L(locale, "您来自哪里？", "お住まいの国は？", "Where are you from?")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {L(locale, "您的需求 *", "ご要望 *", "Your message *")}
          </label>
          <textarea
            name="message"
            required
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder={L(locale,
              "请描述您感兴趣的物件或需求：希望地区、用途（移住、度假、民宿经营等）、预算等。",
              "気になる物件やご要望を教えてください：希望エリア、用途（移住・セカンドハウス・民泊など）、ご予算など。",
              "Tell us about your interest: preferred area, intended use (relocation, vacation home, Airbnb), budget, etc."
            )}
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending
            ? L(locale, "发送中...", "送信中...", "Sending...")
            : L(locale, "发送咨询（免费）", "送信する（無料）", "Send Inquiry (Free)")}
        </button>
        <p className="text-xs text-gray-400 text-center">
          {L(locale,
            "2个工作日内回复。您的信息将被严格保密。",
            "2営業日以内にご返信いたします。個人情報は厳格に管理されます。",
            "We'll respond within 2 business days. Your information is kept confidential."
          )}
        </p>
      </form>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Suspense fallback={<div>Loading...</div>}>
          <ContactForm />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
