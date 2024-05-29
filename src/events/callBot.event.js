const { Event } = require("sheweny");

class CallBotEvent extends Event {
  constructor(client) {
    super(client, "messageCreate", {
      description: "Appel du bot",
      once: false,
      emitter: client,
    });
  }

  execute(message) {
    if (message.author.bot) return;
      if (message.mentions.has(this.client.user.id)) {
        message.channel.send("Tu m'as appelé ?");
      }
  }
}

module.exports = CallBotEvent;
