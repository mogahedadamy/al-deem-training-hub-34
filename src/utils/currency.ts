// مساعدات العملة السودانية
export const CURRENCY = {
  code: 'SDG',
  symbol: 'ج.س',
  name: 'الجنيه السوداني'
};

// تنسيق الأسعار بالجنيه السوداني
export const formatPrice = (price: string | number): string => {
  if (typeof price === 'string') {
    if (price === 'مجاني') return price;
    return price;
  }
  
  // تنسيق الأرقام مع الفواصل
  return new Intl.NumberFormat('ar-SD', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' ' + CURRENCY.symbol;
};

// استخراج القيمة الرقمية من السعر
export const extractNumericPrice = (price: string): number => {
  if (price === 'مجاني') return 0;
  
  // إزالة العملة والفواصل واستخراج الرقم
  const numericString = price.replace(/[^\d]/g, '');
  return parseInt(numericString) || 0;
};

// التحقق من كون الدورة مجانية
export const isFree = (price: string): boolean => {
  return price === 'مجاني';
};

// مقارنة الأسعار
export const comparePrices = (priceA: string, priceB: string): number => {
  const numA = extractNumericPrice(priceA);
  const numB = extractNumericPrice(priceB);
  return numA - numB;
};

// تحويل السعر إلى عملات أخرى (للمستقبل)
export const convertCurrency = (sdgAmount: number, targetCurrency: string): number => {
  // معدلات تحويل تقريبية (يجب تحديثها من API حقيقي)
  const exchangeRates: { [key: string]: number } = {
    'USD': 0.00166, // 1 SDG = 0.00166 USD تقريباً
    'EUR': 0.00153, // 1 SDG = 0.00153 EUR تقريباً
    'SAR': 0.00624, // 1 SDG = 0.00624 SAR تقريباً
    'EGP': 0.0815,  // 1 SDG = 0.0815 EGP تقريباً
  };
  
  const rate = exchangeRates[targetCurrency];
  if (!rate) {
    throw new Error(`معدل التحويل غير متوفر للعملة: ${targetCurrency}`);
  }
  
  return sdgAmount * rate;
};