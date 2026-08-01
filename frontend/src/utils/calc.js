// Mirrors backend/utils/invoiceMath.js so the live preview matches what gets saved.
export function computeTotals(invoice) {
  const items = (invoice.items || []).map((item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const amount = +(quantity * rate).toFixed(2);
    return { ...item, quantity, rate, amount, taxRate: Number(item.taxRate) || 0 };
  });

  const subtotal = +items.reduce((sum, i) => sum + i.amount, 0).toFixed(2);

  let discountAmount = 0;
  const discountValue = Number(invoice.discountValue) || 0;
  if (invoice.discountType === "PERCENT") {
    discountAmount = +(subtotal * (discountValue / 100)).toFixed(2);
  } else {
    discountAmount = +discountValue.toFixed(2);
  }
  discountAmount = Math.min(discountAmount, subtotal || 0);

  const taxableAmount = +(subtotal - discountAmount).toFixed(2);

  let totalTax = 0;
  if (subtotal > 0) {
    items.forEach((item) => {
      const itemShareOfDiscount = (item.amount / subtotal) * discountAmount;
      const itemTaxable = item.amount - itemShareOfDiscount;
      totalTax += itemTaxable * (item.taxRate / 100);
    });
  }
  totalTax = +totalTax.toFixed(2);

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (invoice.taxType === "IGST") {
    igstAmount = totalTax;
  } else {
    cgstAmount = +(totalTax / 2).toFixed(2);
    sgstAmount = +(totalTax - cgstAmount).toFixed(2);
  }

  const grandTotal = +(taxableAmount + totalTax).toFixed(2);

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
  };
}
