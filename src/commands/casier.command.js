const { Defer, Embed, fetchData, formatDuration } = require("../utils/shortcuts");
const { Command } = require("sheweny");
const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const KickData = require("../db/kickSchema");
const BanData = require("../db/banSchema");
const MuteData = require("../db/muteSchema");
const UnbanData = require("../db/unbanSchema");

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
        const unbans = await UnbanData.find({ id: user.id }).exec();
        const mutes = await MuteData.find({ id: user.id }).exec();

        if (kicks.length === 0 && bans.length === 0 && unbans.length === 0 && mutes.length === 0) {
            return interaction.followUp(`Aucun casier trouvé pour le membre ${user.tag}`);
        }

        const sanctions = [
            ...kicks.map(kick => ({ type: 'Kick', ...kick._doc })),
            ...bans.map(ban => ({ type: 'Ban', ...ban._doc })),
            ...unbans.map(unban => ({ type: 'Unban', ...unban._doc })),
            ...mutes.map(mute => ({ type: 'Mute', ...mute._doc })),
        ];

        // Trier les sanctions par date décroissante
        sanctions.sort((a, b) => new Date(b.date) - new Date(a.date));

        const sanctionsPerPage = 3;
        let currentPage = 0;
        const totalPages = Math.ceil(sanctions.length / sanctionsPerPage);

        const generateEmbed = (page) => {
            const embed = new Embed()
                .setTitle(`Casier de ${user.tag}`)
                .setDescription(`Voici l'historique des sanctions pour ${user.tag}`)
                .setThumbnail(user.displayAvatarURL())
                .setColor('#FF0000');

            const start = page * sanctionsPerPage;
            const end = start + sanctionsPerPage;
            const pageSanctions = sanctions.slice(start, end);

            pageSanctions.forEach(sanction => {
                const date = new Date(sanction.date);
                const formattedDate = `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;

                // Sélection de l'icône en fonction de la sanction
                let icon;
                switch (sanction.type) {
                    case 'Kick':
                        icon = '👟';
                        break;
                    case 'Ban':
                        icon = '🔨';
                        break;
                    case 'Unban':
                        icon = '🛡️';
                        break;
                    case 'Mute':
                        icon = '🔇';
                        break;
                    default:
                        icon = '⚠️';
                }

                const value = `
                    ${icon} **Sanction**: ${sanction.type}
                    📄 **Raison**: ${sanction.reason}
                    📅 **Date**: ${formattedDate}
                    🧑‍⚖️ **Modérateur**: <@${sanction.moderatorId || 'Inconnu'}>
                    ${sanction.type === 'Mute' ? `⏳ **Durée**: ${formatDuration(sanction.duration)}` : ''}
                `;

                embed.addFields({ name: '\u200B', value: value.trim(), inline: false });
            });

            return embed;
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Précédent')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Suivant')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === totalPages - 1)
            );

        const message = await interaction.followUp({ embeds: [generateEmbed(currentPage)], components: [row] });

        const filter = i => ['prev', 'next'].includes(i.customId) && i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'prev' && currentPage > 0) {
                currentPage--;
            } else if (i.customId === 'next' && currentPage < totalPages - 1) {
                currentPage++;
            }

            row.components[0].setDisabled(currentPage === 0);
            row.components[1].setDisabled(currentPage === totalPages - 1);

            await i.update({ embeds: [generateEmbed(currentPage)], components: [row] });
        });

        collector.on('end', collected => {
            row.components.forEach(button => button.setDisabled(true));
            message.edit({ components: [row] });
        });
    }
}

module.exports = CasierCommand;
