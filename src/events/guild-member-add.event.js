const { Event } = require("sheweny");
const { ARRIVAL_CHANNEL } = require("../config");

class GuildMemberAddEvent extends Event {
    constructor(client) {
        super(client, "guildMemberAdd", {
            description: "Ajout d'un membre sur le serveur",
            once: false,
        });
    }

    execute(member) {
        const channel = member.guild.channels.cache.get(ARRIVAL_CHANNEL);
        if (!channel) return;
        channel.send(`Bienvenue à ${member} (id : ${member.id}) sur le serveur !`);
    }
}

module.exports = GuildMemberAddEvent;
