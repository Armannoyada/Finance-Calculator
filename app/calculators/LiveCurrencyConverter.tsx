'use client';

import './live-currency.css';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, Clock3, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { countries } from '@/lib/data';

type ProviderResult = {
  rate: number;
  updatedAt: string | null;
  provider: string;
  freshness: 'live' | 'hourly' | 'reference';
  marketSession?: string;
};

type ExchangeRateDevResponse = {
  result?: string;
  rates?: Record<string, number>;
  source?: string;
  market_session?: string;
  timestamp?: string;
  data_updated_at?: string;
  effective_at?: Record<string, string>;
};

type ExchangeRateFunResponse = { base?: string; date?: string; rates?: Record<string, number> };
type FrankfurterResponse = { date?: string; rate?: number; base?: string; quote?: string };

const DEV_API = 'https://api.exchangerate.dev/v1/latest';
const FUN_API = 'https://api.exchangerate.fun/latest';
const FRANKFURTER_API = 'https://api.frankfurter.dev/v2/rate';

const money = (value: number, currency: string) => new Intl.NumberFormat(undefined, {
  style: 'currency', currency,
  maximumFractionDigits: ['JPY', 'KRW'].includes(currency) ? 0 : 2,
}).format(value);

async function fetchJson<T>(url: string, timeoutMs = 9000): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json() as T;
  } finally {
    window.clearTimeout(timer);
  }
}

async function getRate(base: string, quote: string): Promise<ProviderResult> {
  if (base === quote) return { rate: 1, updatedAt: new Date().toISOString(), provider: 'Same currency', freshness: 'live' };

  try {
    const data = await fetchJson<ExchangeRateDevResponse>(`${DEV_API}/${base}?symbols=${quote}`);
    const rate = data.rates?.[quote];
    if (Number.isFinite(rate)) {
      return {
        rate: rate as number,
        updatedAt: data.effective_at?.[quote] ?? data.data_updated_at ?? data.timestamp ?? null,
        provider: 'ExchangeRate.dev',
        freshness: data.source === 'live' || data.sources?.[quote] === 'live' ? 'live' : 'reference',
        marketSession: data.market_session,
      };
    }
  } catch {
    // Continue to a broader no-key provider.
  }

  try {
    const data = await fetchJson<ExchangeRateFunResponse>(`${FUN_API}?base=${base}`);
    const rate = data.rates?.[quote];
    if (Number.isFinite(rate)) {
      return { rate: rate as number, updatedAt: data.date ? `${data.date}T00:00:00Z` : null, provider: 'ExchangeRate.fun', freshness: 'hourly' };
    }
  } catch {
    // Continue to the established ECB reference fallback.
  }

  const data = await fetchJson<FrankfurterResponse>(`${FRANKFURTER_API}/${base}/${quote}`);
  if (!Number.isFinite(data.rate)) throw new Error('No usable rate returned by available providers.');
  return { rate: data.rate as number, updatedAt: data.date ? `${data.date}T00:00:00Z` : null, provider: 'Frankfurter / ECB reference', freshness: 'reference' };
}

export default function LiveCurrencyConverter() {
  const [from, setFrom] = useState('IN');
  const [to, setTo] = useState('US');
  const [amount, setAmount] = useState(10000);
  const [rateInfo, setRateInfo] = useState<ProviderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const source = useMemo(() => countries.find((c) => c.code === from)!, [from]);
  const target = useMemo(() => countries.find((c) => c.code === to)!, [to]);

  const loadRate = async () => {
    setLoading(true);
    setError('');
    try {
      setRateInfo(await getRate(source.currency, target.currency));
    } catch (err) {
      setRateInfo(null);
      setError(err instanceof Error ? err.message : 'Unable to load exchange rates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRate();
    const refresh = window.setInterval(() => void loadRate(), 60000);
    return () => window.clearInterval(refresh);
  }, [source.currency, target.currency]);

  const converted = rateInfo ? amount * rateInfo.rate : 0;
  const inverse = rateInfo?.rate ? 1 / rateInfo.rate : null;
  const updatedLabel = rateInfo?.updatedAt ? new Date(rateInfo.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Unavailable';
  const freshnessLabel = rateInfo?.freshness === 'live' ? 'Live indicative' : rateInfo?.freshness === 'hourly' ? 'Hourly reference' : 'Daily reference';

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <main className="live-fx-page">
      <section className="live-fx-hero">
        <div>
          <span className="live-fx-eyebrow">LIVE CURRENCY CONVERTER</span>
          <h1>Convert money with the freshest available FX rate.</h1>
          <p>FinCalc checks an intraday source first, then falls back to hourly and ECB reference data when necessary.</p>
        </div>
        <div className="live-status">
          <span className={loading ? 'status-dot loading' : rateInfo ? 'status-dot' : 'status-dot offline'} />
          {loading ? 'Updating rate…' : rateInfo ? freshnessLabel : 'Rate unavailable'}
        </div>
      </section>

      <section className="fx-card">
        <div className="fx-field-grid">
          <label>
            <span>From country</span>
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
            <span>To country</span>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {countries.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name} · {country.currency}</option>)}
            </select>
          </label>
        </div>

        <div className="fx-result">
          <div className="fx-result-meta">{source.flag} {source.name} <span>→</span> {target.flag} {target.name}</div>
          <div className="fx-result-value">{rateInfo ? money(converted, target.currency) : '—'}</div>
          <div className="fx-rate-line">
            1 {source.currency} = {rateInfo ? rateInfo.rate.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '—'} {target.currency}
            {inverse ? <> · 1 {target.currency} = {inverse.toLocaleString(undefined, { maximumFractionDigits: 8 })} {source.currency}</> : null}
          </div>
          <div className="fx-actions">
            <button type="button" onClick={() => void loadRate()} disabled={loading}><RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh now</button>
            <span><Clock3 size={14} /> {updatedLabel}</span>
          </div>
          <div className="fx-source-row">
            <span><Wifi size={14} /> Source: <b>{rateInfo?.provider ?? '—'}</b></span>
            <span>Market: {rateInfo?.marketSession ?? (rateInfo?.freshness === 'hourly' ? 'hourly feed' : rateInfo?.freshness === 'reference' ? 'reference feed' : '—')}</span>
          </div>
          {error && <div className="fx-error"><WifiOff size={15} /> {error}</div>}
        </div>
      </section>

      <section className="fx-info-grid">
        <article><Wifi size={17}/><div><b>Primary live source</b><p>Actively traded currencies use ExchangeRate.dev when a live indicative quote is available.</p></div></article>
        <article><Clock3 size={17}/><div><b>Fallback chain</b><p>When live data is unavailable, FinCalc tries hourly multi-source data and then an ECB reference rate.</p></div></article>
        <article><ArrowDownUp size={17}/><div><b>Not an executable quote</b><p>Your bank, card, remittance provider or broker can apply spreads, fees and a different execution rate.</p></div></article>
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
