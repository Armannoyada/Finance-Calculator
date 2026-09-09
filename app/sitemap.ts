import type { MetadataRoute } from 'next';
import { toolSlugs } from './calculators/CalculatorStudio';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://armannoyada.github.io/Finance-Calculator';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/calculators/`, changeFrequency: 'weekly', priority: 0.95 },
    ...Object.values(toolSlugs).map((slug) => ({ url: `${base}/calculators/${slug}/`, changeFrequency: 'monthly' as const, priority: 0.75 })),
  ];
}
