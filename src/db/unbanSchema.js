const mongoose = require("mongoose");

const unbanSchema = new mongoose.Schema({
    id: String,
    reason: String,
    date: Date,
    moderatorId: String,
});

module.exports = mongoose.model("Unban", unbanSchema);