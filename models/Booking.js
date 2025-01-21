const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  customerName: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  serviceId: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }
});

module.exports = mongoose.model("ADS-Bookings", bookingSchema);
