import React from "react";
import { SectionCard, Select, Input } from "./FormControls";
import { formatNumberIN } from "../utils/currency";

const emptyItem = () => ({
  description: "",
  category: "",
  hsnSac: "",
  quantity: 1,
  rate: 0,
  taxRate: 18,
});

export default function ItemsTable({
  items,
  setItems,
  taxType,
  setTaxType,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
}) {
  const updateItem = (index, key, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  return (
    <SectionCard
      eyebrow="Materials & Services"
      title="Line Items"
      actions={
        <button
          type="button"
          onClick={addItem}
          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-ink-800 text-white hover:bg-ink-700 transition"
        >
          + Add item
        </button>
      }
    >
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink-400 border-b border-ink-100">
              <th className="py-2 pr-2 font-semibold w-[24%]">Description</th>
              <th className="py-2 pr-2 font-semibold w-[13%]">Category</th>
              <th className="py-2 pr-2 font-semibold w-[10%]">HSN/SAC</th>
              <th className="py-2 pr-2 font-semibold w-[8%]">Qty</th>
              <th className="py-2 pr-2 font-semibold w-[12%]">Rate (₹)</th>
              <th className="py-2 pr-2 font-semibold w-[9%]">Tax %</th>
              <th className="py-2 pr-2 font-semibold w-[14%] text-right">Amount (₹)</th>
              <th className="py-2 w-[4%]"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
              return (
                <tr key={i} className="border-b border-ink-50 align-top">
                  <td className="py-2 pr-2">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Item / service description"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      value={item.category}
                      onChange={(e) => updateItem(i, "category", e.target.value)}
                      placeholder="e.g. Steel"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      value={item.hsnSac}
                      onChange={(e) => updateItem(i, "hsnSac", e.target.value)}
                      className="tabular"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", e.target.value)}
                      className="tabular"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={item.rate}
                      onChange={(e) => updateItem(i, "rate", e.target.value)}
                      className="tabular"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={item.taxRate}
                      onChange={(e) => updateItem(i, "taxRate", e.target.value)}
                      className="tabular"
                    />
                  </td>
                  <td className="py-2 pr-2 text-right tabular font-medium text-ink-800 pt-4">
                    {formatNumberIN(amount)}
                  </td>
                  <td className="py-2 text-center pt-3">
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      disabled={items.length === 1}
                      className="text-ink-300 hover:text-rust disabled:opacity-30 transition"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-ink-50">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1.5">
            Tax type
          </span>
          <Select value={taxType} onChange={(e) => setTaxType(e.target.value)}>
            <option value="CGST_SGST">CGST + SGST (Intra-state)</option>
            <option value="IGST">IGST (Inter-state)</option>
          </Select>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1.5">
            Discount type
          </span>
          <Select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
            <option value="FLAT">Flat amount (₹)</option>
            <option value="PERCENT">Percentage (%)</option>
          </Select>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1.5">
            Discount value
          </span>
          <Input
            type="number"
            min="0"
            step="any"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="tabular"
          />
        </div>
      </div>
    </SectionCard>
  );
}
