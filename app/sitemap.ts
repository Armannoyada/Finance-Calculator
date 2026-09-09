import type { MetadataRoute } from 'next';

const slugs = [
  'emi-calculator','loan-payment','amortization-calculator','loan-comparison','loan-prepayment-calculator',
  'sip-calculator','step-up-sip-calculator','lumpsum-calculator','compound-interest-calculator','simple-interest-calculator','cagr-calculator','swp-calculator','sip-goal-calculator',
  'gst-vat-calculator','tax-inclusive-exclusive-calculator','roi-calculator','profit-margin-calculator','markup-calculator','discount-calculator','break-even-calculator',
  'savings-goal-calculator','inflation-calculator','debt-payoff-calculator','percentage-calculator','percentage-change-calculator','tip-calculator','rule-of-72-calculator',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://armannoyada.github.io/Finance-Calculator';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/calculators/`, changeFrequency: 'weekly', priority: 0.95 },
    ...slugs.map((slug) => ({ url: `${base}/calculators/${slug}/`, changeFrequency: 'monthly' as const, priority: 0.75 })),
  ];
}
