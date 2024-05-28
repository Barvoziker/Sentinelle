const { Defer, Embed } = require("../utils/shortcuts");
const { Command } = require("sheweny");

class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "🏓 Show the bot latency",
      category: "Misc",
      clientPermissions: ["EmbedLinks"],
    });
  }

  async execute(interaction) {
    const start = Date.now();
    await Defer(interaction);
    const djsApiLantency = Date.now() - 1000 - start;

    return await interaction.editReply({
      embeds: [
        Embed()
          .setTitle(`🏓 Pong!`)
          .addFields(
            {
              name: `🤖 Bot Latency`,
              value: `${"```"}${djsApiLantency}ms${"```"}`,
            },
            {
              name: `📡 Discord API`,
              value: `${"```"}${interaction.client.ws.ping + 1}ms${"```"}`,
            }
          ),
      ],
    });
  }
}

module.exports = PingCommand;
