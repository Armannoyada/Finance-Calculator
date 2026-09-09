import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://armannoyada.github.io/Finance-Calculator/'),
  title: { default: 'FinCalc — Financial calculators for real decisions', template: '%s | FinCalc' },
  description: 'Free online calculators for loans, EMI, SIP, investments, taxes, business finance, savings and everyday money decisions.',
  keywords: ['financial calculator', 'EMI calculator', 'SIP calculator', 'loan calculator', 'GST calculator', 'tax calculator', 'investment calculator', 'finance calculator'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'FinCalc — Financial calculators for real decisions',
    description: 'Loans, investments, taxes, savings and business finance calculators in one place.',
    type: 'website',
    url: 'https://armannoyada.github.io/Finance-Calculator/',
    siteName: 'FinCalc',
  },
  twitter: { card: 'summary_large_image', title: 'FinCalc — Financial calculators for real decisions', description: 'Free, practical calculators for everyday finance.' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
