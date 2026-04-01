import { MetadataRoute } from "next";
import {
  getAllPrefectureSlugs,
  PRICE_RANGES,
  INVESTMENT_TAG_PAGES,
  scrapedProperties,
} from "@/lib/scraped-properties";
import { properties } from "@/data/properties";

const BASE_URL = "https://akiya-finder.vercel.app";
const LOCALES = ["zh", "en", "ja"];

function localizedUrls(path: string): MetadataRoute.Sitemap[number]["alternates"] {
  return {
    languages: Object.fromEntries(
      LOCALES.map((locale) => [locale, `${BASE_URL}/${locale}${path}`])
    ),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPaths = [
    { path: "", priority: 1, freq: "weekly" as const },
    { path: "/properties", priority: 0.9, freq: "weekly" as const },
    { path: "/map", priority: 0.9, freq: "weekly" as const },
    { path: "/akiya-bank", priority: 0.8, freq: "weekly" as const },
    { path: "/how-it-works", priority: 0.7, freq: "monthly" as const },
    { path: "/about", priority: 0.5, freq: "monthly" as const },
    { path: "/contact", priority: 0.7, freq: "monthly" as const },
    { path: "/blog", priority: 0.7, freq: "weekly" as const },
    { path: "/prefecture", priority: 0.9, freq: "weekly" as const },
  ];

  for (const page of staticPaths) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.freq,
        priority: page.priority,
        alternates: localizedUrls(page.path),
      });
    }
  }

  // Prefecture pages
  for (const slug of getAllPrefectureSlugs()) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/prefecture/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: localizedUrls(`/prefecture/${slug}`),
      });
    }
  }

  // Price range pages
  for (const r of PRICE_RANGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/price/${r.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: localizedUrls(`/price/${r.slug}`),
      });
    }
  }

  // Tag pages
  for (const t of INVESTMENT_TAG_PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/tag/${t.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: localizedUrls(`/tag/${t.slug}`),
      });
    }
  }

  // Property detail pages
  const allPropertyIds = [
    ...properties.map((p) => p.id),
    ...scrapedProperties.map((p) => p.id),
  ];

  for (const id of allPropertyIds) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/properties/${id}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: localizedUrls(`/properties/${id}`),
      });
    }
  }

  return entries;
}
