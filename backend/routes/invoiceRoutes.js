const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const { computeInvoiceTotals } = require("../utils/invoiceMath");

// GET next available invoice number, e.g. INV-2026-001
router.get("/next-number", async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    const last = await Invoice.findOne({
      invoiceNumber: { $regex: `^${prefix}` },
    }).sort({ createdAt: -1 });

    let nextSeq = 1;
    if (last) {
      const parts = last.invoiceNumber.split("-");
      const lastSeq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
    }
    const invoiceNumber = `${prefix}${String(nextSeq).padStart(3, "0")}`;
    res.json({ invoiceNumber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all invoices (list view — lightweight fields, supports search + status filter)
router.get("/", async (req, res) => {
  try {
    const { q, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { invoiceNumber: { $regex: q, $options: "i" } },
        { "client.companyName": { $regex: q, $options: "i" } },
      ];
    }
    const invoices = await Invoice.find(filter)
      .select("invoiceNumber invoiceDate dueDate client.companyName grandTotal status")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single invoice (full detail, for edit/preview/PDF)
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE invoice — server recomputes totals so DB is always the source of truth
router.post("/", async (req, res) => {
  try {
    const totals = computeInvoiceTotals(req.body);
    const invoice = new Invoice({ ...req.body, ...totals });
    const saved = await invoice.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Invoice number already exists" });
    }
    res.status(400).json({ message: err.message });
  }
});

// UPDATE invoice
router.put("/:id", async (req, res) => {
  try {
    const totals = computeInvoiceTotals(req.body);
    const updated = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...totals },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Invoice not found" });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Invoice number already exists" });
    }
    res.status(400).json({ message: err.message });
  }
});

// UPDATE status only (e.g. mark as Paid)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Invoice not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE invoice
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
