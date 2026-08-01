import React, { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import CompanyForm from "./components/CompanyForm";
import ClientForm from "./components/ClientForm";
import InvoiceMetaForm from "./components/InvoiceMetaForm";
import ItemsTable from "./components/ItemsTable";
import InvoicePreview from "./components/InvoicePreview";
import InvoiceList from "./components/InvoiceList";
import { InvoiceAPI } from "./utils/api";
import { downloadInvoicePDF } from "./utils/pdfExport";

const emptyCompany = () => ({
  name: "",
  tagline: "",
  logoBase64: "",
  signatureBase64: "",
  signatoryName: "",
  address: { street: "", city: "", state: "", pincode: "" },
  phone: "",
  email: "",
  gstin: "",
  bank: { accountNumber: "", ifsc: "", bankName: "", upiId: "", qrCodeBase64: "" },
});

const emptyClient = () => ({
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  billingAddress: { street: "", city: "", state: "", pincode: "" },
  shippingAddress: { street: "", city: "", state: "", pincode: "" },
  sameAsBilling: true,
  gstin: "",
});

const emptyItem = () => ({
  description: "",
  category: "",
  hsnSac: "",
  quantity: 1,
  rate: 0,
  taxRate: 18,
});

const todayISO = () => new Date().toISOString().slice(0, 10);
const inDays = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

export default function App() {
  const [view, setView] = useState("editor"); // 'editor' | 'saved'
  const [savingId, setSavingId] = useState(null); // current invoice _id if editing a saved one
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);

  const [company, setCompany] = useState(emptyCompany());
  const [client, setClient] = useState(emptyClient());
  const [items, setItems] = useState([emptyItem()]);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(inDays(15));
  const [poNumber, setPoNumber] = useState("");

  const [taxType, setTaxType] = useState("CGST_SGST");
  const [discountType, setDiscountType] = useState("FLAT");
  const [discountValue, setDiscountValue] = useState(0);

  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [status, setStatus] = useState("DRAFT");

  const previewRef = useRef(null);

  useEffect(() => {
    InvoiceAPI.nextNumber()
      .then((r) => setInvoiceNumber(r.invoiceNumber))
      .catch(() => setInvoiceNumber("INV-2026-001"));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const buildPayload = () => ({
    invoiceNumber,
    invoiceDate,
    dueDate,
    poNumber,
    company,
    client,
    items,
    taxType,
    discountType,
    discountValue: Number(discountValue) || 0,
    notes,
    termsAndConditions: terms,
    status,
  });

  const resetForm = () => {
    setSavingId(null);
    setCompany(emptyCompany());
    setClient(emptyClient());
    setItems([emptyItem()]);
    setDueDate(inDays(15));
    setInvoiceDate(todayISO());
    setPoNumber("");
    setDiscountType("FLAT");
    setDiscountValue(0);
    setStatus("DRAFT");
    InvoiceAPI.nextNumber().then((r) => setInvoiceNumber(r.invoiceNumber));
  };

  const handleSave = async () => {
    if (!company.name || !client.companyName || !invoiceNumber) {
      setToast({ type: "error", text: "Company name, client name, and invoice number are required." });
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      const saved = savingId ? await InvoiceAPI.update(savingId, payload) : await InvoiceAPI.create(payload);
      setSavingId(saved._id);
      setToast({ type: "success", text: `Invoice ${saved.invoiceNumber} saved to database.` });
    } catch (err) {
      setToast({ type: "error", text: err?.response?.data?.message || "Failed to save invoice." });
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async (id) => {
    try {
      const inv = await InvoiceAPI.get(id);
      setSavingId(inv._id);
      setCompany({ ...emptyCompany(), ...inv.company, bank: { ...emptyCompany().bank, ...inv.company?.bank } });
      setClient({ ...emptyClient(), ...inv.client });
      setItems(inv.items?.length ? inv.items : [emptyItem()]);
      setInvoiceNumber(inv.invoiceNumber);
      setInvoiceDate(inv.invoiceDate?.slice(0, 10) || todayISO());
      setDueDate(inv.dueDate?.slice(0, 10) || "");
      setPoNumber(inv.poNumber || "");
      setTaxType(inv.taxType || "CGST_SGST");
      setDiscountType(inv.discountType || "FLAT");
      setDiscountValue(inv.discountValue || 0);
      setNotes(inv.notes || "");
      setTerms(inv.termsAndConditions || "");
      setStatus(inv.status || "DRAFT");
      setView("editor");
    } catch {
      setToast({ type: "error", text: "Could not load that invoice." });
    }
  };

  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      await downloadInvoicePDF(previewRef.current, `${invoiceNumber || "invoice"}.pdf`);
    } catch (err) {
      setToast({ type: "error", text: "PDF export failed. Please try again." });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Header view={view} setView={setView} />

      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-md shadow-ledger text-sm font-medium ${
            toast.type === "error" ? "bg-rust text-white" : "bg-teal-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      {view === "saved" ? (
        <main className="max-w-[1400px] mx-auto px-6 py-8">
          <InvoiceList onLoad={handleLoad} />
        </main>
      ) : (
        <main className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brass-600">
                {savingId ? "Editing saved invoice" : "New invoice"}
              </p>
              <h2 className="font-display text-2xl text-ink-800">Invoice Editor</h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-sm rounded-md border border-ink-100 px-3 py-2 bg-white"
              >
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <button
                onClick={resetForm}
                className="text-sm font-semibold px-4 py-2 rounded-md border border-ink-100 text-ink-600 hover:border-ink-300 transition"
              >
                New
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-sm font-semibold px-4 py-2 rounded-md bg-ink-800 text-white hover:bg-ink-700 transition disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save to Database"}
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={exporting}
                className="text-sm font-semibold px-4 py-2 rounded-md bg-brass-600 text-ink-900 hover:bg-brass-700 hover:text-white transition disabled:opacity-50"
              >
                {exporting ? "Preparing PDF…" : "Download PDF"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* Left: form */}
            <div className="space-y-5">
              <InvoiceMetaForm
                meta={{ invoiceNumber, invoiceDate, dueDate, poNumber }}
                setMeta={(updater) => {
                  const next = typeof updater === "function" ? updater({ invoiceNumber, invoiceDate, dueDate, poNumber }) : updater;
                  setInvoiceNumber(next.invoiceNumber);
                  setInvoiceDate(next.invoiceDate);
                  setDueDate(next.dueDate);
                  setPoNumber(next.poNumber);
                }}
              />
              <CompanyForm company={company} setCompany={setCompany} />
              <ClientForm client={client} setClient={setClient} />
              <ItemsTable
                items={items}
                setItems={setItems}
                taxType={taxType}
                setTaxType={setTaxType}
                discountType={discountType}
                setDiscountType={setDiscountType}
                discountValue={discountValue}
                setDiscountValue={setDiscountValue}
              />
            </div>

            {/* Right: live preview */}
            <div className="xl:sticky xl:top-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 mb-3 text-center">
                Live Preview
              </p>
              <div className="bg-ink-100/40 rounded-xl p-4 overflow-x-auto">
                <InvoicePreview
                  ref={previewRef}
                  invoiceNumber={invoiceNumber}
                  invoiceDate={invoiceDate}
                  dueDate={dueDate}
                  poNumber={poNumber}
                  company={company}
                  client={client}
                  items={items}
                  taxType={taxType}
                  discountType={discountType}
                  discountValue={discountValue}
                  notes={notes}
                  terms={terms}
                  status={status}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
