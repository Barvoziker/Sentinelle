const { Defer, Embed, fetchData, formatDuration } = require("../utils/shortcuts");
const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");
const KickData = require("../db/kickSchema");
const BanData = require("../db/banSchema");
const MuteData = require("../db/muteSchema");

class CasierCommand extends Command {
    constructor(client) {
        super(client, {
            name: "casier",
            description: "📜 Afficher le casier d'un membre",
            category: "Misc",
            options: [
                {
                    name: "membre",
                    description: "Casier d'un membre",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
            clientPermissions: ["EmbedLinks", "ModerateMembers"],
            userPermissions: ["ModerateMembers"],
        });
    }

    async execute(interaction) {
        await Defer(interaction);  // Diffère l'interaction

        const user = interaction.options.getUser("membre");

        const kicks = await KickData.find({ id: user.id }).exec();
        const bans = await BanData.find({ id: user.id }).exec();
        const mutes = await MuteData.find({ id: user.id }).exec();

        if (kicks.length === 0 && bans.length === 0 && mutes.length === 0) {
            return interaction.followUp(`Aucun casier trouvé pour le membre ${user.tag}`);
        }

        const sanctions = [
            ...kicks.map(kick => ({ type: 'Kick', ...kick._doc })),
            ...bans.map(ban => ({ type: 'Ban', ...ban._doc })),
            ...mutes.map(mute => ({ type: 'Mute', ...mute._doc })),
        ];

        sanctions.sort((a, b) => new Date(a.date) - new Date(b.date));

        const embed = new Embed()
            .setTitle(`Casier de ${user.tag}`)
            .setDescription(`Voici l'historique des sanctions pour ${user.tag}`)
            .setThumbnail(user.displayAvatarURL());

        sanctions.forEach(sanction => {
            const date = new Date(sanction.date);
            const formattedDate = `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;

            embed.addFields(
                { name: "Sanction", value: sanction.type, inline: true },
                { name: "Raison", value: sanction.reason, inline: true },
                { name: "Date", value: formattedDate, inline: true },
                ...(sanction.type === 'Mute' ? [{ name: "Durée", value: formatDuration(sanction.duration), inline: true }] : [])
            );
        });

        return interaction.followUp({ embeds: [embed] });
    }
}

module.exports = CasierCommand;
