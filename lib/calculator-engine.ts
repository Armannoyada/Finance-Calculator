import { calculateAmortization, calculateCAGR, calculateCompound, calculateEMI, calculateGoalSIP, calculateInflation, calculateLumpsum, calculateMargin, calculateMarkup, calculatePercentage, calculatePercentageChange, calculatePrepayment, calculateROI, calculateRule72, calculateSimpleInterest, calculateSIP, calculateStepUpSIP, calculateSWP, addTax, removeTax } from './calculations';
import { taxData, type CountryCode } from './data';

export type EngineResult = {
  value: number;
  secondary?: { label: string; value: number; format?: 'currency' | 'percent' | 'number' | 'months' | 'years' }[];
  formula: string;
  note: string;
  schedule?: { month: number; payment: number; principal: number; interest: number; balance: number }[];
};

const safe = (n: number) => (Number.isFinite(n) ? n : 0);
const monthlyRate = (annual: number) => annual / 12 / 100;
const annuityFV = (payment: number, rate: number, months: number) => {
  const r = monthlyRate(rate);
  return r === 0 ? payment * months : payment * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
};
const annuityPV = (payment: number, rate: number, months: number) => {
  const r = monthlyRate(rate);
  return r === 0 ? payment * months : payment * ((1 - Math.pow(1 + r, -months)) / r);
};
const tax = (amount: number, rate: number) => ({ tax: amount * rate / 100, total: amount * (1 + rate / 100) });

function progressiveIncomeTax(income: number, country: CountryCode) {
  const brackets = taxData[country].incomeBrackets;
  if (!brackets.length) return income * 0.2;
  let result = 0;
  for (const [from, to, rate] of brackets) result += Math.max(0, Math.min(income, to) - from) * rate / 100;
  return result;
}

