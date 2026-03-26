"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { properties } from "@/data/properties";
import { Suspense } from "react";

function ContactForm() {
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
          Thank You for Your Inquiry!
        </h2>

        {refCode && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 inline-block">
            <p className="text-xs text-gray-400 mb-1">Your Reference Code</p>
            <p className="text-lg font-mono font-bold text-primary">{refCode}</p>
          </div>
        )}

        <p className="text-gray-600 mb-4">
          Here&apos;s what happens next:
        </p>
        <ol className="text-left max-w-md mx-auto text-gray-600 text-sm space-y-3 mb-8">
          <li className="flex gap-3">
            <span className="bg-accent/10 text-accent font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
            <span>We&apos;ll match you with a licensed Japanese real estate agent who speaks English — within 2 business days.</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-accent/10 text-accent font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
            <span>The agent will contact you directly to discuss your requirements and available properties.</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-accent/10 text-accent font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
            <span>We&apos;ll follow up with you in 2 weeks to make sure everything is going smoothly.</span>
          </li>
        </ol>
        <p className="text-xs text-gray-400 mb-8">
          Save your reference code ({refCode}) for future communication.
        </p>
        <a
          href="/properties"
          className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Browse More Properties
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Get Started
      </h1>
      <p className="text-gray-500 mb-8">
        Tell us what you&apos;re looking for and we&apos;ll connect you with the right
        agent. Free consultation, no obligation.
      </p>

      {property && (
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-500">Inquiring about:</p>
          <p className="font-semibold text-primary">{property.title}</p>
          <p className="text-sm text-gray-400">
            {property.location} ·{" "}
            {property.price === 0
              ? "FREE"
              : `¥${property.price.toLocaleString()}`}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
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
            Country *
          </label>
          <input
            type="text"
            name="country"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="Where are you from?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <select name="budget" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white">
            <option>Free – $5,000</option>
            <option>$5,000 – $20,000</option>
            <option>$20,000 – $50,000</option>
            <option>$50,000 – $100,000</option>
            <option>$100,000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What are you looking for? *
          </label>
          <textarea
            name="message"
            required
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="Tell us about your ideal property: location preferences, intended use (vacation home, investment, permanent residence), renovation willingness, etc."
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send Inquiry (Free)"}
        </button>
        <p className="text-xs text-gray-400 text-center">
          We&apos;ll respond within 48 hours. Your information is kept confidential.
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
