const { Event } = require("sheweny");
const { ARRIVAL_CHANNEL } = require("../config");

class GuildMemberRemoveEvent extends Event {
    constructor(client) {
        super(client, "guildMemberRemove", {
            description: "Suppression d'un membre sur le serveur",
            once: false,
        });
    }

    execute(member) {
        const channel = member.guild.channels.cache.get(ARRIVAL_CHANNEL);
        if (!channel) return;
        channel.send(`Au revoir à ${member} (id : ${member.id}) sur le serveur !`);
    }
}

module.exports = GuildMemberRemoveEvent;
