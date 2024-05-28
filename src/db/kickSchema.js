const mongoose = require("mongoose");

const kickSchema = new mongoose.Schema({
    id: String,
    reason: String,
    date: Date,
    moderatorId: String,
});

module.exports = mongoose.model("kick", kickSchema);
