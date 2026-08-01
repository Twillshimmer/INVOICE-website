const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// GET all clients (supports simple search via ?q=)
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? { companyName: { $regex: q, $options: "i" } }
      : {};
    const clients = await Client.find(filter).sort({ companyName: 1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single client
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE client
router.post("/", async (req, res) => {
  try {
    const client = new Client(req.body);
    const saved = await client.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE client
router.put("/:id", async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Client not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE client
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
