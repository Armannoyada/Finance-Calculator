# FinCalc

FinCalc is a static, mobile-friendly financial calculation platform built with Next.js and designed for GitHub Pages.

## Product scope

FinCalc now contains **144 individually addressable calculators** across 12 categories:

- Loans: EMI, loan payment, amortization, comparison, prepayment, personal/home/car/education loans, affordability, interest-rate and tenure tools
- Investments: SIP, step-up SIP, lumpsum, compound/simple interest, CAGR, SWP, goals, XIRR-style growth, mutual funds, FD and RD
- Taxes: GST, VAT, sales tax, inclusive/exclusive pricing, income tax reference, salary take-home, TDS, capital gains, HRA, gratuity and tax savings
- Savings & Planning: savings goals, retirement, emergency fund, net worth, budget, 50/30/20, inflation, purchasing power, future goals, PPF, NPS and FIRE
- Business & Finance: ROI, margin, markup, discount, break-even, cash flow, invoices, depreciation, gross/net profit, contribution margin and inventory turnover
- Trading & Markets: brokerage, margin, average price, SIP vs lumpsum, leverage, position sizing, risk/reward, stop loss, target price, dividend yield, earnings yield and P/E
- Currency & FX: currency conversion, exchange rates, FX markup, travel budget, import/export costs, transfer cost, forward FX, pip value and FX gain/loss
- Everyday Math: percentage, percentage change, ratio, tips, unit price, date difference, time value of money, Rule of 72, daily growth, bill split and salary-rate tools
- Real Estate: rent vs buy, rental yield, stamp duty, down payment, appreciation, LTV, price/sq ft, affordability, closing costs, ownership cost, cap rate and price/rent
- Debt & Credit: payoff, snowball, avalanche, DTI, debt service, net debt, consolidation, refinance, credit utilization, savings rate and retirement income
- Accounting & Payroll: payroll cost, overtime, leave payout, commission, tiered commission, bonus, pay raise, back pay, gross-up, payroll tax and hourly take-home
- Insurance: term cover, premium rate, insurance gap, health cost, deductible savings, coinsurance, coverage ratio, inflation-adjusted cover, annuity payment/future value and present/future value

## Product UX

The calculator platform is designed around a fast search-and-calculate flow: category filters, calculator library, country/currency context, focused inputs, a prominent result summary, supporting metrics, formulas and assumptions. Every calculator has its own SEO-friendly route.

## SEO

Each calculator page generates its own title, description, keywords, canonical URL, Open Graph metadata and Twitter metadata. The production build also generates a sitemap containing every calculator URL, while `public/robots.txt` points crawlers to the sitemap.

## Important calculation note

The calculation engine uses explicit mathematical formulas for educational estimates. Tax, payroll, insurance, FX and market figures may require jurisdiction-specific rules, tax years, product terms, fees, rounding and official data before being used for compliance, filing or financial decisions.

## Local development

```bash
npm install
npm run dev
npm run build
```

The production build is configured for the repository subpath `/Finance-Calculator/` when `NODE_ENV=production`.
