require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const companyRoutes = require("./routes/companyRoutes");
const clientRoutes = require("./routes/clientRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/invoice_db";

// Logos are stored as Base64 strings, so allow a generous JSON body size
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use("/api/companies", companyRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

// Centralized error handler (catches anything thrown outside try/catch in routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB:", MONGO_URI);
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
