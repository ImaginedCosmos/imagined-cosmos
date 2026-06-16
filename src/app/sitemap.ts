import type { MetadataRoute } from "next";

const BASE = "https://imagined-cosmos.example.com";
const NOW = new Date("2026-04-21");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}`, lastModified: NOW, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/solution`, lastModified: NOW, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/solve`, lastModified: NOW, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/since-einstein`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/cosmological-constant`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/friedmann`, lastModified: NOW, changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE}/models`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/papers`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
  ];
}
