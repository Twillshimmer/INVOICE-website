import React, { useEffect, useState } from "react";
import { Field, Input, SectionCard } from "./FormControls";
import { ClientAPI } from "../utils/api";

export default function ClientForm({ client, setClient }) {
  const [savedClients, setSavedClients] = useState([]);

  useEffect(() => {
    ClientAPI.list()
      .then(setSavedClients)
      .catch(() => setSavedClients([]));
  }, []);

  const update = (path, value) => {
    setClient((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const loadSavedClient = (id) => {
    const found = savedClients.find((c) => c._id === id);
    if (found) setClient({ ...found });
  };

  const toggleSameAsBilling = (checked) => {
    setClient((prev) => ({
      ...prev,
      sameAsBilling: checked,
      shippingAddress: checked ? { ...prev.billingAddress } : prev.shippingAddress,
    }));
  };

  const updateBilling = (key, value) => {
    setClient((prev) => {
      const billingAddress = { ...prev.billingAddress, [key]: value };
      return {
        ...prev,
        billingAddress,
        shippingAddress: prev.sameAsBilling ? { ...billingAddress } : prev.shippingAddress,
      };
    });
  };

  return (
    <SectionCard
      eyebrow="Bill To"
      title="Client / Receiver Details"
      actions={
        savedClients.length > 0 && (
          <select
            onChange={(e) => e.target.value && loadSavedClient(e.target.value)}
            defaultValue=""
            className="text-xs rounded-md border border-ink-100 px-2 py-1.5 text-ink-600 bg-white"
          >
            <option value="">Load saved client…</option>
            {savedClients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName}
              </option>
            ))}
          </select>
        )
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Client / company name" className="col-span-2">
          <Input value={client.companyName} onChange={(e) => update("companyName", e.target.value)} />
        </Field>
        <Field label="Contact person">
          <Input value={client.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={client.phone} onChange={(e) => update("phone", e.target.value)} />
        </Field>
        <Field label="Email" className="col-span-2">
          <Input type="email" value={client.email} onChange={(e) => update("email", e.target.value)} />
        </Field>
        <Field label="Client GSTIN (optional)" className="col-span-2">
          <Input value={client.gstin} onChange={(e) => update("gstin", e.target.value)} className="tabular" />
        </Field>

        <div className="col-span-2 pt-2 border-t border-ink-50">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-2 mt-2">
            Billing address
          </p>
        </div>
        <Field label="Street" className="col-span-2">
          <Input
            value={client.billingAddress.street}
            onChange={(e) => updateBilling("street", e.target.value)}
          />
        </Field>
        <Field label="City">
          <Input value={client.billingAddress.city} onChange={(e) => updateBilling("city", e.target.value)} />
        </Field>
        <Field label="State">
          <Input value={client.billingAddress.state} onChange={(e) => updateBilling("state", e.target.value)} />
        </Field>
        <Field label="Pin code">
          <Input
            value={client.billingAddress.pincode}
            onChange={(e) => updateBilling("pincode", e.target.value)}
          />
        </Field>

        <div className="col-span-2 pt-2 border-t border-ink-50 flex items-center justify-between mt-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Shipping address</p>
          <label className="flex items-center gap-2 text-xs text-ink-600">
            <input
              type="checkbox"
              checked={client.sameAsBilling}
              onChange={(e) => toggleSameAsBilling(e.target.checked)}
              className="rounded border-ink-200 text-brass-600 focus:ring-brass-400"
            />
            Same as billing address
          </label>
        </div>

        {!client.sameAsBilling && (
          <>
            <Field label="Street" className="col-span-2">
              <Input
                value={client.shippingAddress.street}
                onChange={(e) => update("shippingAddress.street", e.target.value)}
              />
            </Field>
            <Field label="City">
              <Input
                value={client.shippingAddress.city}
                onChange={(e) => update("shippingAddress.city", e.target.value)}
              />
            </Field>
            <Field label="State">
              <Input
                value={client.shippingAddress.state}
                onChange={(e) => update("shippingAddress.state", e.target.value)}
              />
            </Field>
            <Field label="Pin code">
              <Input
                value={client.shippingAddress.pincode}
                onChange={(e) => update("shippingAddress.pincode", e.target.value)}
              />
            </Field>
          </>
        )}
      </div>
    </SectionCard>
  );
}
