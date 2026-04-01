import { MetadataRoute } from "next";
import {
  getAllPrefectureSlugs,
  PRICE_RANGES,
  INVESTMENT_TAG_PAGES,
  scrapedProperties,
} from "@/lib/scraped-properties";
import { properties } from "@/data/properties";

const BASE_URL = "https://akiya-finder.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/properties`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/map`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/akiya-bank`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  // 都道府県インデックス
  const prefectureIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/prefecture`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // 都道府県別ページ
  const prefecturePages: MetadataRoute.Sitemap = getAllPrefectureSlugs().map(
    (slug) => ({
      url: `${BASE_URL}/prefecture/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // 価格帯ページ
  const pricePages: MetadataRoute.Sitemap = PRICE_RANGES.map((r) => ({
    url: `${BASE_URL}/price/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 投資タグページ
  const tagPages: MetadataRoute.Sitemap = INVESTMENT_TAG_PAGES.map((t) => ({
    url: `${BASE_URL}/tag/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 物件詳細ページ（staticデータ）
  const propertyPages: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${BASE_URL}/properties/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...prefectureIndex,
    ...prefecturePages,
    ...pricePages,
    ...tagPages,
    ...propertyPages,
  ];
}
