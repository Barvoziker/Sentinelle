const { Defer, Embed, ParseTime} = require("../utils/shortcuts");
const { Command } = require("sheweny");
const {ApplicationCommandOptionType} = require("discord.js");

class UnmuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            description: " 🔊 Unmute un membre",
            category: "Misc",
            options: [
                {
                    name: "membre",
                    description: "Membre à mute",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
            clientPermissions: ["EmbedLinks", "MuteMembers"],
            userPermissions: ["MuteMembers"],
        });
    }

    async execute(interaction) {
        //avec member.timeout(timestamp, reason)
        await Defer(interaction);
        const member = interaction.options.getMember("membre");

        if (!member) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Veuillez mentionner un membre à unmute.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (!member.kickable) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Je ne peux pas unmute ce membre.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (member.id === interaction.user.id) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Vous ne pouvez pas vous unmute vous-même.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (member.id === interaction.client.user.id) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Je ne peux pas me unmute moi-même.")
                        .setColor("#FF0000"),
                ],
            });
        } else {
            try {
                try {
                    await member.send({
                        embeds: [
                            Embed()
                                .setTitle("🔊 Vous avez été unmute")
                                .setDescription(`Vous avez été unmute du serveur **${interaction.guild.name}**.`)
                                .setColor("#FF0000"),
                        ],
                    });
                } catch (error) {
                    console.log(error);
                }
                await member.timeout(null);
                return await interaction.editReply({
                    embeds: [
                        Embed()
                            .setTitle("✅ Succès")
                            .setDescription(`${member} a été unmute avec succès.`)
                            .setColor("#00FF00"),
                    ],
                });
            } catch (error) {
                return await interaction.editReply({
                    embeds: [
                        Embed()
                            .setTitle("❌ Erreur")
                            .setDescription("Une erreur s'est produite lors de l'unmute.")
                            .setColor("#FF0000"),
                    ],
                });
            }
        }

    }
}

module.exports = UnmuteCommand;

