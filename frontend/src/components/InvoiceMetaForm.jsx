import React from "react";
import { Field, Input, SectionCard } from "./FormControls";

export default function InvoiceMetaForm({ meta, setMeta }) {
  const update = (key, value) => setMeta((prev) => ({ ...prev, [key]: value }));

  return (
    <SectionCard eyebrow="Reference" title="Invoice Metadata">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Invoice number" className="col-span-2">
          <Input
            value={meta.invoiceNumber}
            onChange={(e) => update("invoiceNumber", e.target.value)}
            className="tabular"
            placeholder="INV-2026-001"
          />
        </Field>
        <Field label="Invoice date">
          <Input
            type="date"
            value={meta.invoiceDate}
            onChange={(e) => update("invoiceDate", e.target.value)}
          />
        </Field>
        <Field label="Payment due date">
          <Input type="date" value={meta.dueDate} onChange={(e) => update("dueDate", e.target.value)} />
        </Field>
        <Field label="PO / reference number" className="col-span-2">
          <Input value={meta.poNumber} onChange={(e) => update("poNumber", e.target.value)} />
        </Field>
      </div>
    </SectionCard>
  );
}
