// Converts a number into words using the Indian numbering system (Lakh/Crore)
// e.g. 150000 -> "One Lakh Fifty Thousand"

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function twoDigits(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${TENS[t]}${o ? " " + ONES[o] : ""}`;
}

function threeDigits(n) {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  let str = "";
  if (h) str += `${ONES[h]} Hundred${rest ? " " : ""}`;
  if (rest) str += twoDigits(rest);
  return str.trim();
}

function numberToIndianWords(num) {
  num = Math.round(num);
  if (num === 0) return "Zero";
  if (num < 0) return `Minus ${numberToIndianWords(-num)}`;

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = num;

  let parts = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  return parts.join(" ").trim();
}

function amountInWordsINR(amount) {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let words = `${numberToIndianWords(rupees)} Rupees`;
  if (paise > 0) {
    words += ` and ${numberToIndianWords(paise)} Paise`;
  }
  return `${words} Only`;
}

// Recomputes all derived totals for an invoice payload (server-side source of truth)
function computeInvoiceTotals(payload) {
  const items = (payload.items || []).map((item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const amount = +(quantity * rate).toFixed(2);
    return { ...item, quantity, rate, amount, taxRate: Number(item.taxRate) || 0 };
  });

  const subtotal = +items.reduce((sum, i) => sum + i.amount, 0).toFixed(2);

  let discountAmount = 0;
  const discountValue = Number(payload.discountValue) || 0;
  if (payload.discountType === "PERCENT") {
    discountAmount = +(subtotal * (discountValue / 100)).toFixed(2);
  } else {
    discountAmount = +discountValue.toFixed(2);
  }
  discountAmount = Math.min(discountAmount, subtotal);

  const taxableAmount = +(subtotal - discountAmount).toFixed(2);

  // Weighted tax: apply each item's tax rate proportionally to its share of taxable amount
  let totalTax = 0;
  if (subtotal > 0) {
    items.forEach((item) => {
      const itemShareOfDiscount = subtotal > 0 ? (item.amount / subtotal) * discountAmount : 0;
      const itemTaxable = item.amount - itemShareOfDiscount;
      totalTax += itemTaxable * (item.taxRate / 100);
    });
  }
  totalTax = +totalTax.toFixed(2);

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (payload.taxType === "IGST") {
    igstAmount = totalTax;
  } else {
    cgstAmount = +(totalTax / 2).toFixed(2);
    sgstAmount = +(totalTax - cgstAmount).toFixed(2);
  }

  const grandTotal = +(taxableAmount + totalTax).toFixed(2);
  const amountInWords = amountInWordsINR(grandTotal);

  return {
    items,
    subtotal,
    discountAmount,
    taxableAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTax,
    grandTotal,
    amountInWords,
  };
}

module.exports = { numberToIndianWords, amountInWordsINR, computeInvoiceTotals };
