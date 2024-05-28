const mongoose = require("mongoose");

const muteSchema = new mongoose.Schema({
  id: String,
  reason: String,
  duration: Number,
  date: Date,
});

module.exports = mongoose.model("Mute", muteSchema);
