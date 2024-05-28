const { Event } = require("sheweny");
const { ARRIVAL_CHANNEL_ID, GUILD_LOGO } = require("../config");
const { Embed } = require("../utils/shortcuts");


class GuildMemberAddEvent extends Event {
    constructor(client) {
        super(client, "guildMemberAdd", {
            description: "Ajout d'un membre sur le serveur",
            once: false,
        });
    }

    execute(member) {
        const channel = member.guild.channels.cache.get(ARRIVAL_CHANNEL_ID);
        if (!channel) return;

        const embed = Embed()
            .setColor('#00ff00')
            .setThumbnail(member.user.displayAvatarURL())
            .setTitle(`Bienvenue ${member.user.username} !`)
            .setDescription(`ID : ${member.id}`)
            .setFooter({ text: member.guild.name})
            .setTimestamp();

        channel.send({ embeds: [embed] });

        member.roles.add("1244682170623332522");
    }
}

module.exports = GuildMemberAddEvent;