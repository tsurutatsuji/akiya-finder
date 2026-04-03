"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const SLIDE_INTERVAL = 5000;

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=1920&q=80",
    alt: "Traditional Japanese house with natural surroundings",
  },
  {
    url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80",
    alt: "Japanese countryside landscape",
  },
  {
    url: "https://images.unsplash.com/photo-1522623349500-de37a56ea2a5?w=1920&q=80",
    alt: "Shirakawa-go village in winter snow",
  },
  {
    url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80",
    alt: "Cherry blossoms in Japan spring",
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
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              loadedImages.has(index) ? "opacity-100" : "opacity-0"
            }`}
            width={1920}
            height={1080}
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
          {t("heroNew.title")}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
          {t("heroNew.subtitle", { count: totalCount.toLocaleString() })}
        </p>

        {/* CTA */}
        <Link
          href="/properties"
          className="bg-accent hover:bg-red-600 text-white px-10 py-4 rounded-xl font-semibold transition text-lg shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40"
        >
          {t("heroNew.cta")}
        </Link>
      </div>

      {/* Stats bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center gap-8 md:gap-16 text-white">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-accent">{totalCount.toLocaleString()}+</p>
            <p className="text-xs md:text-sm text-gray-300">{t("heroNew.statProperties")}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-accent">47</p>
            <p className="text-xs md:text-sm text-gray-300">{t("heroNew.statPrefectures")}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-accent">3</p>
            <p className="text-xs md:text-sm text-gray-300">{t("heroNew.statLanguages")}</p>
          </div>
        </div>
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
