import React, { forwardRef } from "react";
import { formatINR, formatNumberIN, amountInWordsINR } from "../utils/currency";
import { computeTotals } from "../utils/calc";

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_COLOR = {
  DRAFT: "text-ink-400",
  SENT: "text-teal-600",
  PAID: "text-teal-600",
  OVERDUE: "text-rust",
  CANCELLED: "text-ink-300",
};

const InvoicePreview = forwardRef(function InvoicePreview(
  { invoiceNumber, invoiceDate, dueDate, poNumber, company, client, items, taxType, discountType, discountValue, notes, terms, status },
  ref
) {
  const totals = computeTotals({ items, taxType, discountType, discountValue });
  const address = (a) => [a?.street, a?.city, a?.state, a?.pincode].filter(Boolean).join(", ");

  return (
    <div ref={ref} id="invoice-print-area" className="bg-white text-ink-800 w-full max-w-[794px] mx-auto shadow-ledger">
      {/* Brass top rule — the ledger seal band */}
      <div className="h-2 bg-gradient-to-r from-brass-700 via-brass-400 to-brass-700" />

      <div className="p-10 relative">
        {/* Status stamp */}
        <div
          className={`stamp absolute top-10 right-10 px-3 py-1 text-xs font-bold uppercase ${
            STATUS_COLOR[status] || "text-ink-400"
          }`}
        >
          {status || "DRAFT"}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-ink-800">
          <div className="flex items-start gap-4 max-w-[65%]">
            {company.logoBase64 && (
              <img src={company.logoBase64} alt="logo" className="w-16 h-16 object-contain rounded" />
            )}
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink-800 leading-tight">
                {company.name || "Your Company Name"}
              </h1>
              {company.tagline && <p className="text-xs text-brass-700 italic mt-0.5">{company.tagline}</p>}
              <p className="text-xs text-ink-400 mt-2 leading-relaxed max-w-xs">
                {address(company.address)}
              </p>
              <p className="text-xs text-ink-400">
                {[company.phone, company.email].filter(Boolean).join(" · ")}
              </p>
              {company.gstin && <p className="text-xs text-ink-400">GSTIN/PAN: {company.gstin}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl tracking-tight text-ink-800">Invoice</p>
            <p className="tabular text-sm font-semibold text-brass-700 mt-1">{invoiceNumber || "INV-0000-000"}</p>
            <div className="mt-3 text-xs text-ink-400 space-y-0.5">
              <p>
                Date: <span className="tabular text-ink-700">{formatDate(invoiceDate)}</span>
              </p>
              <p>
                Due: <span className="tabular text-ink-700">{formatDate(dueDate)}</span>
              </p>
              {poNumber && (
                <p>
                  PO Ref: <span className="tabular text-ink-700">{poNumber}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bill To / Ship To */}
        <div className="grid grid-cols-2 gap-6 py-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brass-600 mb-1.5">Bill To</p>
            <p className="font-display text-base font-semibold text-ink-800">{client.companyName || "Client Name"}</p>
            {client.contactPerson && <p className="text-xs text-ink-600 mt-0.5">Attn: {client.contactPerson}</p>}
            <p className="text-xs text-ink-400 mt-1 leading-relaxed">{address(client.billingAddress)}</p>
            <p className="text-xs text-ink-400">
              {[client.phone, client.email].filter(Boolean).join(" · ")}
            </p>
            {client.gstin && <p className="text-xs text-ink-400">GSTIN: {client.gstin}</p>}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brass-600 mb-1.5">Ship To</p>
            <p className="text-xs text-ink-400 leading-relaxed">
              {address(client.sameAsBilling ? client.billingAddress : client.shippingAddress) || "Same as billing address"}
            </p>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full text-xs border-t-2 border-ink-800">
          <thead>
            <tr className="text-left uppercase tracking-wide text-ink-400 border-b border-ink-200">
              <th className="py-2 pr-2 font-semibold">#</th>
              <th className="py-2 pr-2 font-semibold">Description</th>
              <th className="py-2 pr-2 font-semibold">HSN/SAC</th>
              <th className="py-2 pr-2 font-semibold text-right">Qty</th>
              <th className="py-2 pr-2 font-semibold text-right">Rate</th>
              <th className="py-2 pr-2 font-semibold text-right">Tax %</th>
              <th className="py-2 pl-2 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {totals.items.map((item, i) => (
              <tr key={i} className="border-b border-ink-50">
                <td className="py-2 pr-2 tabular text-ink-400">{i + 1}</td>
                <td className="py-2 pr-2">
                  <p className="text-ink-800">{item.description || "—"}</p>
                  {item.category && <p className="text-[10px] text-ink-400">{item.category}</p>}
                </td>
                <td className="py-2 pr-2 tabular text-ink-500">{item.hsnSac || "—"}</td>
                <td className="py-2 pr-2 tabular text-right">{item.quantity}</td>
                <td className="py-2 pr-2 tabular text-right">{formatNumberIN(item.rate)}</td>
                <td className="py-2 pr-2 tabular text-right">{item.taxRate}%</td>
                <td className="py-2 pl-2 tabular text-right font-medium">{formatNumberIN(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-4">
          <div className="w-64 text-xs space-y-1.5">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>
              <span className="tabular">{formatNumberIN(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-ink-600">
                <span>Discount</span>
                <span className="tabular">- {formatNumberIN(totals.discountAmount)}</span>
              </div>
            )}
            {taxType === "IGST" ? (
              <div className="flex justify-between text-ink-600">
                <span>IGST</span>
                <span className="tabular">{formatNumberIN(totals.igstAmount)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-ink-600">
                  <span>CGST</span>
                  <span className="tabular">{formatNumberIN(totals.cgstAmount)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>SGST</span>
                  <span className="tabular">{formatNumberIN(totals.sgstAmount)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center pt-2 mt-1 border-t-2 border-ink-800">
              <span className="font-display text-sm font-semibold text-ink-800">Grand Total</span>
              <span className="tabular text-base font-bold text-brass-700">{formatINR(totals.grandTotal)}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-ink-400 italic mt-3 text-right">
          {amountInWordsINR(totals.grandTotal)}
        </p>

        {/* Payment info */}
        {(company.bank?.bankName || company.bank?.upiId) && (
          <div className="mt-8 pt-4 border-t border-ink-100 grid grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brass-600 mb-1.5">
                Payment Details
              </p>
              <div className="text-xs text-ink-600 space-y-0.5">
                {company.bank?.bankName && <p>Bank: {company.bank.bankName}</p>}
                {company.bank?.accountNumber && <p className="tabular">A/C No: {company.bank.accountNumber}</p>}
                {company.bank?.ifsc && <p className="tabular">IFSC: {company.bank.ifsc}</p>}
                {company.bank?.upiId && <p>UPI: {company.bank.upiId}</p>}
              </div>
            </div>
            {company.bank?.qrCodeBase64 && (
              <div className="flex justify-end">
                <img src={company.bank.qrCodeBase64} alt="UPI QR" className="w-20 h-20 object-contain border border-ink-100 rounded" />
              </div>
            )}
          </div>
        )}

        {(notes || terms) && (
          <div className="mt-6 pt-4 border-t border-ink-100 grid grid-cols-2 gap-6 text-xs text-ink-500">
            {notes && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-brass-600 mb-1.5">Notes</p>
                <p className="whitespace-pre-line leading-relaxed">{notes}</p>
              </div>
            )}
            {terms && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-brass-600 mb-1.5">
                  Terms & Conditions
                </p>
                <p className="whitespace-pre-line leading-relaxed">{terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Authorised Signature Block */}
        <div className="mt-10 flex items-end justify-between border-t border-ink-100 pt-6">
          <div className="text-[10px] text-ink-400 max-w-[240px] italic leading-relaxed">
            This is a computer-generated document. No physical signature is required.
          </div>
          <div className="text-center min-w-[200px]">
            {company.signatureBase64 ? (
              <img
                src={company.signatureBase64}
                alt="Authorised Signature"
                className="h-12 max-w-[160px] object-contain mx-auto mb-1"
              />
            ) : (
              <div className="h-10 flex items-center justify-center text-[11px] text-brass-700 italic font-medium">
                Digitally Verified
              </div>
            )}
            <div className="border-t border-ink-300 pt-1.5 px-4">
              <p className="text-xs font-semibold text-ink-800">
                {company.signatoryName || company.name || "Authorised Signatory"}
              </p>
              <p className="text-[10px] text-ink-500">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoicePreview;
