const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true, default: "" },
    logoBase64: { type: String, default: "" }, // data:image/png;base64,....
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    gstin: { type: String, default: "" }, // GSTIN or PAN
    signatureBase64: { type: String, default: "" }, // data:image/png;base64,....
    signatoryName: { type: String, default: "" },
    bank: {
      accountNumber: { type: String, default: "" },
      ifsc: { type: String, default: "" },
      bankName: { type: String, default: "" },
      upiId: { type: String, default: "" },
      qrCodeBase64: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
