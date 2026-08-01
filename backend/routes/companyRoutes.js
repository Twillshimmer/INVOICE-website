const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

// GET all companies (usually you'll just have one, but supports multiple sender profiles)
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single company
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE company
router.post("/", async (req, res) => {
  try {
    const company = new Company(req.body);
    const saved = await company.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE company
router.put("/:id", async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Company not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE company
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Company.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
