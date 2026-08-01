import React, { useEffect, useState } from "react";
import { InvoiceAPI } from "../utils/api";
import { formatINR } from "../utils/currency";

const STATUS_STYLES = {
  DRAFT: "bg-ink-50 text-ink-500",
  SENT: "bg-teal-50 text-teal-700",
  PAID: "bg-teal-50 text-teal-700",
  OVERDUE: "bg-red-50 text-rust",
  CANCELLED: "bg-ink-50 text-ink-300",
};

export default function InvoiceList({ onLoad }) {
  const [invoices, setInvoices] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInvoices = () => {
    setLoading(true);
    InvoiceAPI.list(q ? { q } : {})
      .then(setInvoices)
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(fetchInvoices, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this invoice permanently?")) return;
    await InvoiceAPI.remove(id);
    fetchInvoices();
  };

  return (
    <div className="bg-white rounded-lg border border-ink-100 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-50">
        <h3 className="font-display text-lg text-ink-800">Saved Invoices</h3>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search invoice # or client…"
          className="text-sm rounded-md border border-ink-100 px-3 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-brass-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink-400 border-b border-ink-50">
              <th className="px-5 py-2 font-semibold">Invoice #</th>
              <th className="px-5 py-2 font-semibold">Client</th>
              <th className="px-5 py-2 font-semibold">Date</th>
              <th className="px-5 py-2 font-semibold">Due</th>
              <th className="px-5 py-2 font-semibold text-right">Total</th>
              <th className="px-5 py-2 font-semibold">Status</th>
              <th className="px-5 py-2 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-5 py-6 text-center text-ink-300 text-sm">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && invoices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-6 text-center text-ink-300 text-sm">
                  No invoices saved yet. Create your first one above.
                </td>
              </tr>
            )}
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-b border-ink-50 hover:bg-paper/60 transition">
                <td className="px-5 py-3 tabular font-medium text-ink-800">{inv.invoiceNumber}</td>
                <td className="px-5 py-3 text-ink-600">{inv.client?.companyName || "—"}</td>
                <td className="px-5 py-3 tabular text-ink-500">
                  {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="px-5 py-3 tabular text-ink-500">
                  {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="px-5 py-3 tabular text-right font-medium text-ink-800">
                  {formatINR(inv.grandTotal)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      STATUS_STYLES[inv.status] || STATUS_STYLES.DRAFT
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onLoad(inv._id)}
                    className="text-xs font-semibold text-brass-700 hover:underline mr-3"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDelete(inv._id)}
                    className="text-xs font-semibold text-ink-300 hover:text-rust"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
