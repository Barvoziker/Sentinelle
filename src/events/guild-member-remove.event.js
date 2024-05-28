const { Event } = require("sheweny");
const { ARRIVAL_CHANNEL_ID } = require("../config");
const { Embed } = require("../utils/shortcuts");

class GuildMemberRemoveEvent extends Event {
    constructor(client) {
        super(client, "guildMemberRemove", {
            description: "Suppression d'un membre sur le serveur",
            once: false,
        });
    }

    execute(member) {
        const channel = member.guild.channels.cache.get(ARRIVAL_CHANNEL_ID);
        if (!channel) return;
        const embed = Embed()
            .setColor('#ff0000')
            .setThumbnail(member.user.displayAvatarURL())
            .setTitle(`Aurevoir ${member.user.username} !`)
            .setDescription(`ID : ${member.id}`)
            .setFooter({ text: member.guild.name })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
}

module.exports = GuildMemberRemoveEvent;
