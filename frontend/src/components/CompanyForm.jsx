import React from "react";
import { Field, Input, SectionCard } from "./FormControls";
import ImageUpload from "./ImageUpload";

export default function CompanyForm({ company, setCompany }) {
  const update = (path, value) => {
    setCompany((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  return (
    <SectionCard eyebrow="Sender" title="Your Company Details">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <ImageUpload
            label="Company logo"
            value={company.logoBase64}
            onChange={(v) => update("logoBase64", v)}
          />
        </div>
        <Field label="Company name" className="col-span-2">
          <Input
            value={company.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Acme Industries Pvt. Ltd."
          />
        </Field>
        <Field label="Tagline / slogan" className="col-span-2">
          <Input
            value={company.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            placeholder="Precision engineered, on time."
          />
        </Field>
        <Field label="Street address" className="col-span-2">
          <Input
            value={company.address.street}
            onChange={(e) => update("address.street", e.target.value)}
            placeholder="Plot 14, MIDC Industrial Area"
          />
        </Field>
        <Field label="City">
          <Input value={company.address.city} onChange={(e) => update("address.city", e.target.value)} />
        </Field>
        <Field label="State">
          <Input value={company.address.state} onChange={(e) => update("address.state", e.target.value)} />
        </Field>
        <Field label="Pin code">
          <Input value={company.address.pincode} onChange={(e) => update("address.pincode", e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={company.phone} onChange={(e) => update("phone", e.target.value)} />
        </Field>
        <Field label="Email" className="col-span-2">
          <Input type="email" value={company.email} onChange={(e) => update("email", e.target.value)} />
        </Field>
        <Field label="GSTIN / PAN" className="col-span-2">
          <Input
            value={company.gstin}
            onChange={(e) => update("gstin", e.target.value)}
            placeholder="27AAAAA0000A1Z5"
            className="tabular"
          />
        </Field>
        <div className="col-span-2 pt-3 border-t border-ink-100">
          <p className="text-xs font-semibold text-ink-700 mb-2">Authorised Signature & Signatory</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUpload
              label="Digital Signature image (optional)"
              value={company.signatureBase64 || ""}
              onChange={(v) => update("signatureBase64", v)}
            />
            <Field label="Signatory Name / Designation">
              <Input
                value={company.signatoryName || ""}
                onChange={(e) => update("signatoryName", e.target.value)}
                placeholder="e.g. Director / Authorised Signatory"
              />
            </Field>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
