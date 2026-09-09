export type CalculatorOutput = 'currency' | 'percent' | 'number' | 'months' | 'years';

export type CalculatorDefinition = {
  title: string;
  slug: string;
  category: string;
  kind: string;
  fields: string[];
  defaults: number[];
  output: CalculatorOutput;
};

const d = (title: string, slug: string, category: string, kind: string, fields: string[], defaults: number[], output: CalculatorOutput = 'currency'): CalculatorDefinition => ({ title, slug, category, kind, fields, defaults, output });

export const calculators: CalculatorDefinition[] = [
  // Loans — 12
  d('EMI Calculator','emi-calculator','Loans','emi',['Loan amount','Interest rate %','Tenure (years)'],[1000000,8.5,20]),
  d('Loan Payment Calculator','loan-payment','Loans','loan-payment',['Loan amount','Interest rate %','Tenure (years)'],[1000000,8.5,20]),
  d('Amortization Calculator','amortization-calculator','Loans','amortization',['Loan amount','Interest rate %','Tenure (years)'],[1000000,8.5,20]),
  d('Loan Comparison','loan-comparison','Loans','loan-comparison',['Loan amount','Rate A %','Rate B %','Tenure (years)'],[1000000,8.5,7.5,20]),
  d('Loan Prepayment Calculator','loan-prepayment-calculator','Loans','prepayment',['Loan balance','Interest rate %','Years remaining','Extra payment / month'],[1000000,8.5,20,10000]),
  d('Personal Loan Calculator','personal-loan-calculator','Loans','personal-loan',['Loan amount','Interest rate %','Tenure (years)'],[500000,12,5]),
  d('Home Loan Calculator','home-loan-calculator','Loans','home-loan',['Loan amount','Interest rate %','Tenure (years)'],[5000000,8,20]),
  d('Car Loan Calculator','car-loan-calculator','Loans','car-loan',['Loan amount','Interest rate %','Tenure (years)'],[1000000,9,5]),
  d('Education Loan Calculator','education-loan-calculator','Loans','education-loan',['Loan amount','Interest rate %','Tenure (years)'],[2000000,9,10]),
  d('Mortgage Affordability Calculator','mortgage-affordability-calculator','Loans','mortgage-affordability',['Monthly income','Monthly debts','Interest rate %','Tenure (years)'],[150000,20000,8,20]),
  d('Loan Interest Rate Calculator','interest-rate-calculator','Loans','interest-rate',['Loan amount','Monthly payment','Tenure (years)'],[1000000,10000,12],'percent'),
  d('Loan Tenure Calculator','loan-tenure-calculator','Loans','loan-tenure',['Loan amount','Interest rate %','Monthly payment'],[1000000,8.5,12000],'months'),

  // Investments — 12
  d('SIP Calculator','sip-calculator','Investments','sip',['Monthly investment','Expected return %','Years'],[10000,12,10]),
  d('Step-up SIP Calculator','step-up-sip-calculator','Investments','stepup-sip',['Monthly investment','Expected return %','Years','Annual step-up %'],[10000,12,10,10]),
  d('Lumpsum Calculator','lumpsum-calculator','Investments','lumpsum',['Investment amount','Expected return %','Years'],[100000,12,10]),
  d('Compound Interest Calculator','compound-interest-calculator','Investments','compound',['Principal','Annual rate %','Years','Compounds / year'],[100000,10,10,12]),
  d('Simple Interest Calculator','simple-interest-calculator','Investments','simple-interest',['Principal','Annual rate %','Years'],[100000,8,5]),
  d('CAGR Calculator','cagr-calculator','Investments','cagr',['Initial value','Final value','Years'],[100000,250000,5],'percent'),
  d('SWP Calculator','swp-calculator','Investments','swp',['Starting corpus','Monthly withdrawal','Expected return %','Years'],[1000000,15000,8,10]),
  d('SIP Goal Calculator','sip-goal-calculator','Investments','sip-goal',['Target amount','Expected return %','Years'],[2500000,12,10]),
  d('XIRR Calculator','xirr-calculator','Investments','xirr',['Investment amount','Final value','Years'],[100000,250000,5],'percent'),
  d('Mutual Fund Return Calculator','mutual-fund-return-calculator','Investments','mutual-fund-return',['Investment amount','Return %','Years'],[100000,12,10]),
  d('Fixed Deposit Calculator','fd-calculator','Investments','fd',['Deposit amount','Interest rate %','Years','Compounds / year'],[100000,7,5,4]),
  d('Recurring Deposit Calculator','rd-calculator','Investments','rd',['Monthly deposit','Interest rate %','Years'],[10000,7,5]),

  // Taxes — 12
  d('GST Calculator','gst-calculator','Taxes','gst',['Amount','GST rate %'],[100000,18]),
  d('VAT Calculator','vat-calculator','Taxes','vat',['Amount','VAT rate %'],[100000,20]),
  d('Sales Tax Calculator','sales-tax-calculator','Taxes','sales-tax',['Amount','Sales tax %'],[100000,8]),
  d('Tax Inclusive Price Calculator','tax-inclusive-price-calculator','Taxes','tax-inclusive',['Base amount','Tax rate %'],[100000,18]),
  d('Tax Exclusive Price Calculator','tax-exclusive-price-calculator','Taxes','tax-exclusive',['Gross amount','Tax rate %'],[118000,18]),
  d('Income Tax Calculator','income-tax-calculator','Taxes','income-tax',['Annual taxable income','Other deductions'],[1200000,0]),
  d('Salary Take-home Calculator','salary-take-home-calculator','Taxes','salary-take-home',['Gross annual salary','Tax %','Other deductions / year'],[1200000,15,50000]),
  d('TDS Calculator','tds-calculator','Taxes','tds',['Payment amount','TDS rate %'],[100000,10]),
  d('Capital Gains Tax Calculator','capital-gains-tax-calculator','Taxes','capital-gains',['Sale proceeds','Cost basis','Tax rate %'],[500000,300000,12.5]),
  d('HRA Calculator','hra-calculator','Taxes','hra',['Basic salary / year','HRA received / year','Rent paid / year','Metro flag (1=yes)'],[600000,180000,240000,1]),
  d('Gratuity Calculator','gratuity-calculator','Taxes','gratuity',['Last drawn monthly salary','Completed years'],[50000,10]),
  d('Tax Savings Calculator','tax-savings-calculator','Taxes','tax-savings',['Eligible investment','Tax rate %'],[150000,20]),

  // Savings & Planning — 12
  d('Savings Goal Calculator','savings-goal-calculator','Savings & Planning','savings-goal',['Target amount','Current savings','Return %','Years'],[1000000,100000,8,5]),
  d('Retirement Calculator','retirement-calculator','Savings & Planning','retirement',['Current annual expenses','Inflation %','Years to retirement','Return %'],[600000,6,25,9]),
  d('Emergency Fund Calculator','emergency-fund-calculator','Savings & Planning','emergency-fund',['Monthly expenses','Target months'],[50000,6]),
  d('Net Worth Calculator','net-worth-calculator','Savings & Planning','net-worth',['Cash + investments','Property + other assets','Loans + liabilities'],[500000,3000000,1500000]),
  d('Budget Planner','budget-planner','Savings & Planning','budget',['Monthly income','Needs %','Wants %','Savings %'],[100000,50,30,20]),
  d('50/30/20 Budget Calculator','50-30-20-budget-calculator','Savings & Planning','503020',['Monthly income'],[100000]),
  d('Inflation Calculator','inflation-calculator','Savings & Planning','inflation',['Current amount','Inflation %','Years'],[100000,6,10]),
  d('Purchasing Power Calculator','purchasing-power-calculator','Savings & Planning','purchasing-power',['Current amount','Inflation %','Years'],[100000,6,10]),
  d('Future Goal Amount Calculator','future-goal-amount-calculator','Savings & Planning','future-goal',['Current goal','Inflation %','Years'],[1000000,6,10]),
  d('PPF Calculator','ppf-calculator','Savings & Planning','ppf',['Annual contribution','Interest rate %','Years'],[150000,7.1,15]),
  d('NPS Calculator','nps-calculator','Savings & Planning','nps',['Monthly contribution','Expected return %','Years'],[10000,10,25]),
  d('Retirement Corpus / FIRE Calculator','fire-calculator','Savings & Planning','fire',['Annual expenses','Withdrawal rate %','Years to FIRE'],[600000,4,15]),

  // Business & Finance — 12
  d('ROI Calculator','roi-calculator','Business & Finance','roi',['Investment / cost','Current value'],[100000,150000],'percent'),
  d('Profit Margin Calculator','profit-margin-calculator','Business & Finance','margin',['Revenue','Cost'],[150000,100000],'percent'),
  d('Markup Calculator','markup-calculator','Business & Finance','markup',['Cost','Selling price'],[100000,150000],'percent'),
  d('Discount Calculator','discount-calculator','Business & Finance','discount',['Original price','Discount %'],[100000,10]),
  d('Break-even Calculator','break-even-calculator','Business & Finance','break-even',['Fixed costs','Price / unit','Variable cost / unit'],[500000,2500,1500],'number'),
  d('Cash Flow Calculator','cash-flow-calculator','Business & Finance','cash-flow',['Opening cash','Cash inflows','Cash outflows'],[100000,500000,350000]),
  d('Invoice Total Calculator','invoice-total-calculator','Business & Finance','invoice',['Subtotal','Tax %','Discount %'],[100000,18,5]),
  d('Depreciation Calculator','depreciation-calculator','Business & Finance','depreciation',['Asset cost','Salvage value','Useful life (years)'],[1000000,100000,10]),
  d('Gross Profit Calculator','gross-profit-calculator','Business & Finance','gross-profit',['Revenue','COGS'],[1000000,600000]),
  d('Net Profit Calculator','net-profit-calculator','Business & Finance','net-profit',['Revenue','Total costs','Tax %'],[1000000,700000,20]),
  d('Contribution Margin Calculator','contribution-margin-calculator','Business & Finance','contribution-margin',['Revenue','Variable costs'],[1000000,400000],'percent'),
  d('Inventory Turnover Calculator','inventory-turnover-calculator','Business & Finance','inventory-turnover',['COGS','Average inventory'],[1000000,250000],'number'),

  // Trading & Markets — 12
  d('Brokerage Calculator','brokerage-calculator','Trading & Markets','brokerage',['Trade value','Brokerage %','Other charges %'],[100000,0.1,0.05]),
  d('Margin Calculator','margin-calculator','Trading & Markets','margin-requirement',['Position value','Margin requirement %'],[500000,20]),
  d('Stock Average Calculator','stock-average-calculator','Trading & Markets','stock-average',['Shares owned','Average buy price','New shares','New buy price'],[100,100,50,80]),
  d('SIP vs Lumpsum Calculator','sip-vs-lumpsum-calculator','Trading & Markets','sip-vs-lumpsum',['Total amount','Expected return %','Years'],[1200000,12,10]),
  d('Leverage Calculator','leverage-calculator','Trading & Markets','leverage',['Your capital','Leverage x'],[100000,5]),
  d('Position Size Calculator','position-size-calculator','Trading & Markets','position-size',['Account size','Risk per trade %','Entry price','Stop-loss price'],[100000,1,500,475]),
  d('Risk Reward Calculator','risk-reward-calculator','Trading & Markets','risk-reward',['Entry price','Stop loss','Target price'],[500,475,550],'number'),
  d('Stop Loss Calculator','stop-loss-calculator','Trading & Markets','stop-loss',['Entry price','Risk %'],[500,5]),
  d('Profit Target Calculator','profit-target-calculator','Trading & Markets','profit-target',['Entry price','Target gain %'],[500,10]),
  d('Dividend Yield Calculator','dividend-yield-calculator','Trading & Markets','dividend-yield',['Annual dividend / share','Share price'],[10,200],'percent'),
  d('Earnings Yield Calculator','earnings-yield-calculator','Trading & Markets','earnings-yield',['EPS','Share price'],[20,400],'percent'),
  d('P/E Ratio Calculator','pe-ratio-calculator','Trading & Markets','pe-ratio',['Share price','EPS'],[400,20],'number'),

  // Currency & FX — 12
  d('Currency Converter','currency-converter','Currency & FX','currency-converter',['Amount','Exchange rate'],[1000,83.5]),
  d('Exchange Rate Calculator','exchange-rate-calculator','Currency & FX','exchange-rate',['Amount in source currency','Amount in destination currency'],[1000,83.5],'number'),
  d('FX Markup Calculator','fx-markup-calculator','Currency & FX','fx-markup',['Amount','Mid-market rate','Provider markup %'],[1000,83.5,2]),
  d('Travel Currency Calculator','travel-currency-calculator','Currency & FX','travel-currency',['Travel budget','FX rate','Days'],[100000,0.011,10]),
  d('Import Cost Calculator','import-cost-calculator','Currency & FX','import-cost',['Goods cost','Freight + insurance','Duty %','FX rate'],[100000,15000,10,83.5]),
  d('Export Proceeds Calculator','export-proceeds-calculator','Currency & FX','export-proceeds',['Invoice value','Bank fee %','FX rate'],[500000,1.5,83.5]),
  d('International Transfer Cost','international-transfer-cost','Currency & FX','transfer-cost',['Amount','Provider fee','FX markup %'],[100000,500,2]),
  d('FX Purchasing Power Calculator','fx-purchasing-power-calculator','Currency & FX','fx-purchasing-power',['Amount','FX rate','Inflation %'],[100000,83.5,5]),
  d('FX Percentage Change Calculator','fx-percentage-change-calculator','Currency & FX','fx-change',['Old exchange rate','New exchange rate'],[83.5,87],'percent'),
  d('Forward Exchange Rate Calculator','forward-exchange-rate-calculator','Currency & FX','forward-fx',['Spot rate','Domestic rate %','Foreign rate %','Months'],[83.5,6,3,6]),
  d('Pip Value Calculator','pip-value-calculator','Currency & FX','pip-value',['Trade size','Pip size','Exchange rate'],[100000,0.0001,83.5]),
  d('Currency Gain Loss Calculator','currency-gain-loss-calculator','Currency & FX','currency-gain-loss',['Foreign amount','Buy rate','Sell rate'],[1000,83.5,87]),

  // Everyday Math — 12
  d('Percentage Calculator','percentage-calculator','Everyday Math','percentage',['Number','Percentage %'],[50000,18]),
  d('Percentage Change Calculator','percentage-change-calculator','Everyday Math','percentage-change',['Original value','New value'],[100,125],'percent'),
  d('Ratio Calculator','ratio-calculator','Everyday Math','ratio',['Value A','Value B'],[2,3],'number'),
  d('Tip Calculator','tip-calculator','Everyday Math','tip',['Bill amount','Tip %','People'],[2500,10,2]),
  d('Unit Price Calculator','unit-price-calculator','Everyday Math','unit-price',['Total price','Quantity'],[500,5]),
  d('Date Difference Calculator','date-difference-calculator','Everyday Math','date-difference',['Days between dates'],[365],'number'),
  d('Time Value of Money Calculator','time-value-money-calculator','Everyday Math','tvm',['Present value','Rate %','Years','Cash flow / year'],[100000,8,10,0]),
  d('Rule of 72 Calculator','rule-of-72-calculator','Everyday Math','rule72',['Annual return %'],[8],'years'),
  d('Compound Daily Growth Calculator','compound-daily-growth-calculator','Everyday Math','daily-growth',['Principal','Daily rate %','Days'],[10000,0.02,365]),
  d('Bill Split Calculator','bill-split-calculator','Everyday Math','bill-split',['Total bill','People','Service charge %'],[5000,4,5]),
  d('Hourly Rate Calculator','hourly-rate-calculator','Everyday Math','hourly-rate',['Annual income','Work hours / week','Weeks / year'],[1200000,40,52]),
  d('Annual Salary Calculator','annual-salary-calculator','Everyday Math','annual-salary',['Hourly rate','Hours / week','Weeks / year'],[500,40,52]),

  // Real Estate — 12
  d('Rent vs Buy Calculator','rent-vs-buy-calculator','Real Estate','rent-vs-buy',['Home price','Monthly rent','Mortgage rate %','Years'],[5000000,30000,8,10]),
  d('Rental Yield Calculator','rental-yield-calculator','Real Estate','rental-yield',['Annual rent','Property price'],[360000,5000000],'percent'),
  d('Stamp Duty Calculator','stamp-duty-calculator','Real Estate','stamp-duty',['Property value','Stamp duty %','Registration fee'],[5000000,5,30000]),
  d('Down Payment Calculator','down-payment-calculator','Real Estate','down-payment',['Property price','Down payment %'],[5000000,20]),
  d('Property Appreciation Calculator','property-appreciation-calculator','Real Estate','property-appreciation',['Current value','Appreciation %','Years'],[5000000,7,10]),
  d('Loan to Value Calculator','loan-to-value-calculator','Real Estate','ltv',['Loan amount','Property value'],[4000000,5000000],'percent'),
  d('Property Cost per Sq Ft','property-cost-per-sqft','Real Estate','property-sqft',['Property price','Area sq ft'],[5000000,1000]),
  d('Home Loan Affordability Calculator','home-affordability-calculator','Real Estate','home-affordability',['Monthly income','Existing EMI','Rate %','Years'],[150000,20000,8,20]),
  d('Property Closing Cost Calculator','property-closing-cost-calculator','Real Estate','closing-cost',['Property price','Fees %','Tax / duty %'],[5000000,2,5]),
  d('Monthly Home Ownership Cost','monthly-home-ownership-cost','Real Estate','ownership-cost',['EMI','Maintenance / month','Property tax / month','Insurance / month'],[40000,5000,2500,1500]),
  d('Capitalization Rate Calculator','cap-rate-calculator','Real Estate','cap-rate',['Net operating income','Property value'],[600000,5000000],'percent'),
  d('Price to Rent Ratio Calculator','price-to-rent-ratio-calculator','Real Estate','price-rent',['Property price','Annual rent'],[5000000,360000],'number'),

  // Debt & Credit — 12
  d('Debt Payoff Calculator','debt-payoff-calculator','Debt & Credit','debt-payoff',['Debt balance','Interest rate %','Monthly payment'],[500000,12,15000],'months'),
  d('Debt Snowball Calculator','debt-snowball-calculator','Debt & Credit','snowball',['Total debt','Interest rate %','Monthly payment'],[500000,12,15000],'months'),
  d('Debt Avalanche Calculator','debt-avalanche-calculator','Debt & Credit','avalanche',['Total debt','Interest rate %','Monthly payment'],[500000,12,15000],'months'),
  d('Debt-to-Income Ratio Calculator','dti-calculator','Debt & Credit','dti',['Monthly debt payments','Gross monthly income'],[25000,100000],'percent'),
  d('Debt Service Ratio Calculator','debt-service-ratio-calculator','Debt & Credit','dsr',['Annual debt service','Annual income'],[300000,1200000],'percent'),
  d('Net Debt Calculator','net-debt-calculator','Debt & Credit','net-debt',['Total debt','Cash + cash equivalents'],[1000000,250000]),
  d('Debt Consolidation Calculator','debt-consolidation-calculator','Debt & Credit','consolidation',['Current debt','Current rate %','New rate %','Years'],[1000000,14,10,7]),
  d('Refinance Savings Calculator','refinance-savings-calculator','Debt & Credit','refinance',['Loan balance','Old rate %','New rate %','Years remaining'],[1000000,12,9,7]),
  d('Credit Utilization Calculator','credit-utilization-calculator','Debt & Credit','credit-utilization',['Credit card balance','Credit limit'],[50000,200000],'percent'),
  d('Savings Rate Calculator','savings-rate-calculator','Debt & Credit','savings-rate',['Monthly income','Monthly savings'],[100000,20000],'percent'),
  d('FIRE Number Calculator','fire-number-calculator','Debt & Credit','fire-number',['Annual expenses','Withdrawal rate %'],[600000,4]),
  d('Retirement Monthly Income Calculator','retirement-monthly-income-calculator','Debt & Credit','retirement-income',['Retirement corpus','Withdrawal rate %'],[10000000,4]),

  // Accounting & Payroll — 12
  d('Payroll Cost Calculator','payroll-cost-calculator','Accounting & Payroll','payroll-cost',['Gross payroll','Employer tax %','Benefits / month'],[1000000,10,50000]),
  d('Overtime Pay Calculator','overtime-pay-calculator','Accounting & Payroll','overtime',['Hourly rate','Overtime hours','Overtime multiplier'],[500,10,1.5]),
  d('Annual Leave Payout Calculator','leave-payout-calculator','Accounting & Payroll','leave-payout',['Daily pay','Unused leave days'],[2000,12]),
  d('Commission Calculator','commission-calculator','Accounting & Payroll','commission',['Sales value','Commission %'],[1000000,5]),
  d('Sales Commission with Tier Calculator','tiered-commission-calculator','Accounting & Payroll','tiered-commission',['Sales value','Base commission %','Bonus %'],[1000000,3,2]),
  d('Bonus Calculator','bonus-calculator','Accounting & Payroll','bonus',['Base salary','Bonus %'],[600000,10]),
  d('Pay Raise Calculator','pay-raise-calculator','Accounting & Payroll','pay-raise',['Current salary','Raise %'],[600000,8]),
  d('Back Pay Calculator','back-pay-calculator','Accounting & Payroll','back-pay',['Monthly pay difference','Months owed'],[5000,6]),
  d('Gross Up Calculator','gross-up-calculator','Accounting & Payroll','gross-up',['Net pay','Tax rate %'],[100000,20]),
  d('Payroll Tax Calculator','payroll-tax-calculator','Accounting & Payroll','payroll-tax',['Gross pay','Payroll tax %'],[100000,7]),
  d('Hourly Overtime Differential','overtime-differential-calculator','Accounting & Payroll','overtime-diff',['Regular hourly rate','Premium %'],[500,50]),
  d('Take-home per Hour Calculator','take-home-hour-calculator','Accounting & Payroll','takehome-hour',['Net annual income','Work hours / year'],[1000000,2080]),

  // Insurance & Financial Protection — 12
  d('Term Insurance Cover Calculator','term-insurance-cover-calculator','Insurance','term-cover',['Annual income','Years of income','Existing liabilities','Existing assets'],[1200000,15,2000000,1000000]),
  d('Insurance Premium Rate Calculator','insurance-premium-rate-calculator','Insurance','premium-rate',['Premium','Coverage amount'],[15000,10000000],'percent'),
  d('Life Insurance Gap Calculator','life-insurance-gap-calculator','Insurance','insurance-gap',['Required cover','Existing cover'],[15000000,5000000]),
  d('Health Insurance Cost Calculator','health-insurance-cost-calculator','Insurance','health-cost',['Base premium','Family members','Medical inflation %'],[25000,4,8]),
  d('Deductible Savings Calculator','deductible-savings-calculator','Insurance','deductible',['Premium without deductible','Premium with deductible','Expected claims'],[30000,22000,50000]),
  d('Coinsurance Calculator','coinsurance-calculator','Insurance','coinsurance',['Claim amount','Deductible','Coinsurance %'],[100000,10000,20]),
  d('Insurance Coverage Ratio','insurance-coverage-ratio','Insurance','coverage-ratio',['Annual premium','Coverage amount'],[30000,10000000],'number'),
  d('Inflation-adjusted Insurance Cover','inflation-insurance-cover','Insurance','inflation-cover',['Current cover','Inflation %','Years'],[10000000,6,10]),
  d('Annuity Payment Calculator','annuity-payment-calculator','Insurance','annuity-payment',['Present value','Rate %','Years'],[5000000,7,20]),
  d('Annuity Future Value Calculator','annuity-future-value-calculator','Insurance','annuity-future',['Monthly payment','Rate %','Years'],[25000,7,20]),
  d('Present Value Calculator','present-value-calculator','Insurance','present-value',['Future amount','Rate %','Years'],[1000000,8,10]),
  d('Future Value Calculator','future-value-calculator','Insurance','future-value',['Present amount','Rate %','Years'],[1000000,8,10]),
];

export const calculatorsBySlug: Record<string, CalculatorDefinition> = Object.fromEntries(calculators.map((item) => [item.slug, item]));
export const calculatorSlugs = calculators.map((item) => item.slug);
export const calculatorCount = calculators.length;
export const categories = [...new Set(calculators.map((item) => item.category))];
