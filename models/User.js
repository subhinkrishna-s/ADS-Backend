const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["admin"], required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("ADS-Users", userSchema);
