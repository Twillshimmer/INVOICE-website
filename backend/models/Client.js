const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  { _id: false }
);

const ClientSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    billingAddress: { type: AddressSchema, default: () => ({}) },
    shippingAddress: { type: AddressSchema, default: () => ({}) },
    sameAsBilling: { type: Boolean, default: true },
    gstin: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
