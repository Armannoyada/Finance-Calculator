export const countries = [
  { code: 'IN', name: 'India', currency: 'INR', flag: '🇮🇳' },
  { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', flag: '🇸🇬' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', flag: '🇦🇪' },
  { code: 'DE', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  { code: 'FR', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
] as const;

export const taxData = {
  IN: { indirectName: 'GST', standardIndirect: 18, incomeBrackets: [
    [0, 400000, 0], [400000, 800000, 5], [800000, 1200000, 10], [1200000, 1600000, 15], [1600000, 2000000, 20], [2000000, 2400000, 25], [2400000, Infinity, 30]
  ] },
  US: { indirectName: 'Sales Tax', standardIndirect: 0, incomeBrackets: [[0,12400,10],[12400,50400,12],[50400,105700,22],[105700,201775,24],[201775,256225,32],[256225,640600,35],[640600,Infinity,37]] },
  GB: { indirectName: 'VAT', standardIndirect: 20, incomeBrackets: [[0,12570,0],[12570,50270,20],[50270,125140,40],[125140,Infinity,45]] },
  CA: { indirectName: 'GST/HST', standardIndirect: 5, incomeBrackets: [] },
  AU: { indirectName: 'GST', standardIndirect: 10, incomeBrackets: [] },
  SG: { indirectName: 'GST', standardIndirect: 9, incomeBrackets: [] },
  AE: { indirectName: 'VAT', standardIndirect: 5, incomeBrackets: [] },
  DE: { indirectName: 'VAT', standardIndirect: 19, incomeBrackets: [] },
  FR: { indirectName: 'VAT', standardIndirect: 20, incomeBrackets: [] },
  JP: { indirectName: 'Consumption Tax', standardIndirect: 10, incomeBrackets: [] },
} as const;

export type CountryCode = keyof typeof taxData;
