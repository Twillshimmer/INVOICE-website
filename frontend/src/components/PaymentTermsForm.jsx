import React from "react";
import { Field, Input, TextArea, SectionCard } from "./FormControls";
import ImageUpload from "./ImageUpload";

export default function PaymentTermsForm({ bank, setBank, notes, setNotes, terms, setTerms }) {
  const updateBank = (key, value) => setBank((prev) => ({ ...prev, [key]: value }));

  return (
    <SectionCard eyebrow="Settlement" title="Payment Info & Terms">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Bank name">
          <Input value={bank.bankName} onChange={(e) => updateBank("bankName", e.target.value)} />
        </Field>
        <Field label="Account number">
          <Input
            value={bank.accountNumber}
            onChange={(e) => updateBank("accountNumber", e.target.value)}
            className="tabular"
          />
        </Field>
        <Field label="IFSC code">
          <Input
            value={bank.ifsc}
            onChange={(e) => updateBank("ifsc", e.target.value.toUpperCase())}
            className="tabular"
          />
        </Field>
        <Field label="UPI ID">
          <Input value={bank.upiId} onChange={(e) => updateBank("upiId", e.target.value)} placeholder="name@upi" />
        </Field>
        <div className="col-span-2">
          <ImageUpload label="UPI QR code (optional)" value={bank.qrCodeBase64} onChange={(v) => updateBank("qrCodeBase64", v)} />
        </div>
        <Field label="Notes for client" className="col-span-2">
          <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Thank you for your business." />
        </Field>
        <Field label="Terms & conditions" className="col-span-2">
          <TextArea
            rows={4}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Payment due within 15 days. Late payments subject to 2% monthly interest."
          />
        </Field>
      </div>
    </SectionCard>
  );
}
