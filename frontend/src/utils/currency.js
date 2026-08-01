// Formats a number using the Indian numbering system: ₹1,50,000.00
export function formatINR(amount) {
  const n = Number(amount) || 0;
  const formatted = n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹${formatted}`;
}

export function formatNumberIN(amount) {
  const n = Number(amount) || 0;
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

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

  return parts.join(" ").trim() || "Zero";
}

// e.g. 150000.5 -> "One Lakh Fifty Thousand Rupees and Fifty Paise Only"
export function amountInWordsINR(amount) {
  const n = Number(amount) || 0;
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  let words = `${numberToIndianWords(rupees)} Rupees`;
  if (paise > 0) {
    words += ` and ${numberToIndianWords(paise)} Paise`;
  }
  return `${words} Only`;
}
