import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'FinCalc — Financial calculators for real decisions', description: 'Loans, investments, taxes, savings and business finance calculators.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
