export function calculateEMI(principal: number, annualRate: number, years: number) {
  const months = Math.max(1, years * 12);
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / months;
  return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
}

export function calculateSIP(monthlyInvestment: number, annualRate: number, years: number) {
  const months = Math.max(0, years * 12);
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return { invested: monthlyInvestment * months, returns: 0, value: monthlyInvestment * months };
  const value = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const invested = monthlyInvestment * months;
  return { invested, returns: value - invested, value };
}

export function calculateLumpsum(principal: number, annualRate: number, years: number) {
  const value = principal * Math.pow(1 + annualRate / 100, years);
  return { invested: principal, returns: value - principal, value };
}

export function calculateCompound(principal: number, annualRate: number, years: number, compoundsPerYear = 12) {
  const value = principal * Math.pow(1 + annualRate / 100 / compoundsPerYear, compoundsPerYear * years);
  return { principal, interest: value - principal, value };
}

export function addTax(amount: number, rate: number) { return { tax: amount * rate / 100, total: amount * (1 + rate / 100) }; }
export function removeTax(gross: number, rate: number) { return { tax: gross - gross / (1 + rate / 100), net: gross / (1 + rate / 100) }; }
export function calculateSimpleInterest(principal: number, annualRate: number, years: number) { const interest = principal * annualRate * years / 100; return { interest, value: principal + interest }; }
export function calculateCAGR(initial: number, final: number, years: number) { return years > 0 && initial > 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : 0; }
export function calculateROI(cost: number, gain: number) { return cost !== 0 ? (gain - cost) / cost * 100 : 0; }
export function calculateMargin(revenue: number, cost: number) { return revenue !== 0 ? (revenue - cost) / revenue * 100 : 0; }
export function calculateMarkup(cost: number, sellingPrice: number) { return cost !== 0 ? (sellingPrice - cost) / cost * 100 : 0; }
export function calculateDiscount(price: number, discountRate: number) { const discount = price * discountRate / 100; return { discount, finalPrice: price - discount }; }
export function calculateInflation(amount: number, annualRate: number, years: number) { return amount * Math.pow(1 + annualRate / 100, years); }
