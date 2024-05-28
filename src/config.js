require("dotenv").config();

module.exports = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  MONGO_URI: process.env.MONGO_URI,
  ARRIVAL_CHANNEL_ID: process.env.ARRIVAL_CHANNEL_ID,
};
