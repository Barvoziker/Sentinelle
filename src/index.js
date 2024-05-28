const {
  IntentsBitField,
  Partials,
  PermissionFlagsBits,
} = require("discord.js");
const { ShewenyClient } = require("sheweny");
const config = require("./config");
const { mongoose } = require("mongoose");

const client = new ShewenyClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  partials: [Partials.GuildMember, Partials.Message, Partials.User],
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      applicationPermissions: true,
      default: {
        type: "SLASH_COMMAND",
        channel: "GUILD",
        cooldown: 3,
        userPermissions: [PermissionFlagsBits.UseApplicationCommands],
      },
    },
    events: {
      directory: "./events",
      default: {
        once: false,
      },
    },
    buttons: {
      directory: "./interactions/buttons",
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
    },
  },
  mode: "production",
});

mongoose
  .connect(config.MONGO_URI, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => console.log("✅ MongoDB"))
  .catch((err) => {
    throw new Error("❌ MongoDB\n" + err.reason);
  });

client.login(config.DISCORD_TOKEN);