export function calculateTool(kind: string, a: number, b: number, c: number, d: number, country: CountryCode): EngineResult {
  switch (kind) {
    case 'emi': case 'loan-payment': case 'personal-loan': case 'home-loan': case 'car-loan': case 'education-loan':
      { const payment = calculateEMI(a, b, c); const total = payment * c * 12; return { value: payment, secondary: [{ label: 'Total interest', value: total - a }, { label: 'Total repayment', value: total }], formula: 'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)', note: 'Assumes a constant rate and equal monthly payments.' }; }
    case 'amortization':
      { const x = calculateAmortization(a, b, c); return { value: x.payment, secondary: [{ label: 'Total interest', value: x.totalInterest }, { label: 'Total paid', value: x.totalPaid }], formula: 'Each payment = interest on opening balance + principal reduction.', note: 'The schedule is an estimate and lender rounding may differ slightly.', schedule: x.rows }; }
    case 'loan-comparison':
      { const x = calculateAmortization(a, b, d); const y = calculateAmortization(a, c, d); return { value: x.payment - y.payment, secondary: [{ label: 'Option A EMI', value: x.payment }, { label: 'Option B EMI', value: y.payment }, { label: 'Interest difference', value: x.totalInterest - y.totalInterest }], formula: 'Compare EMI and total interest using identical principal and tenure.', note: 'Positive EMI difference means Option B has the lower monthly payment.' }; }
    case 'prepayment':
      { const x = calculatePrepayment(a, b, c, d); return { value: x.monthsSaved, secondary: [{ label: 'Interest saved', value: x.interestSaved }, { label: 'New tenure', value: x.newMonths, format: 'months' }], formula: 'Recalculate the loan month-by-month after applying the extra payment.', note: 'Assumes the extra payment is made every month and there is no prepayment penalty.' }; }
    case 'mortgage-affordability':
    case 'home-affordability':
      { const available = Math.max(0, a * 0.4 - b); const pv = available <= 0 ? 0 : annuityPV(available, c, d * 12); return { value: pv, secondary: [{ label: 'Affordable monthly payment', value: available }], formula: 'Maximum loan ≈ present value of an affordable monthly payment.', note: 'Uses a 40% debt-service assumption for an educational estimate.' }; }
    case 'interest-rate':
      { let lo = 0, hi = 100; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; const p = calculateEMI(a, mid, c); if (p > b) hi = mid; else lo = mid; } return { value: (lo + hi) / 2, formula: 'Solve the EMI equation for the annual interest rate.', note: 'Binary search finds the rate consistent with the loan amount, payment and tenure.' }; }
    case 'loan-tenure':
      { const r = monthlyRate(b); const months = r === 0 ? a / c : Math.log(c / (c - a * r)) / Math.log(1 + r); return { value: Math.max(0, months), formula: 'n = −ln(1 − P·r/EMI) ÷ ln(1+r)', note: 'Monthly payment must exceed the first month interest for a finite tenure.' }; }

    case 'sip':
      { const x = calculateSIP(a, b, c); return { value: x.value, secondary: [{ label: 'Invested', value: x.invested }, { label: 'Estimated returns', value: x.returns }], formula: 'FV = PMT × [((1+r)^n − 1) ÷ r] × (1+r)', note: 'Assumes contributions at the beginning of each month and a constant annual return.' }; }
    case 'stepup-sip':
      { const x = calculateStepUpSIP(a, b, c, d); return { value: x.value, secondary: [{ label: 'Invested', value: x.invested }, { label: 'Estimated returns', value: x.returns }], formula: 'Monthly contribution increases by the step-up percentage each year.', note: 'Returns are illustrative and not guaranteed.' }; }
    case 'lumpsum': case 'mutual-fund-return':
      { const x = calculateLumpsum(a, b, c); return { value: x.value, secondary: [{ label: 'Invested', value: x.invested }, { label: 'Estimated returns', value: x.returns }], formula: 'FV = P × (1 + r)^n', note: 'Assumes annual compounding at a constant rate.' }; }
    case 'compound':
      { const x = calculateCompound(a, b, c, d || 12); return { value: x.value, secondary: [{ label: 'Interest earned', value: x.interest }], formula: 'A = P × (1 + r/m)^(m·t)', note: 'Compounding frequency is supplied by the user.' }; }
    case 'simple-interest':
      { const x = calculateSimpleInterest(a, b, c); return { value: x.value, secondary: [{ label: 'Interest', value: x.interest }], formula: 'I = P × r × t ÷ 100', note: 'Interest is calculated only on the original principal.' }; }
    case 'cagr': case 'xirr':
      return { value: calculateCAGR(a, b, c), formula: 'CAGR = (Final ÷ Initial)^(1/n) − 1', note: kind === 'xirr' ? 'This simplified XIRR view assumes one initial investment and one final value.' : 'CAGR smooths growth into a constant annualized rate.' };
    case 'swp':
      { const x = calculateSWP(a, b, c, d); return { value: x.balance, secondary: [{ label: 'Total withdrawn', value: x.totalWithdrawn }, { label: x.depleted ? 'Status' : 'Remaining corpus', value: x.balance }], formula: 'Grow the corpus monthly, then subtract the scheduled withdrawal.', note: x.depleted ? 'The corpus reaches zero before the requested horizon under these assumptions.' : 'Assumes a constant return and fixed monthly withdrawals.' }; }
    case 'sip-goal':
      return { value: calculateGoalSIP(a, b, c), formula: 'PMT = FV × r ÷ [(1+r)^n − 1] ÷ (1+r)', note: 'Shows the monthly contribution needed to reach the target.' };
    case 'fd':
      { const n = d || 4, r = b / 100; const value = a * Math.pow(1 + r / n, n * c); return { value, secondary: [{ label: 'Interest', value: value - a }], formula: 'A = P × (1 + r/n)^(n·t)', note: 'Illustrative fixed-deposit growth; actual bank products may use different compounding and taxation.' }; }
    case 'rd':
      { const x = calculateSIP(a, b, c); return { value: x.value, secondary: [{ label: 'Total deposits', value: x.invested }, { label: 'Interest', value: x.returns }], formula: 'Future value of a recurring monthly contribution stream.', note: 'Uses a monthly contribution approximation.' }; }

    case 'gst': case 'vat': case 'sales-tax':
      { const x = tax(a, b); return { value: x.total, secondary: [{ label: 'Tax', value: x.tax }, { label: 'Pre-tax amount', value: a }], formula: 'Tax = Amount × rate; Total = Amount + Tax', note: 'Reference rate only. Actual treatment depends on jurisdiction, supply type and exemptions.' }; }
    case 'tax-inclusive': return { value: a * (1 + b / 100), secondary: [{ label: 'Tax', value: a * b / 100 }, { label: 'Base price', value: a }], formula: 'Gross price = Base × (1 + tax rate)', note: 'Adds the selected reference rate.' };
    case 'tax-exclusive': { const x = removeTax(a, b); return { value: x.net, secondary: [{ label: 'Tax portion', value: x.tax }, { label: 'Gross amount', value: a }], formula: 'Net = Gross ÷ (1 + tax rate)', note: 'Extracts the tax portion from a tax-inclusive amount.' }; }
    case 'income-tax': { const income = Math.max(0, a - b); const due = progressiveIncomeTax(income, country); return { value: due, secondary: [{ label: 'Taxable income', value: income }], formula: 'Progressive slab calculation using the selected country reference table.', note: 'Reference estimates only; deductions, credits, filing status and tax-year rules can materially change actual tax.' }; }
    case 'salary-take-home': { const taxDue = a * b / 100; const net = Math.max(0, a - taxDue - d); return { value: net / 12, secondary: [{ label: 'Annual take-home', value: net }, { label: 'Estimated tax', value: taxDue }], formula: 'Net annual pay = Gross − tax − other deductions', note: 'Simplified payroll estimate.' }; }
    case 'tds': return { value: a * b / 100, secondary: [{ label: 'After TDS', value: a * (1 - b / 100) }], formula: 'TDS = Payment × withholding rate', note: 'TDS depends on the payment category and applicable rules.' };
    case 'capital-gains': { const gain = Math.max(0, a - b); return { value: gain * c / 100, secondary: [{ label: 'Capital gain', value: gain }, { label: 'Post-tax gain', value: gain * (1 - c / 100) }], formula: 'Tax = max(0, sale proceeds − cost basis) × rate', note: 'Holding-period rules and exemptions vary by jurisdiction and asset.' }; }
    case 'hra': { const basic = a, hra = b, rent = c, metro = d >= 1; const exempt = Math.max(0, Math.min(hra, rent - basic * 0.1, (metro ? 0.5 : 0.4) * basic, 300000)); return { value: exempt, secondary: [{ label: 'HRA received', value: hra }, { label: 'Taxable HRA portion', value: Math.max(0, hra - exempt) }], formula: 'Simplified HRA exemption = minimum of eligible limits', note: 'India-specific educational estimate; actual HRA rules and limits should be checked for the relevant tax year.' }; }
    case 'gratuity': return { value: b * 15 / 26 * a, formula: 'Gratuity ≈ last drawn monthly salary × 15/26 × completed years', note: 'Simplified statutory-style estimate.' };
    case 'tax-savings': return { value: a * b / 100, secondary: [{ label: 'Net cost after tax saving', value: a - a * b / 100 }], formula: 'Estimated tax saving = eligible investment × marginal rate', note: 'Eligibility and deduction caps depend on jurisdiction and tax regime.' };

    case 'savings-goal': { const futureExisting = b * Math.pow(1 + c / 100, d); const monthly = calculateGoalSIP(Math.max(0, a - futureExisting), c, d); return { value: monthly, secondary: [{ label: 'Future value of current savings', value: futureExisting }], formula: 'Required monthly contribution to close the gap after growth.', note: 'Assumes the current balance compounds at the same rate.' }; }
    case 'retirement': { const futureExpenses = a * Math.pow(1 + b / 100, c); const corpus = futureExpenses * (25); return { value: corpus, secondary: [{ label: 'Future annual expenses', value: futureExpenses }], formula: 'Future expenses × 25 (4% withdrawal heuristic)', note: 'The 25× rule is a planning heuristic, not a guarantee.' }; }
    case 'emergency-fund': return { value: a * b, secondary: [{ label: 'Monthly expenses', value: a }], formula: 'Emergency fund = monthly essential expenses × target months', note: 'Choose the number of months based on income stability and obligations.' };
    case 'net-worth': return { value: a + b - c, secondary: [{ label: 'Total assets', value: a + b }, { label: 'Liabilities', value: c }], formula: 'Net worth = total assets − total liabilities', note: 'Use current market values where practical.' };
    case 'budget': return { value: a * d / 100, secondary: [{ label: 'Needs', value: a * b / 100 }, { label: 'Wants', value: a * c / 100 }, { label: 'Savings', value: a * d / 100 }], formula: 'Category amount = income × category percentage', note: 'Percentages should normally sum to 100%.' };
    case '503020': return { value: a * 0.2, secondary: [{ label: 'Needs 50%', value: a * 0.5 }, { label: 'Wants 30%', value: a * 0.3 }, { label: 'Savings 20%', value: a * 0.2 }], formula: '50/30/20 = needs / wants / savings', note: 'A budgeting guideline rather than a requirement.' };
    case 'inflation': case 'future-goal': return { value: a * Math.pow(1 + b / 100, c), formula: 'Future amount = Current amount × (1 + inflation)^years', note: 'Inflation can vary materially over time.' };
    case 'purchasing-power': return { value: a / Math.pow(1 + b / 100, c), formula: 'Purchasing power = Current amount ÷ (1 + inflation)^years', note: 'Expresses a future amount in today’s purchasing-power terms.' };
    case 'ppf': { const value = annuityFV(a / 12, b, c * 12); return { value, secondary: [{ label: 'Contributions', value: a * c }, { label: 'Growth', value: value - a * c }], formula: 'Monthly equivalent of annual contribution compounded over the term.', note: 'PPF rules have product-specific limits and compounding conventions; verify before using for decisions.' }; }
    case 'nps': { const value = annuityFV(a, b, c * 12); return { value, secondary: [{ label: 'Contributions', value: a * 12 * c }, { label: 'Estimated growth', value: value - a * 12 * c }], formula: 'Future value of monthly contributions.', note: 'Market-linked returns are not guaranteed.' }; }
    case 'fire': return { value: a / (b / 100), secondary: [{ label: 'Current annual expenses', value: a }], formula: 'FIRE number = annual expenses ÷ withdrawal rate', note: 'Withdrawal-rate assumptions should be stress-tested.' };

    case 'roi': return { value: calculateROI(a, b), secondary: [{ label: 'Gain / loss', value: b - a }], formula: 'ROI = (Value − Cost) ÷ Cost × 100', note: 'Does not account for time, taxes or cash-flow timing.' };
    case 'margin': return { value: calculateMargin(a, b), secondary: [{ label: 'Gross profit', value: a - b }], formula: 'Margin = (Revenue − Cost) ÷ Revenue × 100', note: 'Clarify whether cost means COGS or total costs before using for reporting.' };
    case 'markup': return { value: calculateMarkup(a, b), secondary: [{ label: 'Gross profit', value: b - a }], formula: 'Markup = (Selling price − Cost) ÷ Cost × 100', note: 'Markup and margin use different denominators.' };
    case 'discount': { const x = a * b / 100; return { value: a - x, secondary: [{ label: 'Discount amount', value: x }], formula: 'Final price = Original price × (1 − discount rate)', note: 'Excludes tax and shipping.' }; }
    case 'break-even': { const contribution = b - c; const units = contribution > 0 ? a / contribution : 0; return { value: units, secondary: [{ label: 'Contribution / unit', value: contribution }], formula: 'Break-even units = Fixed costs ÷ (Price − variable cost)', note: 'Requires a positive contribution margin.' }; }
    case 'cash-flow': return { value: a + b - c, secondary: [{ label: 'Net change', value: b - c }], formula: 'Ending cash = Opening cash + inflows − outflows', note: 'A simple cash movement view, not a full cash-flow statement.' };
    case 'invoice': { const subtotalAfterDiscount = a * (1 - c / 100); const taxAmount = subtotalAfterDiscount * b / 100; return { value: subtotalAfterDiscount + taxAmount, secondary: [{ label: 'Discount', value: a * c / 100 }, { label: 'Tax', value: taxAmount }], formula: 'Invoice total = (Subtotal − discount) + tax', note: 'Does not model line-level tax differences.' }; }
    case 'depreciation': return { value: Math.max(0, (a - b) / c), secondary: [{ label: 'Total depreciable base', value: Math.max(0, a - b) }], formula: 'Straight-line depreciation = (Cost − salvage) ÷ useful life', note: 'Uses straight-line depreciation only.' };
    case 'gross-profit': return { value: a - b, secondary: [{ label: 'Gross margin', value: a ? (a - b) / a * 100 : 0, format: 'percent' }], formula: 'Gross profit = Revenue − COGS', note: 'Gross profit excludes operating expenses and financing costs.' };
    case 'net-profit': { const pretax = a - b; const taxAmount = Math.max(0, pretax) * c / 100; return { value: pretax - taxAmount, secondary: [{ label: 'Pre-tax profit', value: pretax }, { label: 'Estimated tax', value: taxAmount }], formula: 'Net profit = Revenue − costs − tax on positive profit', note: 'Actual tax accounting can be more complex.' }; }
    case 'contribution-margin': return { value: a ? (a - b) / a * 100 : 0, secondary: [{ label: 'Contribution amount', value: a - b }], formula: 'Contribution margin = (Revenue − variable costs) ÷ Revenue × 100', note: 'Used to assess how sales cover fixed costs.' };
    case 'inventory-turnover': return { value: c ? a / b : 0, formula: 'Inventory turnover = COGS ÷ average inventory', note: 'Use consistent valuation periods.' };

    case 'brokerage': { const fees = a * (b + c) / 100; return { value: fees, secondary: [{ label: 'Net trade value', value: a + fees }], formula: 'Estimated charges = trade value × (brokerage + other charge rates)', note: 'Broker, exchange, taxes and transaction-specific charges vary by market.' }; }
    case 'margin-requirement': return { value: a * b / 100, secondary: [{ label: 'Capital remaining', value: a * (1 - b / 100) }], formula: 'Required margin = position value × margin %', note: 'Actual broker margin can differ by instrument and volatility.' };
    case 'stock-average': { const shares = a + c; const avg = shares ? (a * b + c * d) / shares : 0; return { value: avg, secondary: [{ label: 'Combined shares', value: shares, format: 'number' }], formula: 'Average price = total cost ÷ total shares', note: 'Ignores brokerage and taxes.' }; }
    case 'sip-vs-lumpsum': { const l = calculateLumpsum(a, b, c).value; const s = calculateSIP(a / (c * 12), b, c).value; return { value: l - s, secondary: [{ label: 'Lumpsum value', value: l }, { label: 'SIP value', value: s }], formula: 'Compare a one-time investment with equal monthly contributions.', note: 'The comparison depends heavily on market timing and return assumptions.' }; }
    case 'leverage': return { value: a * b, secondary: [{ label: 'Leverage exposure', value: a * b }], formula: 'Exposure = capital × leverage multiple', note: 'Leverage magnifies both gains and losses.' };
    case 'position-size': { const riskBudget = a * b / 100; const riskPerShare = Math.abs(c - d); return { value: riskPerShare ? riskBudget / riskPerShare : 0, secondary: [{ label: 'Risk budget', value: riskBudget }, { label: 'Per-share risk', value: riskPerShare }], formula: 'Position size = risk budget ÷ risk per share', note: 'Round down to tradable units and account for fees/slippage.' }; }
    case 'risk-reward': { const risk = Math.abs(a - b), reward = Math.abs(c - a); return { value: risk ? reward / risk : 0, secondary: [{ label: 'Risk', value: risk }, { label: 'Reward', value: reward }], formula: 'Risk/reward = potential reward ÷ potential risk', note: 'A ratio does not guarantee profitability.' }; }
    case 'stop-loss': return { value: a * (1 - b / 100), formula: 'Stop price = Entry × (1 − risk %)', note: 'Actual execution can differ because of gaps and slippage.' };
    case 'profit-target': return { value: a * (1 + b / 100), formula: 'Target price = Entry × (1 + gain %)', note: 'Illustrative target only.' };
    case 'dividend-yield': return { value: b ? a / b * 100 : 0, formula: 'Dividend yield = annual dividend per share ÷ share price × 100', note: 'Yield changes as the share price changes.' };
    case 'earnings-yield': return { value: b ? a / b * 100 : 0, formula: 'Earnings yield = EPS ÷ share price × 100', note: 'The inverse of a simple P/E ratio.' };
    case 'pe-ratio': return { value: b ? a / b : 0, formula: 'P/E = share price ÷ EPS', note: 'Negative EPS produces limited interpretive value.' };

    case 'currency-converter': case 'exchange-rate': return { value: a * b, secondary: [{ label: 'Rate used', value: b }], formula: 'Converted amount = source amount × exchange rate', note: 'Use a live provider rate for execution; this calculator uses the entered reference rate.' };
    case 'fx-markup': { const effectiveRate = b * (1 - c / 100); return { value: a * effectiveRate, secondary: [{ label: 'Reference converted amount', value: a * b }, { label: 'FX markup cost', value: a * b - a * effectiveRate }], formula: 'Effective rate = mid-market rate × (1 − markup)', note: 'Provider fees may be charged separately.' }; }
    case 'travel-currency': return { value: a / Math.max(1, c) * b, secondary: [{ label: 'Budget / day', value: a / Math.max(1, c) }], formula: 'Local daily budget = total budget ÷ days × FX rate', note: 'Add card fees and cash withdrawal charges for a realistic travel budget.' };
    case 'import-cost': { const landed = (a + b) * (1 + c / 100); return { value: landed * d, secondary: [{ label: 'Landed cost before FX', value: landed }, { label: 'Duty', value: (a + b) * c / 100 }], formula: 'Landed cost = (goods + freight/insurance) × (1 + duty) × FX rate', note: 'Does not include broker, storage or local tax charges.' }; }
    case 'export-proceeds': { const gross = a * d; const fee = gross * b / 100; return { value: gross - fee, secondary: [{ label: 'Gross converted proceeds', value: gross }, { label: 'Bank fee', value: fee }], formula: 'Net proceeds = invoice × FX rate − bank fee', note: 'Real bank conversion rates can differ from mid-market rates.' }; }
    case 'transfer-cost': { const markup = a * c / 100; return { value: b + markup, secondary: [{ label: 'Total transfer cost', value: b + markup }, { label: 'FX markup', value: markup }], formula: 'Total cost = provider fee + amount × FX markup', note: 'Receiving-bank fees may be separate.' }; }
    case 'fx-purchasing-power': return { value: a * b / Math.pow(1 + c / 100, 1), formula: 'Approximate converted purchasing power after one inflation year.', note: 'Simplified illustration rather than a consumer-price parity model.' };
    case 'fx-change': return { value: b ? (b - a) / Math.abs(a) * 100 : 0, formula: 'FX change = (new rate − old rate) ÷ old rate × 100', note: 'Positive values indicate the quoted rate increased.' };
    case 'forward-fx': { const years = d / 12; const fwd = a * Math.pow(1 + b / 100, years) / Math.pow(1 + c / 100, years); return { value: fwd, formula: 'Forward rate ≈ Spot × (1+domestic rate)^t ÷ (1+foreign rate)^t', note: 'Illustrative covered-interest-parity estimate.' }; }
    case 'pip-value': return { value: a * b / Math.max(0.000001, c), formula: 'Simplified pip-value estimate based on trade size, pip size and quote rate.', note: 'Pip valuation depends on the pair and account currency.' };
    case 'currency-gain-loss': { const gain = a * (c - b); return { value: gain, secondary: [{ label: 'Original foreign amount', value: a * b }], formula: 'Gain/loss = foreign amount × (sell rate − buy rate)', note: 'Excludes transfer fees and taxes.' }; }

    case 'percentage': return { value: calculatePercentage(a, b), formula: 'Part = Whole × percentage ÷ 100', note: 'Returns the percentage value of the entered number.' };
    case 'percentage-change': return { value: calculatePercentageChange(a, b), formula: 'Change % = (new − old) ÷ |old| × 100', note: 'Uses absolute old value as the denominator.' };
    case 'ratio': return { value: b ? a / b : 0, secondary: [{ label: 'Ratio form', value: a / Math.max(0.000001, b) }], formula: 'Ratio = A ÷ B', note: 'A result of 0.67 corresponds approximately to 2:3.' };
    case 'tip': { const t = a * b / 100; return { value: a + t, secondary: [{ label: 'Tip', value: t }, { label: 'Per person', value: (a + t) / Math.max(1, c) }], formula: 'Tip = bill × rate; total = bill + tip', note: 'Service charge, tax and rounding may differ by venue.' }; }
    case 'unit-price': return { value: b ? a / b : 0, formula: 'Unit price = total price ÷ quantity', note: 'Useful for comparing pack sizes.' };
    case 'date-difference': return { value: a, formula: 'Date difference = end date − start date, expressed here as entered days.', note: 'Use an exact calendar-date tool for month/year-sensitive calculations.' };
    case 'tvm': { const fv = a * Math.pow(1 + b / 100, c) + annuityFV(d, b, c * 12); return { value: fv, formula: 'FV = PV × (1+r)^n + FV of recurring cash flow', note: 'Assumes regular annual-equivalent growth and monthly cash-flow timing.' }; }
    case 'rule72': return { value: calculateRule72(a), formula: 'Doubling time ≈ 72 ÷ annual rate', note: 'Rule of 72 is a quick approximation.' };
    case 'daily-growth': return { value: a * Math.pow(1 + b / 100, c), formula: 'FV = Principal × (1 + daily rate)^days', note: 'Tiny daily rates compound quickly; enter the intended rate carefully.' };
    case 'bill-split': { const service = a * c / 100; return { value: (a + service) / Math.max(1, b), secondary: [{ label: 'Service charge', value: service }, { label: 'Total bill', value: a + service }], formula: 'Per person = (bill + service charge) ÷ people', note: 'Add tax separately when it is not already included.' }; }
    case 'hourly-rate': return { value: a / Math.max(1, b * c), formula: 'Hourly rate = annual income ÷ annual work hours', note: 'Benefits, bonuses and unpaid time can change the true effective hourly rate.' };
    case 'annual-salary': return { value: a * b * c, formula: 'Annual salary = hourly rate × weekly hours × working weeks', note: 'Assumes the same hours and rate across the year.' };

    case 'rent-vs-buy': { const rentCost = b * 12 * d; const buyInterest = calculateAmortization(a, c, d).totalInterest; return { value: buyInterest - rentCost, secondary: [{ label: 'Estimated rent cost', value: rentCost }, { label: 'Loan interest', value: buyInterest }], formula: 'Compare a simplified rent outlay with mortgage interest.', note: 'Excludes property appreciation, taxes, maintenance, transaction costs and investment opportunity cost.' }; }
    case 'rental-yield': return { value: b ? a / b * 100 : 0, formula: 'Rental yield = annual rent ÷ property value × 100', note: 'Gross yield before operating expenses.' };
    case 'stamp-duty': return { value: a * b / 100 + c, secondary: [{ label: 'Stamp duty', value: a * b / 100 }], formula: 'Total government/registration estimate = property value × duty rate + registration fee', note: 'Actual charges depend on location, buyer type and property category.' };
    case 'down-payment': return { value: a * b / 100, secondary: [{ label: 'Estimated loan amount', value: a * (1 - b / 100) }], formula: 'Down payment = price × down-payment %', note: 'Lenders may have additional eligibility requirements.' };
    case 'property-appreciation': return { value: a * Math.pow(1 + b / 100, c), secondary: [{ label: 'Total growth', value: a * (Math.pow(1 + b / 100, c) - 1) }], formula: 'Future value = current value × (1 + appreciation)^years', note: 'Property values are not guaranteed to appreciate at a constant rate.' };
    case 'ltv': return { value: b ? a / b * 100 : 0, formula: 'LTV = loan amount ÷ property value × 100', note: 'Lender limits vary by property type and borrower profile.' };
    case 'property-sqft': return { value: b ? a / b : 0, formula: 'Price per sq ft = total property price ÷ area', note: 'Keep area units consistent.' };
    case 'closing-cost': return { value: a * (b + c) / 100, secondary: [{ label: 'Property price', value: a }], formula: 'Closing costs = price × combined fees/taxes', note: 'Local transaction costs vary.' };
    case 'ownership-cost': return { value: a + b + c + d, formula: 'Monthly ownership cost = EMI + maintenance + property tax + insurance', note: 'Excludes one-off repairs and transaction costs.' };
    case 'cap-rate': return { value: b ? a / b * 100 : 0, formula: 'Cap rate = net operating income ÷ property value × 100', note: 'Use stabilized NOI for a meaningful comparison.' };
    case 'price-rent': return { value: b ? a / b : 0, formula: 'Price-to-rent = property price ÷ annual rent', note: 'Lower ratios can indicate stronger rental economics, but local markets differ.' };

    case 'debt-payoff': case 'snowball': case 'avalanche': { const r = monthlyRate(b); let bal = a, months = 0, interest = 0; while (bal > 0.005 && months < 1200) { months += 1; const i = bal * r; if (c <= i && r > 0) return { value: 0, secondary: [{ label: 'Status', value: 0 }], formula: 'Monthly interest exceeds or equals the planned payment.', note: 'Increase the monthly payment to make progress.' }; interest += i; bal = Math.max(0, bal - (Math.min(bal + i, c) - i)); } return { value: months, secondary: [{ label: 'Interest paid', value: interest }, { label: 'Total paid', value: a + interest }], formula: 'Iterative monthly debt balance calculation.', note: kind === 'snowball' ? 'Snowball prioritizes smaller balances; this single-balance estimate shows the timeline component.' : kind === 'avalanche' ? 'Avalanche prioritizes highest rates; this single-balance estimate shows the timeline component.' : 'Assumes a fixed payment and rate.' }; }
    case 'dti': return { value: b ? a / b * 100 : 0, formula: 'DTI = monthly debt payments ÷ gross monthly income × 100', note: 'Lenders use their own underwriting definitions.' };
    case 'dsr': return { value: b ? a / b * 100 : 0, formula: 'Debt service ratio = annual debt service ÷ annual income × 100', note: 'A common affordability indicator.' };
    case 'net-debt': return { value: a - b, formula: 'Net debt = total debt − cash and cash equivalents', note: 'Useful for balance-sheet leverage analysis.' };
    case 'consolidation': { const oldP = calculateAmortization(a, b, c).totalInterest; const newP = calculateAmortization(a, c, d).totalInterest; return { value: oldP - newP, secondary: [{ label: 'Old interest', value: oldP }, { label: 'New interest', value: newP }], formula: 'Interest savings = old scheduled interest − new scheduled interest', note: 'Compare fees and tenure, not just the interest rate.' }; }
    case 'refinance': { const oldP = calculateAmortization(a, b, d).totalInterest; const newP = calculateAmortization(a, c, d).totalInterest; return { value: oldP - newP, secondary: [{ label: 'Old interest', value: oldP }, { label: 'New interest', value: newP }], formula: 'Refinance savings = old interest − new interest', note: 'Subtract refinancing fees for a net-savings decision.' }; }
    case 'credit-utilization': return { value: b ? a / b * 100 : 0, formula: 'Utilization = card balance ÷ credit limit × 100', note: 'Lower utilization is generally healthier, but credit scoring varies by market.' };
    case 'savings-rate': return { value: b ? c / a * 100 : 0, formula: 'Savings rate = monthly savings ÷ monthly income × 100', note: 'Define savings consistently before comparing months.' };
    case 'fire-number': return { value: a / (b / 100), formula: 'Required corpus = annual expenses ÷ withdrawal rate', note: 'Planning heuristic; use a range of assumptions.' };
    case 'retirement-income': return { value: a * b / 100 / 12, secondary: [{ label: 'Annual withdrawal', value: a * b / 100 }], formula: 'Monthly retirement income = corpus × withdrawal rate ÷ 12', note: 'Actual sustainable withdrawals depend on returns, inflation and sequence risk.' };

    case 'payroll-cost': { const employerTax = a * b / 100; return { value: a + employerTax + c * 12, secondary: [{ label: 'Employer tax', value: employerTax }], formula: 'Annual payroll cost = gross payroll + employer tax + annual benefits', note: 'Local payroll rules can add more components.' }; }
    case 'overtime': return { value: a * b * c, formula: 'Overtime pay = hourly rate × overtime hours × multiplier', note: 'Use the legally applicable overtime multiplier for payroll.' };
    case 'leave-payout': return { value: a * b, formula: 'Leave payout = daily pay × unused days', note: 'Payout rules vary by employer and jurisdiction.' };
    case 'commission': return { value: a * b / 100, formula: 'Commission = sales value × commission rate', note: 'Check whether rates apply to gross or net sales.' };
    case 'tiered-commission': return { value: a * (b + c) / 100, secondary: [{ label: 'Base commission', value: a * b / 100 }, { label: 'Bonus commission', value: a * c / 100 }], formula: 'Simplified tiered commission = sales × (base + bonus)', note: 'True tiered plans can have multiple bands.' };
    case 'bonus': return { value: a * b / 100, formula: 'Bonus = base salary × bonus rate', note: 'Tax treatment is not included.' };
    case 'pay-raise': return { value: a * (1 + b / 100), secondary: [{ label: 'Increase amount', value: a * b / 100 }], formula: 'New salary = current salary × (1 + raise %)', note: 'Use the same pay period for both figures.' };
    case 'back-pay': return { value: a * b, formula: 'Back pay = monthly difference × months owed', note: 'Interest, payroll taxes and statutory adjustments are not included.' };
    case 'gross-up': return { value: b >= 100 ? 0 : a / (1 - b / 100), formula: 'Gross pay = Net ÷ (1 − tax rate)', note: 'Simplified gross-up with a single withholding rate.' };
    case 'payroll-tax': return { value: a * b / 100, secondary: [{ label: 'Net before other deductions', value: a * (1 - b / 100) }], formula: 'Payroll tax = gross pay × payroll tax rate', note: 'Real payroll taxes can contain caps and multiple components.' };
    case 'overtime-diff': return { value: a * (1 + b / 100), secondary: [{ label: 'Premium amount', value: a * b / 100 }], formula: 'Premium hourly rate = regular rate × (1 + premium %)', note: 'Use the applicable overtime rules for payroll.' };
    case 'takehome-hour': return { value: b ? a / b : 0, formula: 'Take-home per hour = net annual income ÷ annual work hours', note: 'Use actual productive hours for a more realistic measure.' };

    case 'term-cover': return { value: Math.max(0, a * b + c - d), secondary: [{ label: 'Income replacement need', value: a * b }], formula: 'Cover need = years of income + liabilities − assets', note: 'A needs-analysis model should also consider dependents and future goals.' };
    case 'premium-rate': return { value: b ? a / b * 100 : 0, formula: 'Premium rate = premium ÷ coverage × 100', note: 'Not an insurance pricing model.' };
    case 'insurance-gap': return { value: Math.max(0, a - b), formula: 'Insurance gap = required cover − existing cover', note: 'Review coverage periodically as income and obligations change.' };
    case 'health-cost': return { value: a * Math.max(1, b) * Math.pow(1 + c / 100, 5), secondary: [{ label: 'Current family premium', value: a * Math.max(1, b) }], formula: 'Illustrative premium growth = base premium × family members × inflation factor', note: 'Insurance premiums depend on age, location, claims history and policy terms.' };
    case 'deductible': return { value: a - b, secondary: [{ label: 'Expected annual premium saving', value: a - b }, { label: 'Expected claims', value: c }], formula: 'Premium saving = premium without deductible − premium with deductible', note: 'Compare expected claim frequency before choosing a deductible.' };
    case 'coinsurance': { const afterDed = Math.max(0, a - b); return { value: afterDed * (c / 100), secondary: [{ label: 'Insurer portion', value: afterDed * (1 - c / 100) }], formula: 'Patient coinsurance = (claim − deductible) × coinsurance %', note: 'Policy limits and out-of-pocket maximums are excluded.' }; }
    case 'coverage-ratio': return { value: b ? a / b * 100 : 0, formula: 'Premium-to-cover ratio = annual premium ÷ coverage × 100', note: 'Use only as a rough comparison metric.' };
    case 'inflation-cover': return { value: a * Math.pow(1 + b / 100, c), formula: 'Future cover need = current cover × (1 + inflation)^years', note: 'Healthcare and replacement-cost inflation may differ from headline CPI.' };
    case 'annuity-payment': { const r = monthlyRate(b), n = c * 12, pmt = r === 0 ? a / n : a * r / (1 - Math.pow(1 + r, -n)); return { value: pmt, formula: 'PMT = PV × r ÷ [1 − (1+r)^−n]', note: 'Monthly payout estimate for a level-payment annuity.' }; }
    case 'annuity-future': return { value: annuityFV(a, b, c * 12), formula: 'FV annuity = PMT × [((1+r)^n − 1) ÷ r] × (1+r)', note: 'Assumes regular monthly payments.' };
    case 'present-value': { const pv = b === 0 ? a : a / Math.pow(1 + b / 100, c); return { value: pv, formula: 'PV = FV ÷ (1+r)^n', note: 'Discounts a future amount to today.' }; }
    case 'future-value': return { value: a * Math.pow(1 + b / 100, c), formula: 'FV = PV × (1+r)^n', note: 'Compounds a present amount at a constant annual rate.' };
    default:
      return { value: safe(a), formula: 'No formula mapped.', note: 'This calculator is available as a dedicated URL and will be expanded with jurisdiction-specific logic.' };
  }
}
