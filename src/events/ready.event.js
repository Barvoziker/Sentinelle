const { Event } = require("sheweny");
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const {startTwitchListener} = require("./twitch.event");

class ReadyEvent extends Event {
  constructor(client) {
    super(client, "ready", {
      description: "Client is logged in",
      once: true,
      emitter: client,
    });
  }

  execute() {
    console.log(`✅ ${this.client.user.username}`);

    this.client.user.setPresence({
      activities: [{ type: ActivityType.Streaming, url: "https://twitch.tv/barvoziker_1", name: "Barvoziker_1.tv" }],
    });

    startTwitchListener(this.client);
  }
}

module.exports = ReadyEvent;
