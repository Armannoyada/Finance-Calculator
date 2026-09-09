import './globals.css';
import type { Metadata, Viewport } from 'next';

const siteUrl = 'https://armannoyada.github.io/Finance-Calculator';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FinCalc — Free Financial Calculators',
    template: '%s | FinCalc',
  },
  description: 'Free financial calculators for loans, investments, taxes, savings, business, currency, real estate and everyday money decisions.',
  applicationName: 'FinCalc',
  keywords: ['financial calculator','finance calculator','loan calculator','EMI calculator','SIP calculator','tax calculator','currency converter','investment calculator'],
  alternates: { canonical: siteUrl + '/' },
  openGraph: {
    title: 'FinCalc — Free Financial Calculators',
    description: 'A practical finance calculator toolkit with 144 focused calculators.',
    url: siteUrl,
    siteName: 'FinCalc',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinCalc — Free Financial Calculators',
    description: 'Loans, investments, taxes, savings, currency, business and everyday finance tools.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#12372f' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
