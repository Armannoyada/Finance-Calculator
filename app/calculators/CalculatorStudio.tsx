'use client';

import './calculator-studio.css';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Search, Sparkles, Landmark, TrendingUp, ReceiptText, PiggyBank, Percent, Globe2, Home, CreditCard, ShieldCheck } from 'lucide-react';
import { countries, type CountryCode } from '@/lib/data';
import { calculators, calculatorCount, calculatorsBySlug, categories, type CalculatorDefinition } from '@/lib/calculator-registry';
import { calculateTool } from '@/lib/calculator-engine';

export type Tool = string;
export const toolSlugs: Record<string, string> = Object.fromEntries(calculators.map((item) => [item.title, item.slug]));
export const toolsBySlug: Record<string, string> = Object.fromEntries(calculators.map((item) => [item.slug, item.title]));

const categoryIcon: Record<string, typeof Landmark> = {
  Loans: Landmark, Investments: TrendingUp, Taxes: ReceiptText, 'Savings & Planning': PiggyBank, 'Business & Finance': Percent,
  'Trading & Markets': TrendingUp, 'Currency & FX': Globe2, 'Everyday Math': Calculator, 'Real Estate': Home, 'Debt & Credit': CreditCard,
  'Accounting & Payroll': Landmark, Insurance: ShieldCheck,
};

const baseFor = (calculator?: CalculatorDefinition) => calculator?.defaults ?? [100000, 8, 10, 0];
function hrefFor(calculator: CalculatorDefinition) { return `/Finance-Calculator/calculators/${calculator.slug}/`; }
function format(value: number, currency: string) { return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0); }
function outputValue(value: number, output: CalculatorDefinition['output'], currency: string) {
  if (!Number.isFinite(value)) return '—';
  if (output === 'percent') return `${value.toFixed(2)}%`;
  if (output === 'months') return `${Math.max(0, value).toFixed(1)} months`;
  if (output === 'years') return `${Math.max(0, value).toFixed(1)} years`;
  if (output === 'number') return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return format(value, currency);
}

export default function CalculatorStudio({ initialTool }: { initialTool?: Tool }) {
  const initial = initialTool ? calculators.find((item) => item.title === initialTool) : undefined;
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState<CountryCode>('IN');
  const [activeSlug, setActiveSlug] = useState(initial?.slug ?? '');
  const [values, setValues] = useState<number[]>(baseFor(initial));
  const meta = countries.find((item) => item.code === country)!;
  const active = calculatorsBySlug[activeSlug] ?? initial;

  const filtered = useMemo(() => calculators.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.slug.includes(q);
    return matchesCategory && matchesQuery;
  }), [activeCategory, query]);

  const result = useMemo(() => {
    if (!active) return null;
    const [a=0,b=0,c=0,d=0] = values;
    return calculateTool(active.kind, a, b, c, d, country);
  }, [active, values, country]);

  const selectTool = (calculator: CalculatorDefinition) => {
    setActiveSlug(calculator.slug);
    setValues([...baseFor(calculator)]);
    window.history.pushState({}, '', hrefFor(calculator));
  };

  const changeField = (index: number, raw: string) => {
    const next = [...values]; next[index] = Math.max(0, Number(raw) || 0); setValues(next);
  };

  return <main className="calc-app">
    <header className="calc-topbar">
      <a href="/Finance-Calculator/" className="calc-brand"><span className="brand-mark">F</span><span>FinCalc</span></a>
      <div className="calc-top-title"><Calculator size={17}/> Financial calculators</div>
      <div className="calc-top-actions"><span className="tool-count"><Sparkles size={14}/>{calculatorCount} tools</span><select value={country} onChange={(e) => setCountry(e.target.value as CountryCode)} aria-label="Country and currency">{countries.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.name} · {item.currency}</option>)}</select></div>
    </header>

    <div className="calc-intro">
      <div><span className="eyebrow">THE FINCALC TOOLKIT</span><h1>Calculate it. Understand it. Decide.</h1><p>Focused tools for borrowing, investing, taxes, business, currency and everyday money decisions.</p></div>
      <div className="search-box"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${calculatorCount} calculators`} aria-label="Search calculators"/></div>
    </div>

    <div className="category-scroll"><button className={activeCategory==='All'?'active':''} onClick={() => setActiveCategory('All')}>All</button>{categories.map((category) => { const Icon = categoryIcon[category] ?? Calculator; return <button key={category} className={activeCategory===category?'active':''} onClick={() => setActiveCategory(category)}><Icon size={15}/>{category}</button>; })}</div>

    <div className="calc-body">
      <aside className="calc-library"><div className="library-head"><b>{filtered.length} calculators</b><span>{meta.flag} {meta.currency}</span></div><div className="library-list">{filtered.map((item) => <a href={hrefFor(item)} key={item.slug} className={active?.slug===item.slug?'library-item active':'library-item'} onClick={(e) => { e.preventDefault(); selectTool(item); }}><span><small>{item.category}</small><strong>{item.title}</strong></span><ArrowRight size={15}/></a>)}</div></aside>

      <section className="calc-panel">{active && result ? <>
        <div className="calc-panel-head"><div><span className="eyebrow">{active.category.toUpperCase()}</span><h2>{active.title}</h2><p>Enter your numbers below to get an instant estimate in {meta.currency}.</p></div><a href={hrefFor(active)} className="permalink">Open page <ArrowRight size={14}/></a></div>
        <div className="calc-work-card">
          <div className="field-grid">{active.fields.map((field, index) => <label key={field}><span>{field}</span><input type="number" min="0" step="any" value={values[index] ?? 0} onChange={(e) => changeField(index, e.target.value)}/></label>)}</div>
          <div className="answer-card"><div className="answer-label">ESTIMATED RESULT</div><div className="answer-value">{outputValue(result.value, active.output, meta.currency)}</div><div className="answer-stats">{result.secondary?.slice(0,3).map((item) => <div key={item.label}><span>{item.label}</span><b>{item.format==='percent'?`${item.value.toFixed(2)}%`:item.format==='months'?`${item.value.toFixed(1)} mo`:item.format==='years'?`${item.value.toFixed(1)} yr`:item.format==='number'?item.value.toLocaleString(undefined,{maximumFractionDigits:2}):format(item.value,meta.currency)}</b></div>)}</div></div>
          {result.schedule && <div className="schedule-card"><div className="schedule-head"><div><b>Amortization preview</b><span>First 12 months</span></div><button type="button" disabled>Export CSV</button></div><div className="table-scroll"><table><thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>{result.schedule.slice(0,12).map((row) => <tr key={row.month}><td>{row.month}</td><td>{format(row.payment,meta.currency)}</td><td>{format(row.principal,meta.currency)}</td><td>{format(row.interest,meta.currency)}</td><td>{format(row.balance,meta.currency)}</td></tr>)}</tbody></table></div></div>}
          <div className="details-grid"><article><span>How it works</span><h3>Formula</h3><p>{result.formula}</p></article><article><span>Assumptions</span><h3>Read this first</h3><p>{result.note}</p></article><article><span>Country mode</span><h3>{meta.flag} {meta.name}</h3><p>Currency: {meta.currency}. Tax-related tools use reference defaults and should not be used as filing advice.</p></article></div>
        </div>
      </> : <div className="empty-state"><Calculator size={30}/><h2>Choose a calculator</h2><p>Search the library or select a category to start.</p></div>}</section>
    </div>
    <footer className="calc-footer"><span>FinCalc · educational estimates, not financial, tax or legal advice.</span><a href="/Finance-Calculator/">Back to home</a></footer>
  </main>;
}
