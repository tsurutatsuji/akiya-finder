"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const STATUS_OPTIONS = [
  {
    value: "still-looking",
    label: "Still Looking",
    emoji: "🔍",
    description: "Haven't found the right property yet",
  },
  {
    value: "in-progress",
    label: "In Progress",
    emoji: "📝",
    description: "Talking with an agent or negotiating",
  },
  {
    value: "purchased",
    label: "Purchased!",
    emoji: "🎉",
    description: "Successfully bought a property",
  },
  {
    value: "gave-up",
    label: "No Longer Interested",
    emoji: "👋",
    description: "Decided not to proceed",
  },
];

export default function TrackPage({
  params,
}: {
  params: { refCode: string };
}) {
  const [selected, setSelected] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refCode: params.refCode,
          status: selected,
          comment,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <>
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <span className="text-5xl block mb-4">🙏</span>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Thank you for your feedback!
          </h1>
          <p className="text-gray-500 mb-6">
            Your response helps us improve our service and connect buyers with
            the best agents in Japan.
          </p>
          <a
            href="/map"
            className="inline-block bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Explore More Properties
          </a>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-lg mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-primary mb-2">
          How&apos;s your property search going?
        </h1>
        <p className="text-gray-500 mb-1">
          Reference: <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">{params.refCode}</code>
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Your feedback helps us track how well our agent matching works.
        </p>

        <div className="space-y-3 mb-6">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selected === opt.value
                  ? "border-accent bg-accent/5 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-xl mr-2">{opt.emoji}</span>
              <span className="font-semibold text-primary">{opt.label}</span>
              <p className="text-gray-400 text-sm mt-0.5 ml-8">
                {opt.description}
              </p>
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any additional comments? (optional)"
          className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-4 resize-none h-20"
        />

        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
      <Footer />
    </>
  );
}
