import type { Metadata } from 'next';
import CalculatorStudio, { type Tool } from '../CalculatorStudio';
import LiveCurrencyConverter from '../LiveCurrencyConverter';
import { calculators, calculatorsBySlug } from '@/lib/calculator-registry';

export function generateStaticParams() {
  return calculators.map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const calculator = calculatorsBySlug[slug];
  if (!calculator) return { title: 'Calculator not found | FinCalc' };
  const canonical = `https://armannoyada.github.io/Finance-Calculator/calculators/${calculator.slug}/`;
  const isFx = calculator.slug === 'currency-converter';
  return {
    title: `${calculator.title} | Free Online Calculator | FinCalc`,
    description: isFx
      ? 'Convert currencies between countries using the latest available reference exchange rate. Compare two currencies, swap direction, and calculate instantly with FinCalc.'
      : `Free ${calculator.title.toLowerCase()} with transparent formulas, instant results, and clear assumptions. Explore ${calculator.category.toLowerCase()} calculations with FinCalc.`,
    keywords: [calculator.title, `${calculator.title} online`, `${calculator.title} calculator`, calculator.category, 'finance calculator', 'FinCalc', ...(isFx ? ['currency converter', 'live exchange rate', 'country currency converter', 'FX calculator'] : [])],
    alternates: { canonical },
    openGraph: { title: `${calculator.title} | FinCalc`, description: isFx ? 'Country-to-country currency conversion using the latest available reference rate.' : `Calculate ${calculator.title.toLowerCase()} with clear inputs and transparent assumptions.`, url: canonical, siteName: 'FinCalc', type: 'website' },
    twitter: { card: 'summary', title: `${calculator.title} | FinCalc`, description: isFx ? 'Convert currencies using the latest available reference rate.' : `Free ${calculator.title.toLowerCase()} with transparent assumptions.` },
  };
}

export default async function CalculatorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const calculator = calculatorsBySlug[slug];
  if (slug === 'currency-converter') return <LiveCurrencyConverter />;
  return <CalculatorStudio initialTool={(calculator?.title as Tool) || 'EMI Calculator'} />;
}
