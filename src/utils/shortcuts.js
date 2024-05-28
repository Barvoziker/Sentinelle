const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { UserData } = require("../db/index");
const { GuildData } = require("../db/index");
const {BanData} = require("../db");

function Embed(color = true) {
  const embed = new EmbedBuilder();
  if (color) embed.setColor("#2b2d31");
  return embed;
}

function Wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function Defer(interaction) {
  let bool = true;
  await interaction.deferReply({ ephemeral: false }).catch(() => {
    bool = false;
  });
  await Wait(1000);
  return bool;
}

function Truncate(str, max) {
  return str.length > max ? str.substring(0, max - 1) + "..." : str;
}

function CreateButtons(buttons) {
  let buttonRow = new ActionRowBuilder();
  for (const button of buttons) {
    buttonRow.addComponents(
      new ButtonBuilder()
        .setCustomId(button.customId)
        .setLabel(button.label)
        .setStyle(button.style)
        ?.setEmoji(button.emoji)
    );
  }
  return buttonRow;
}

async function InsertData(object, Schema) {
  const dataObject = new Schema(object);
  dataObject.save();
}

async function DeleteData(object, Schema) {
    Schema.deleteOne(object);
}

function ParseTime(time) {
  const timeArray = time.split(" ");
  let days = 0;
  let hours = 0;
  let minutes = 0;
  for (const t of timeArray) {
    if (t.includes("j")) {
      days = parseInt(t.replace("j", ""));
    } else if (t.includes("h")) {
      hours = parseInt(t.replace("h", ""));
    } else if (t.includes("m")) {
      minutes = parseInt(t.replace("m", ""));
    }
  }
  return days * 86400000 + hours * 3600000 + minutes * 60000;
}

// Format expected into date parameter: "DD/MM/YYYY" | "MM/DD/YYYY";
function FormatToDcDate(date, format) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  let DateString =
    format === "DD/MM/YYYY"
      ? `${day}/${month}/${year}`
      : `${month}/${day}/${year}`;
  DateString += ` ${hours}:${minutes}`;
  return DateString;
}

module.exports = {
  Embed,
  Wait,
  Defer,
  Truncate,
  CreateButtons,
  FormatToDcDate,
  ParseTime,
  InsertData,
  DeleteData
};
