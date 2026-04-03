"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
  detail: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-md"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="shrink-0 w-10 h-10 bg-green-brand/10 rounded-xl flex items-center justify-center">
                <span className="text-green-brand font-bold text-sm">Q</span>
              </div>
              <span className="font-semibold text-gray-800 text-lg pt-1">
                {item.question}
              </span>
            </div>
            <svg
              className={`shrink-0 w-5 h-5 text-gray-400 transition-transform duration-300 ml-4 ${
                openIndex === index ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`faq-answer ${openIndex === index ? "open" : ""}`}
            style={{
              maxHeight: openIndex === index ? "500px" : "0",
              padding: openIndex === index ? "0 1.5rem 1.5rem 4.5rem" : "0 1.5rem 0 4.5rem",
            }}
          >
            <p className="text-2xl font-bold text-green-brand mb-1">{item.answer}</p>
            <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
