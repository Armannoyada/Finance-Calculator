import type { Metadata } from 'next';
import CalculatorStudio, { type Tool } from '../CalculatorStudio';

const routes: Record<string, Tool> = {
  'emi-calculator':'EMI Calculator','loan-payment':'Loan Payment','amortization-calculator':'Amortization','loan-comparison':'Loan Comparison','loan-prepayment-calculator':'Prepayment',
  'sip-calculator':'SIP Calculator','step-up-sip-calculator':'Step-up SIP','lumpsum-calculator':'Lumpsum','compound-interest-calculator':'Compound Interest','simple-interest-calculator':'Simple Interest','cagr-calculator':'CAGR','swp-calculator':'SWP','sip-goal-calculator':'SIP Goal',
  'gst-vat-calculator':'GST / VAT','tax-inclusive-exclusive-calculator':'Tax Inclusive / Exclusive','roi-calculator':'ROI','profit-margin-calculator':'Profit Margin','markup-calculator':'Markup','discount-calculator':'Discount','break-even-calculator':'Break-even',
  'savings-goal-calculator':'Savings Goal','inflation-calculator':'Inflation','debt-payoff-calculator':'Debt Payoff','percentage-calculator':'Percentage','percentage-change-calculator':'Percentage Change','tip-calculator':'Tip Calculator','rule-of-72-calculator':'Rule of 72',
};

export function generateStaticParams() { return Object.keys(routes).map((slug) => ({ slug })); }

const descriptions: Partial<Record<Tool, string>> = {
  'EMI Calculator':'Estimate monthly loan EMI from principal, interest rate and tenure.',
  'SIP Calculator':'Estimate SIP contributions, projected value and investment returns.',
  'Lumpsum':'Project the future value of a one-time investment.',
  'Compound Interest':'Calculate future value using periodic compounding.',
  'CAGR':'Calculate annualized growth between two values.',
  'GST / VAT':'Estimate tax added to or removed from a transaction amount.',
  'Prepayment':'Estimate loan months and interest saved through extra payments.',
  'Amortization':'See how each loan payment splits between interest and principal.',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = routes[slug];
  return tool ? { title: tool, description: descriptions[tool] || `Use the FinCalc ${tool.toLowerCase()} for a clear, instant estimate.`, alternates: { canonical: `/calculators/${slug}/` } } : { title: 'Calculator not found' };
}

export default async function CalculatorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CalculatorStudio initialTool={routes[slug] || 'EMI Calculator'} />;
}
