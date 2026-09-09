import type { Metadata } from 'next';
import CalculatorStudio, { toolSlugs, toolsBySlug, type Tool } from '../CalculatorStudio';

export function generateStaticParams() {
  return Object.values(toolSlugs).map((slug) => ({ slug }));
}

const descriptions: Partial<Record<Tool, string>> = {
  'EMI Calculator': 'Estimate monthly loan EMI, total repayment and interest from principal, rate and tenure.',
  'SIP Calculator': 'Estimate SIP investment value, total contributions and projected returns.',
  'Lumpsum': 'Project the future value and returns of a one-time investment.',
  'Compound Interest': 'Calculate future value and interest with periodic compounding.',
  'CAGR': 'Calculate the annualized growth rate between an initial and final value.',
  'GST / VAT': 'Estimate tax added to or removed from a price using a reference rate.',
  'Loan Prepayment Calculator': 'Estimate interest savings and months saved from extra loan payments.',
  'Amortization': 'Preview how loan payments split between interest and principal over time.',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsBySlug[slug];
  if (!tool) return { title: 'Calculator not found' };
  return {
    title: tool,
    description: descriptions[tool] || `Use the FinCalc ${tool.toLowerCase()} for a clear, instant estimate.`,
    alternates: { canonical: `/calculators/${slug}/` },
  };
}

export default async function CalculatorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolsBySlug[slug];
  return <CalculatorStudio initialTool={tool || 'EMI Calculator'} />;
}
