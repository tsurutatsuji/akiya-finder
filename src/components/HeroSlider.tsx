"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const SLIDE_INTERVAL = 5000;

const REPO_BASE = "https://raw.githubusercontent.com/tsurutatsuji/akiya-finder/master/public/hero";

const heroImages = [
  {
    url: `${REPO_BASE}/spring.jpg`,
    alt: "茅葺古民家と桜 — 春の日本",
  },
  {
    url: `${REPO_BASE}/summer.jpg`,
    alt: "白川郷の合掌造りと緑の田んぼ — 夏の日本",
  },
  {
    url: `${REPO_BASE}/autumn.jpg`,
    alt: "畳の間から眺める紅葉の庭園 — 秋の日本",
  },
  {
    url: `${REPO_BASE}/winter.jpg`,
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

      {/* Dark overlay — 下部のみ薄く、画像をクリアに見せる */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Content — 左下寄せ、LUVIA風 */}
      <div className="relative z-10 flex flex-col justify-end h-full px-8 md:px-16 lg:px-24 pb-32 md:pb-40">
        <p className="text-sm md:text-base text-white/70 tracking-[0.3em] uppercase mb-4 font-light">
          {t("heroNew.subtitle", { count: totalCount.toLocaleString() })}
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide drop-shadow-lg">
          {t("heroNew.title")}
        </h1>
        <div className="mt-8">
          <Link
            href="/properties"
            className="text-white/80 hover:text-white text-sm tracking-[0.2em] uppercase border-b border-white/40 hover:border-white pb-1 transition"
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
