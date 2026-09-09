'use client';
import './calculator-studio.css';
import { useMemo, useState } from 'react';
import { ArrowLeft, Calculator, Landmark, TrendingUp, ReceiptText, Percent, PiggyBank, Wallet, Sparkles } from 'lucide-react';
import {
  addTax, calculateAmortization, calculateBreakEven, calculateCAGR, calculateCompound, calculateDebtPayoff,
  calculateDiscount, calculateEMI, calculateGoalSIP, calculateInflation, calculateLumpsum, calculateMargin,
  calculateMarkup, calculatePercentage, calculatePercentageChange, calculatePrepayment, calculateROI,
  calculateRule72, calculateSavingsGoal, calculateSimpleInterest, calculateSIP, calculateStepUpSIP, calculateSWP, calculateTip,
  removeTax,
} from '@/lib/calculations';
import { countries, taxData, CountryCode } from '@/lib/data';

type Tool =
  | 'EMI Calculator' | 'Loan Payment' | 'Amortization' | 'Loan Comparison' | 'Prepayment'
  | 'SIP Calculator' | 'Step-up SIP' | 'Lumpsum' | 'Compound Interest' | 'Simple Interest' | 'CAGR' | 'SWP' | 'SIP Goal'
  | 'GST / VAT' | 'Tax Inclusive / Exclusive'
  | 'ROI' | 'Profit Margin' | 'Markup' | 'Discount' | 'Break-even'
  | 'Savings Goal' | 'Inflation' | 'Debt Payoff'
  | 'Percentage' | 'Percentage Change' | 'Tip Calculator' | 'Rule of 72';

const groups: { name: string; icon: typeof Landmark; tools: Tool[] }[] = [
  { name: 'Loans', icon: Landmark, tools: ['EMI Calculator', 'Loan Payment', 'Amortization', 'Loan Comparison', 'Prepayment'] },
  { name: 'Investments', icon: TrendingUp, tools: ['SIP Calculator', 'Step-up SIP', 'Lumpsum', 'Compound Interest', 'Simple Interest', 'CAGR', 'SWP', 'SIP Goal'] },
  { name: 'Tax', icon: ReceiptText, tools: ['GST / VAT', 'Tax Inclusive / Exclusive'] },
  { name: 'Business', icon: Percent, tools: ['ROI', 'Profit Margin', 'Markup', 'Discount', 'Break-even'] },
  { name: 'Planning', icon: PiggyBank, tools: ['Savings Goal', 'Inflation', 'Debt Payoff'] },
  { name: 'Everyday', icon: Wallet, tools: ['Percentage', 'Percentage Change', 'Tip Calculator', 'Rule of 72'] },
];

const defaults: Record<Tool, [number, number, number]> = {
  'EMI Calculator': [1000000, 8.5, 20], 'Loan Payment': [1000000, 8.5, 20], 'Amortization': [1000000, 8.5, 20], 'Loan Comparison': [1000000, 8.5, 20], 'Prepayment': [1000000, 8.5, 10000],
  'SIP Calculator': [10000, 12, 10], 'Step-up SIP': [10000, 12, 10], 'Lumpsum': [100000, 12, 10], 'Compound Interest': [100000, 12, 10], 'Simple Interest': [100000, 8, 10], 'CAGR': [100000, 250000, 5], 'SWP': [1000000, 8, 10], 'SIP Goal': [2500000, 12, 10],
  'GST / VAT': [100000, 18, 0], 'Tax Inclusive / Exclusive': [118000, 18, 0],
  'ROI': [100000, 150000, 0], 'Profit Margin': [150000, 100000, 0], 'Markup': [100000, 150000, 0], 'Discount': [100000, 10, 0], 'Break-even': [500000, 2500, 1500],
  'Savings Goal': [1000000, 8, 5], 'Inflation': [100000, 6, 10], 'Debt Payoff': [500000, 12, 15000],
  'Percentage': [50000, 18, 0], 'Percentage Change': [100, 125, 0], 'Tip Calculator': [2500, 10, 2], 'Rule of 72': [8, 0, 0],
};

function money(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
}

function numberValue(value: unknown) { return typeof value === 'number' && Number.isFinite(value) ? value : 0; }

type ResultShape = { value?: number; total?: number; finalPrice?: number; net?: number; tax?: number; invested?: number; returns?: number; interest?: number; payment?: number; newMonths?: number; monthsSaved?: number; interestSaved?: number; units?: number; perPerson?: number; months?: number; paid?: number; balance?: number; totalWithdrawn?: number };

