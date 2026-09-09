# FinCalc

FinCalc is a static, mobile-friendly finance calculator suite built with Next.js and designed for GitHub Pages.

## What is included

- Loans: EMI, loan payment, amortization, loan comparison and prepayment impact
- Investments: SIP, step-up SIP, lumpsum, compound/simple interest, CAGR, SWP and SIP goal
- Tax: GST/VAT and tax-inclusive/exclusive calculations with country-aware reference defaults
- Business: ROI, profit margin, markup, discount and break-even
- Planning: savings goal, inflation and debt payoff
- Everyday: percentage, percentage change, tip and Rule of 72
- 24-country currency selector with jurisdiction-aware tax naming
- Responsive calculator studio with amortization preview
- SEO metadata, sitemap and robots support
- GitHub Pages deployment through GitHub Actions

## Important calculation note

The calculator engine uses explicit mathematical formulas. Tax values are reference defaults and are not a substitute for jurisdiction-specific professional advice or official tax guidance. Production tax modules should be versioned by country, tax year, taxpayer type and product/category before being used for filing or compliance.

## Local development

```bash
npm install
npm run dev
```

The production build is configured for a repository subpath at `/Finance-Calculator/` when `NODE_ENV=production`.
