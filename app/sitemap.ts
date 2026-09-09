import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://armannoyada.github.io/Finance-Calculator';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/calculators/`, changeFrequency: 'weekly', priority: 0.95 },
  ];
}
