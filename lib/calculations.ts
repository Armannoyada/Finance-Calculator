export function calculateEMI(principal: number, annualRate: number, years: number) {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualRate / 12 / 100;
  if (principal <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
}

export function calculateAmortization(principal: number, annualRate: number, years: number) {
  const months = Math.max(1, Math.round(years * 12));
  const payment = calculateEMI(principal, annualRate, years);
  const monthlyRate = annualRate / 12 / 100;
  let balance = Math.max(0, principal);
  const rows: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  for (let month = 1; month <= months; month++) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const principalPaid = Math.min(balance, Math.max(0, payment - interest));
    const actualPayment = principalPaid + interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month, payment: actualPayment, principal: principalPaid, interest, balance });
    if (balance <= 0.005) break;
  }
  return { payment, rows, totalPaid: rows.reduce((s, r) => s + r.payment, 0), totalInterest: rows.reduce((s, r) => s + r.interest, 0) };
}

export function calculateLoanComparison(p1: number, r1: number, y1: number, p2: number, r2: number, y2: number) {
  const a = calculateAmortization(p1, r1, y1);
  const b = calculateAmortization(p2, r2, y2);
  return { loanA: a, loanB: b, monthlyDifference: a.payment - b.payment, interestDifference: a.totalInterest - b.totalInterest };
}

export function calculatePrepayment(principal: number, annualRate: number, years: number, extraMonthly: number) {
  const monthlyRate = annualRate / 12 / 100;
  const basePayment = calculateEMI(principal, annualRate, years);
  let balance = Math.max(0, principal);
  let month = 0;
  let totalInterest = 0;
  while (balance > 0.005 && month < 1200) {
    month += 1;
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const payment = Math.min(balance + interest, basePayment + Math.max(0, extraMonthly));
    totalInterest += interest;
    balance = Math.max(0, balance - (payment - interest));
  }
  const scheduled = calculateAmortization(principal, annualRate, years);
  return { basePayment, newMonths: month, newInterest: totalInterest, monthsSaved: Math.max(0, scheduled.rows.length - month), interestSaved: Math.max(0, scheduled.totalInterest - totalInterest) };
}

export function calculateSIP(monthlyInvestment: number, annualRate: number, years: number) {
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualRate / 12 / 100;
  const invested = Math.max(0, monthlyInvestment) * months;
  if (monthlyRate === 0) return { invested, returns: 0, value: invested };
  const value = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  return { invested, returns: value - invested, value };
}

export function calculateStepUpSIP(monthlyInvestment: number, annualRate: number, years: number, annualStepUpPercent: number) {
  const monthlyRate = annualRate / 12 / 100;
  let contribution = Math.max(0, monthlyInvestment);
  let value = 0;
  let invested = 0;
  const months = Math.max(0, Math.round(years * 12));
  for (let month = 1; month <= months; month++) {
    invested += contribution;
    value = (value + contribution) * (1 + monthlyRate);
    if (month % 12 === 0) contribution *= 1 + Math.max(0, annualStepUpPercent) / 100;
  }
  return { invested, returns: value - invested, value };
}

export function calculateSWP(initialCorpus: number, withdrawalPerMonth: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 12 / 100;
  let balance = Math.max(0, initialCorpus);
  let totalWithdrawn = 0;
  const months = Math.max(0, Math.round(years * 12));
  for (let i = 0; i < months; i++) {
    balance *= 1 + monthlyRate;
    const withdrawal = Math.min(balance, Math.max(0, withdrawalPerMonth));
    balance -= withdrawal;
    totalWithdrawn += withdrawal;
    if (balance <= 0.005) break;
  }
  return { balance, totalWithdrawn, depleted: balance <= 0.005 };
}

export function calculateGoalSIP(target: number, annualRate: number, years: number) {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return target / months;
  return target * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1) / (1 + monthlyRate);
}

export function calculateLumpsum(principal: number, annualRate: number, years: number) {
  const value = principal * Math.pow(1 + annualRate / 100, years);
  return { invested: principal, returns: value - principal, value };
}

export function calculateCompound(principal: number, annualRate: number, years: number, compoundsPerYear = 12) {
  const n = Math.max(1, compoundsPerYear);
  const value = principal * Math.pow(1 + annualRate / 100 / n, n * years);
  return { principal, interest: value - principal, value };
}

export function addTax(amount: number, rate: number) { return { tax: amount * rate / 100, total: amount * (1 + rate / 100) }; }
export function removeTax(gross: number, rate: number) { return { tax: gross - gross / (1 + rate / 100), net: gross / (1 + rate / 100) }; }
export function calculateSimpleInterest(principal: number, annualRate: number, years: number) { const interest = principal * annualRate * years / 100; return { interest, value: principal + interest }; }
export function calculateCAGR(initial: number, final: number, years: number) { return years > 0 && initial > 0 && final >= 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : 0; }
export function calculateROI(cost: number, value: number) { return cost !== 0 ? (value - cost) / cost * 100 : 0; }
export function calculateMargin(revenue: number, cost: number) { return revenue !== 0 ? (revenue - cost) / revenue * 100 : 0; }
export function calculateMarkup(cost: number, sellingPrice: number) { return cost !== 0 ? (sellingPrice - cost) / cost * 100 : 0; }
export function calculateDiscount(price: number, discountRate: number) { const discount = price * discountRate / 100; return { discount, finalPrice: price - discount }; }
export function calculateInflation(amount: number, annualRate: number, years: number) { return amount * Math.pow(1 + annualRate / 100, years); }
export function calculateBreakEven(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number) { const contribution = pricePerUnit - variableCostPerUnit; return { units: contribution > 0 ? fixedCosts / contribution : Infinity, contribution }; }
export function calculatePercentage(value: number, percentage: number) { return value * percentage / 100; }
export function calculatePercentageChange(oldValue: number, newValue: number) { return oldValue !== 0 ? (newValue - oldValue) / Math.abs(oldValue) * 100 : 0; }
export function calculateTip(bill: number, tipRate: number, people = 1) { const tip = bill * tipRate / 100; return { tip, total: bill + tip, perPerson: people > 0 ? (bill + tip) / people : bill + tip }; }
export function calculateRule72(rate: number) { return rate > 0 ? 72 / rate : Infinity; }
export function calculateSavingsGoal(target: number, current: number, annualRate: number, years: number) { return calculateGoalSIP(Math.max(0, target - current * Math.pow(1 + annualRate / 100, years)), annualRate, years); }
export function calculateDebtPayoff(balance: number, annualRate: number, monthlyPayment: number) { const r = annualRate / 12 / 100; if (monthlyPayment <= balance * r && r > 0) return { months: Infinity, interest: Infinity }; let b = Math.max(0, balance), months = 0, interest = 0; while (b > 0.005 && months < 1200) { const i = b * r; interest += i; b -= Math.min(b + i, monthlyPayment) - i; months += 1; } return { months, interest, paid: balance + interest }; }
