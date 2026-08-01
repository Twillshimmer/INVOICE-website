const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    category: { type: String, default: "" }, // Material Type / Category
    hsnSac: { type: String, default: "" },
    quantity: { type: Number, required: true, default: 1 },
    rate: { type: Number, required: true, default: 0 },
    taxRate: { type: Number, default: 0 }, // combined %, e.g. 18 (split into CGST/SGST or IGST)
    amount: { type: Number, required: true, default: 0 }, // qty * rate (pre-tax)
  },
  { _id: false }
);

const AddressSnapshot = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    invoiceDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date },
    poNumber: { type: String, default: "" },

    // Snapshots so historical invoices don't change if company/client profile edited later
    company: {
      name: String,
      tagline: String,
      logoBase64: String,
      address: AddressSnapshot,
      phone: String,
      email: String,
      gstin: String,
      signatureBase64: String,
      signatoryName: String,
      bank: {
        accountNumber: String,
        ifsc: String,
        bankName: String,
        upiId: String,
        qrCodeBase64: String,
      },
    },

    client: {
      companyName: String,
      contactPerson: String,
      email: String,
      phone: String,
      billingAddress: AddressSnapshot,
      shippingAddress: AddressSnapshot,
      gstin: String,
    },

    companyRef: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    clientRef: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },

    items: [ItemSchema],

    taxType: { type: String, enum: ["CGST_SGST", "IGST"], default: "CGST_SGST" },

    subtotal: { type: Number, required: true, default: 0 },
    discountType: { type: String, enum: ["FLAT", "PERCENT"], default: "FLAT" },
    discountValue: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxableAmount: { type: Number, default: 0 },

    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },

    grandTotal: { type: Number, required: true, default: 0 },
    amountInWords: { type: String, default: "" },

    notes: { type: String, default: "" },
    termsAndConditions: { type: String, default: "" },

    status: {
      type: String,
      enum: ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"],
      default: "DRAFT",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
