const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  coverPhoto: { type: String, required: true },
  framePhoto: { type: String, required: true },
  availableSizes: [
    {
      height: { type: Number, required: true },
      width: { type: Number, required: true }
    }
  ],
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, required: true }
});

module.exports = mongoose.model("ADS-Products", productSchema);
