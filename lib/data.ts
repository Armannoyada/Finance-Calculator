export const countries = [
  { code: 'IN', name: 'India', currency: 'INR', flag: '🇮🇳' },
  { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', flag: '🇳🇿' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', flag: '🇸🇬' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', flag: '🇸🇦' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
  { code: 'DE', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  { code: 'FR', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', currency: 'EUR', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', currency: 'EUR', flag: '🇪🇺' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', flag: '🇨🇭' },
  { code: 'NO', name: 'Norway', currency: 'NOK', flag: '🇳🇴' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', flag: '🇸🇪' },
  { code: 'JP', name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', flag: '🇰🇷' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', flag: '🇧🇷' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', flag: '🇭🇰' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', flag: '🇲🇾' },
] as const;

type IncomeBracket = readonly [number, number, number];
const emptyIncomeBrackets: IncomeBracket[] = [];

// Reference defaults only. Indirect tax can depend on product, province/state,
// taxpayer status and filing period; unsupported jurisdictions intentionally use 0
// here so the UI displays “—” instead of implying a verified tax rate.
export const taxData = {
  IN: { indirectName: 'GST', standardIndirect: 18, incomeBrackets: emptyIncomeBrackets },
  US: { indirectName: 'Sales Tax', standardIndirect: 0, incomeBrackets: emptyIncomeBrackets },
  GB: { indirectName: 'VAT', standardIndirect: 20, incomeBrackets: emptyIncomeBrackets },
  CA: { indirectName: 'GST/HST', standardIndirect: 5, incomeBrackets: emptyIncomeBrackets },
  AU: { indirectName: 'GST', standardIndirect: 10, incomeBrackets: emptyIncomeBrackets },
  NZ: { indirectName: 'GST', standardIndirect: 15, incomeBrackets: emptyIncomeBrackets },
  SG: { indirectName: 'GST', standardIndirect: 9, incomeBrackets: emptyIncomeBrackets },
  AE: { indirectName: 'VAT', standardIndirect: 5, incomeBrackets: emptyIncomeBrackets },
  SA: { indirectName: 'VAT', standardIndirect: 15, incomeBrackets: emptyIncomeBrackets },
  ZA: { indirectName: 'VAT', standardIndirect: 15, incomeBrackets: emptyIncomeBrackets },
  DE: { indirectName: 'VAT', standardIndirect: 19, incomeBrackets: emptyIncomeBrackets },
  FR: { indirectName: 'VAT', standardIndirect: 20, incomeBrackets: emptyIncomeBrackets },
  IT: { indirectName: 'VAT', standardIndirect: 22, incomeBrackets: emptyIncomeBrackets },
  ES: { indirectName: 'VAT', standardIndirect: 21, incomeBrackets: emptyIncomeBrackets },
  NL: { indirectName: 'VAT', standardIndirect: 21, incomeBrackets: emptyIncomeBrackets },
  CH: { indirectName: 'VAT', standardIndirect: 8.1, incomeBrackets: emptyIncomeBrackets },
  NO: { indirectName: 'VAT', standardIndirect: 25, incomeBrackets: emptyIncomeBrackets },
  SE: { indirectName: 'VAT', standardIndirect: 25, incomeBrackets: emptyIncomeBrackets },
  JP: { indirectName: 'Consumption Tax', standardIndirect: 10, incomeBrackets: emptyIncomeBrackets },
  KR: { indirectName: 'VAT', standardIndirect: 10, incomeBrackets: emptyIncomeBrackets },
  MX: { indirectName: 'VAT', standardIndirect: 16, incomeBrackets: emptyIncomeBrackets },
  BR: { indirectName: 'Consumption taxes', standardIndirect: 0, incomeBrackets: emptyIncomeBrackets },
  HK: { indirectName: 'No broad VAT/GST', standardIndirect: 0, incomeBrackets: emptyIncomeBrackets },
  MY: { indirectName: 'SST', standardIndirect: 0, incomeBrackets: emptyIncomeBrackets },
} as const;

export type CountryCode = keyof typeof taxData;
