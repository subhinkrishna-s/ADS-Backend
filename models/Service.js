const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverPhoto: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, required: true }
});

module.exports = mongoose.model("ADS-Services", serviceSchema);
