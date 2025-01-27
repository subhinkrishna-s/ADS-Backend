const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  productId: { type: Number, required: true },
  size: {
    height: { type: Number, required: true },
    width: { type: Number, required: true }
  },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered"], default: "Pending" },
  image: {type: String, required: true} 
});

module.exports = mongoose.model("ADS-Orders", orderSchema);
