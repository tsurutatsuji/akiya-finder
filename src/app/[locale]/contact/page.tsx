"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { properties } from "@/data/properties";
import { Suspense } from "react";

function L(locale: string, zh: string, ja: string, en: string) {
  return locale === "zh" ? zh : locale === "ja" ? ja : en;
}

function ContactForm() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("property");
  const property = propertyId
    ? properties.find((p) => p.id === propertyId)
    : null;

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [refCode, setRefCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          country: formData.get("country"),
          budget: formData.get("budget"),
          message: formData.get("message"),
          property: property ? `${property.title} (${property.location})` : null,
        }),
      });
      const data = await res.json();
      if (data.refCode) setRefCode(data.refCode);
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

        {refCode && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 inline-block">
            <p className="text-xs text-gray-400 mb-1">{L(locale, "您的参考编号", "参照コード", "Your Reference Code")}</p>
            <p className="text-lg font-mono font-bold text-primary">{refCode}</p>
          </div>
        )}

        <p className="text-gray-600 mb-4">
          {L(locale, "接下来的流程：", "今後の流れ：", "Here's what happens next:")}
        </p>
        <ol className="text-left max-w-md mx-auto text-gray-600 text-sm space-y-3 mb-8">
          <li className="flex gap-3">
            <span className="bg-accent/10 text-accent font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
            <span>{L(
              locale,
              "我们将在2个工作日内为您匹配一位持牌日本不动产经纪人。",
              "2営業日以内に現地の不動産会社をマッチングします。",
              "We'll match you with a licensed Japanese real estate agent who speaks English — within 2 business days."
            )}</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-accent/10 text-accent font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
            <span>{L(
              locale,
              "经纪人将直接联系您，讨论您的需求和可用房产。",
              "エージェントから直接ご連絡し、ご要望と物件についてご相談します。",
              "The agent will contact you directly to discuss your requirements and available properties."
            )}</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-accent/10 text-accent font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
            <span>{L(
              locale,
              "我们将在2周后跟进确认一切顺利。",
              "2週間後にフォローアップのご連絡をいたします。",
              "We'll follow up with you in 2 weeks to make sure everything is going smoothly."
            )}</span>
          </li>
        </ol>
        <p className="text-xs text-gray-400 mb-8">
          {L(
            locale,
            `请保存您的参考编号（${refCode}）以便后续沟通。`,
            `参照コード（${refCode}）を今後のやり取りのために保存してください。`,
            `Save your reference code (${refCode}) for future communication.`
          )}
        </p>
        <a
          href="/properties"
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
        {L(locale, "开始咨询", "お問い合わせ", "Get Started")}
      </h1>
      <p className="text-gray-500 mb-8">
        {L(
          locale,
          "告诉我们您在寻找什么，我们将为您匹配合适的经纪人。免费咨询，无义务。",
          "ご希望の条件をお伝えください。最適なエージェントをご紹介します。無料相談、義務なし。",
          "Tell us what you're looking for and we'll connect you with the right agent. Free consultation, no obligation."
        )}
      </p>

      {property && (
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-500">{L(locale, "咨询的物件：", "お問い合わせ対象：", "Inquiring about:")}</p>
          <p className="font-semibold text-primary">{property.title}</p>
          <p className="text-sm text-gray-400">
            {property.location} ·{" "}
            {property.price === 0
              ? L(locale, "免费", "無料", "FREE")
              : `¥${property.price.toLocaleString()}`}
          </p>
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
              placeholder={L(locale, "your@email.com", "your@email.com", "your@email.com")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {L(locale, "国家/地区 *", "お住まいの国 *", "Country *")}
          </label>
          <input
            type="text"
            name="country"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder={L(locale, "您来自哪里？", "お住まいの国は？", "Where are you from?")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {L(locale, "预算范围", "ご予算", "Budget Range")}
          </label>
          <select name="budget" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white">
            <option>{L(locale, "免费 – $5,000", "無料 – $5,000", "Free – $5,000")}</option>
            <option>$5,000 – $20,000</option>
            <option>$20,000 – $50,000</option>
            <option>$50,000 – $100,000</option>
            <option>$100,000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {L(locale, "您在寻找什么？ *", "ご希望の条件 *", "What are you looking for? *")}
          </label>
          <textarea
            name="message"
            required
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder={L(
              locale,
              "请描述您理想的物件：位置偏好、用途（移住定居、度假别墅、翻新改造等）、具体需求等。",
              "ご希望の物件について教えてください：希望エリア、用途（移住・定住、セカンドハウス、リノベーションなど）、ご希望の条件など。",
              "Tell us about your ideal property: location preferences, intended use (relocation, vacation home, renovation project), and any specific requirements."
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
            : L(locale, "发送咨询（免费）", "問い合わせを送信（無料）", "Send Inquiry (Free)")}
        </button>
        <p className="text-xs text-gray-400 text-center">
          {L(
            locale,
            "我们将在48小时内回复。您的信息将被严格保密。",
            "48時間以内にご返信いたします。個人情報は厳格に管理されます。",
            "We'll respond within 48 hours. Your information is kept confidential."
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
