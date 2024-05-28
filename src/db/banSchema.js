const mongoose = require("mongoose");

const banSchema = new mongoose.Schema({
  id: String,
  reason: String,
  date: Date,
  moderatorId: String,
});

module.exports = mongoose.model("Ban", banSchema);
