const mongoose = require("mongoose");

const muteSchema = new mongoose.Schema({
  id: String,
  reason: String,
  duration: Number,
  date: Date,
  moderatorId: String,
});

module.exports = mongoose.model("Mute", muteSchema);