export default function CalculatorsPage() {
  const [tool, setTool] = useState<Tool>('EMI Calculator');
  const [country, setCountry] = useState<CountryCode>('IN');
  const [values, setValues] = useState<[number, number, number]>(defaults['EMI Calculator']);
  const [taxMode, setTaxMode] = useState<'add' | 'remove'>('add');
  const meta = countries.find((x) => x.code === country)!;
  const standardTax = taxData[country].standardIndirect;

  const selectTool = (next: Tool) => {
    setTool(next);
    setValues(defaults[next]);
    if (next === 'GST / VAT') setValues([100000, standardTax || 18, 0]);
  };

  const updateValue = (index: 0 | 1 | 2, raw: string) => {
    const next = [...values] as [number, number, number];
    next[index] = Math.max(0, Number(raw) || 0);
    setValues(next);
  };

  const result = useMemo<ResultShape>(() => {
    const [a, b, c] = values;
    switch (tool) {
      case 'SIP Calculator': return calculateSIP(a, b, c);
      case 'Step-up SIP': return calculateStepUpSIP(a, b, c, 10);
      case 'Lumpsum': return calculateLumpsum(a, b, c);
      case 'Compound Interest': return calculateCompound(a, b, c);
      case 'Simple Interest': return calculateSimpleInterest(a, b, c);
      case 'CAGR': return { value: calculateCAGR(a, b, c) };
      case 'SWP': return calculateSWP(a, b, c, 10);
      case 'SIP Goal': return { value: calculateGoalSIP(a, b, c) };
      case 'GST / VAT': return taxMode === 'add' ? addTax(a, b) : removeTax(a, b);
      case 'Tax Inclusive / Exclusive': return taxMode === 'add' ? addTax(a, b) : removeTax(a, b);
      case 'ROI': return { value: calculateROI(a, b) };
      case 'Profit Margin': return { value: calculateMargin(a, b) };
      case 'Markup': return { value: calculateMarkup(a, b) };
      case 'Discount': return calculateDiscount(a, b);
      case 'Break-even': return calculateBreakEven(a, b, c);
      case 'Savings Goal': return { value: calculateSavingsGoal(a, 0, b, c) };
      case 'Inflation': return { value: calculateInflation(a, b, c) };
      case 'Debt Payoff': return calculateDebtPayoff(a, b, c);
      case 'Percentage': return { value: calculatePercentage(a, b) };
      case 'Percentage Change': return { value: calculatePercentageChange(a, b) };
      case 'Tip Calculator': return calculateTip(a, b, c);
      case 'Rule of 72': return { value: calculateRule72(a) };
      case 'Prepayment': return calculatePrepayment(a, b, c, 10000);
      case 'Loan Comparison': return { payment: calculateEMI(a, b, c), value: calculateEMI(a, b, c) };
      case 'Loan Payment':
      case 'EMI Calculator':
      case 'Amortization':
      default: return { payment: calculateEMI(a, b, c), value: calculateEMI(a, b, c) };
    }
  }, [tool, values, taxMode]);

  const percentResult = ['CAGR', 'ROI', 'Profit Margin', 'Markup', 'Percentage Change'].includes(tool);
  const primary = result.value ?? result.payment ?? result.total ?? result.finalPrice ?? result.net ?? result.units ?? result.months ?? 0;

  const inputLabels = (): [string, string, string | null] => {
    switch (tool) {
      case 'CAGR': return ['Initial value', 'Final value', 'Years'];
      case 'Percentage Change': return ['Original value', 'New value', null];
      case 'ROI': return ['Investment / cost', 'Current value', null];
      case 'Profit Margin': return ['Revenue', 'Cost', null];
      case 'Markup': return ['Cost', 'Selling price', null];
      case 'Break-even': return ['Fixed costs', 'Price / unit', 'Variable cost / unit'];
      case 'Tip Calculator': return ['Bill amount', 'Tip %', 'People'];
      case 'Rule of 72': return ['Annual return %', null, null];
      case 'Debt Payoff': return ['Debt balance', 'Annual interest %', 'Monthly payment'];
      case 'Prepayment': return ['Loan balance', 'Annual interest %', 'Extra payment / month'];
      case 'SIP Goal': return ['Target amount', 'Expected return %', 'Years'];
      case 'SWP': return ['Starting corpus', 'Monthly withdrawal', 'Annual return %'];
      case 'GST / VAT':
      case 'Tax Inclusive / Exclusive': return ['Amount', 'Tax rate %', null];
      case 'Discount': return ['Original price', 'Discount %', null];
      case 'Inflation': return ['Current amount', 'Inflation %', 'Years'];
      case 'Percentage': return ['Number', 'Percentage %', null];
      default: return ['Principal / amount', 'Annual rate %', 'Years'];
    }
  };
  const labels = inputLabels();
  const showTaxMode = tool === 'GST / VAT' || tool === 'Tax Inclusive / Exclusive';

  return (
    <main className="calculator-page">
      <header className="calculator-header">
        <a href="/Finance-Calculator/" className="back"><ArrowLeft size={17} /> FinCalc</a>
        <div className="studio-title"><Calculator size={17} /> Calculator Studio</div>
        <div className="studio-badge"><Sparkles size={14} /> 27 tools</div>
      </header>

      <div className="calculator-layout">
        <aside className="calculator-sidebar">
          <div className="side-title"><Calculator size={18} /> Tools</div>
          {groups.map((group) => {
            const Icon = group.icon;
            return <div key={group.name} className="tool-group">
              <div className="group-name"><Icon size={15} /> {group.name}</div>
              {group.tools.map((item) => <button key={item} className={tool === item ? 'tool-select active' : 'tool-select'} onClick={() => selectTool(item)}>{item}</button>)}
            </div>;
          })}
        </aside>

        <section className="calculator-workspace">
          <div className="workspace-top">
            <div>
              <span className="eyebrow">CALCULATOR</span>
              <h1>{tool}</h1>
              <p>Model a real scenario with clear assumptions and instant results.</p>
            </div>
            <select value={country} onChange={(e) => setCountry(e.target.value as CountryCode)} aria-label="Country and currency">
              {countries.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.name} — {item.currency}</option>)}
            </select>
          </div>

          <div className="calculator-card">
            {showTaxMode && <div className="mode-toggle"><button className={taxMode === 'add' ? 'selected' : ''} onClick={() => setTaxMode('add')}>Add tax</button><button className={taxMode === 'remove' ? 'selected' : ''} onClick={() => setTaxMode('remove')}>Remove tax</button><span>Reference rate: {standardTax || '—'}%</span></div>}

            <div className="inputs">
              {[0, 1, 2].map((index) => labels[index] && <label key={index}>{labels[index]}<input type="number" min="0" step="0.01" value={values[index as 0 | 1 | 2]} onChange={(e) => updateValue(index as 0 | 1 | 2, e.target.value)} /></label>)}
              {tool === 'Step-up SIP' && <label>Annual step-up %<input type="number" min="0" step="1" defaultValue="10" /></label>}
            </div>

            <div className="primary-result">
              <span>ESTIMATED RESULT</span>
              <strong>{percentResult ? `${numberValue(primary).toFixed(2)}%` : tool === 'Rule of 72' ? `${numberValue(primary).toFixed(1)} years` : tool === 'Break-even' ? `${Number.isFinite(primary) ? numberValue(primary).toFixed(0) : '—'} units` : tool === 'Debt Payoff' ? `${Number.isFinite(primary) ? numberValue(primary).toFixed(0) : '—'} months` : money(numberValue(primary), meta.currency)}</strong>
              {(result.invested !== undefined || result.returns !== undefined) && <div className="result-mini"><span>Invested {money(numberValue(result.invested), meta.currency)}</span><span>Returns {money(numberValue(result.returns), meta.currency)}</span></div>}
              {result.tax !== undefined && <div className="result-mini"><span>Tax {money(result.tax, meta.currency)}</span><span>{taxMode === 'add' ? 'Total' : 'Net'} {money(numberValue(taxMode === 'add' ? result.total : result.net), meta.currency)}</span></div>}
              {tool === 'Prepayment' && <div className="result-mini"><span>Months saved {result.monthsSaved ?? 0}</span><span>Interest saved {money(numberValue(result.interestSaved), meta.currency)}</span></div>}
              {tool === 'Tip Calculator' && <div className="result-mini"><span>Tip {money(numberValue(result.tip), meta.currency)}</span><span>Per person {money(numberValue(result.perPerson), meta.currency)}</span></div>}
            </div>

            {tool === 'Amortization' && <div className="table-wrap"><table><thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>{calculateAmortization(values[0], values[1], values[2]).rows.slice(0, 12).map((row) => <tr key={row.month}><td>{row.month}</td><td>{money(row.payment, meta.currency)}</td><td>{money(row.principal, meta.currency)}</td><td>{money(row.interest, meta.currency)}</td><td>{money(row.balance, meta.currency)}</td></tr>)}</tbody></table></div>}
            {tool === 'Amortization' && <div className="table-note">Showing the first 12 months. Total scheduled interest: {money(calculateAmortization(values[0], values[1], values[2]).totalInterest, meta.currency)}.</div>}

            <div className="assumptions"><b>About this calculation</b><p>FinCalc uses transparent mathematical models. Tax figures are reference defaults, not tax advice, and can vary by jurisdiction, filing year, taxpayer status, exemptions and transaction type.</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}
