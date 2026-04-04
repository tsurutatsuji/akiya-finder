"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const SLIDE_INTERVAL = 5000;

const heroImages = [
  {
    url: "/hero/spring.jpg",
    alt: "茅葺古民家と桜 — 春の日本",
  },
  {
    url: "/hero/summer.jpg",
    alt: "白川郷の合掌造りと緑の田んぼ — 夏の日本",
  },
  {
    url: "/hero/autumn.jpg",
    alt: "畳の間から眺める紅葉の庭園 — 秋の日本",
  },
  {
    url: "/hero/winter.jpg",
    alt: "雪に包まれた白川郷のライトアップ — 冬の日本",
  },
];

interface HeroSliderProps {
  totalCount: number;
}

export default function HeroSlider({ totalCount }: HeroSliderProps) {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Track loaded images
  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  return (
    <section className="hero-slider relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`hero-slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* CSS gradient fallback */}
          <div className="absolute inset-0 hero-fallback-bg" />
          {/* Actual image */}
          <img
            src={image.url}
            alt={image.alt}
            loading={index === 0 ? "eager" : "lazy"}
            onLoad={() => handleImageLoad(index)}
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content — LUVIA風 2行構成 */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-8">
        {/* 英語（大きく、セリフ体） */}
        <h1 className="hero-title-en text-4xl md:text-6xl lg:text-8xl text-white tracking-[0.15em] drop-shadow-lg" style={{ fontFamily: "'Playfair Display', 'Noto Serif JP', serif" }}>
          {t("heroNew.titleEn")}
        </h1>
        {/* 日本語/中国語（その下に、小さめ） */}
        <p className="hero-title-ja text-lg md:text-2xl text-white/80 mt-4 tracking-[0.2em] font-light">
          {t("heroNew.title")}
        </p>
        {/* CTA */}
        <div className="hero-text-3 mt-12">
          <Link
            href="/properties"
            className="text-white/70 hover:text-white text-xs tracking-[0.3em] uppercase border-b border-white/30 hover:border-white pb-1 transition"
          >
            {t("heroNew.cta")} →
          </Link>
        </div>
      </div>

      {/* Scroll Down — LUVIA風 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 text-xs tracking-[0.2em] uppercase flex flex-col items-center gap-2">
        <span>Scroll</span>
        <div className="w-px h-8 bg-white/30" />
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
