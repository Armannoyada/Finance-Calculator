'use client';

import './live-currency.css';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, Clock3, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { countries } from '@/lib/data';

type RateResponse = { date: string; base: string; quote: string; rate: number };

const API = 'https://api.frankfurter.dev/v2/rate';
const currencyName = (code: string) => countries.find((c) => c.currency === code)?.name ?? code;
const countryForCurrency = (code: string) => countries.find((c) => c.currency === code)?.code ?? 'US';
const money = (value: number, currency: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: currency === 'JPY' || currency === 'KRW' ? 0 : 2 }).format(value);

export default function LiveCurrencyConverter() {
  const [from, setFrom] = useState('IN');
  const [to, setTo] = useState('US');
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const source = useMemo(() => countries.find((c) => c.code === from)!, [from]);
  const target = useMemo(() => countries.find((c) => c.code === to)!, [to]);

  const loadRate = async () => {
    setLoading(true);
    setError('');
    try {
      if (source.currency === target.currency) {
        setRate(1);
        setRateDate(new Date().toISOString().slice(0, 10));
        return;
      }
      const response = await fetch(`${API}/${source.currency}/${target.currency}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load the latest exchange rate.');
      const data = (await response.json()) as RateResponse;
      setRate(data.rate);
      setRateDate(data.date);
    } catch (err) {
      setRate(null);
      setRateDate(null);
      setError(err instanceof Error ? err.message : 'Unable to load the latest exchange rate.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadRate(); }, [source.currency, target.currency]);

  const converted = rate === null ? 0 : amount * rate;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <main className="live-fx-page">
      <section className="live-fx-hero">
        <div>
          <span className="live-fx-eyebrow">LIVE CURRENCY CONVERTER</span>
          <h1>Convert money using the latest available reference rate.</h1>
          <p>Choose two countries, enter an amount, and FinCalc calculates the conversion automatically.</p>
        </div>
        <div className="live-status"><span className={loading ? 'status-dot loading' : rate ? 'status-dot' : 'status-dot offline'} />{loading ? 'Updating rate…' : rate ? 'Rate loaded' : 'Rate unavailable'}</div>
      </section>

      <section className="fx-card">
        <div className="fx-field-grid">
          <label>
            <span>From</span>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {countries.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name} · {country.currency}</option>)}
            </select>
          </label>
          <label>
            <span>Amount</span>
            <div className="amount-input"><b>{source.currency}</b><input type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))} /></div>
          </label>
          <button className="swap-button" type="button" onClick={swap} aria-label="Swap currencies"><ArrowDownUp size={18} /></button>
          <label>
            <span>To</span>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {countries.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name} · {country.currency}</option>)}
            </select>
          </label>
        </div>

        <div className="fx-result">
          <div className="fx-result-meta">{source.flag} {source.name} <span>→</span> {target.flag} {target.name}</div>
          <div className="fx-result-value">{money(converted, target.currency)}</div>
          <div className="fx-rate-line">1 {source.currency} = {rate === null ? '—' : rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {target.currency}</div>
          <div className="fx-actions">
            <button type="button" onClick={() => void loadRate()} disabled={loading}><RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh rate</button>
            <span><Clock3 size={14} /> {rateDate ? `Reference date ${rateDate}` : 'No rate loaded'}</span>
          </div>
          {error && <div className="fx-error"><WifiOff size={15} /> {error}</div>}
        </div>
      </section>

      <section className="fx-info-grid">
        <article><Wifi size={17}/><div><b>Latest reference data</b><p>Rates are loaded from the public Frankfurter exchange-rate API.</p></div></article>
        <article><Clock3 size={17}/><div><b>Not a trading quote</b><p>Reference rates can differ from the rate your bank, card or broker actually gives you.</p></div></article>
        <article><ArrowDownUp size={17}/><div><b>Country to country</b><p>Swap the two countries instantly and recalculate without typing the amount again.</p></div></article>
      </section>

      <section className="fx-related">
        <span className="live-fx-eyebrow">RELATED TOOLS</span>
        <h2>More currency tools</h2>
        <div className="related-links">
          <a href="/Finance-Calculator/calculators/fx-markup-calculator/">FX Markup Calculator</a>
          <a href="/Finance-Calculator/calculators/international-transfer-cost/">International Transfer Cost</a>
          <a href="/Finance-Calculator/calculators/forward-exchange-rate-calculator/">Forward Exchange Rate</a>
          <a href="/Finance-Calculator/calculators/currency-gain-loss-calculator/">Currency Gain / Loss</a>
        </div>
      </section>
    </main>
  );
}
