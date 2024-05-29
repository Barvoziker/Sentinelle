const { Defer, Embed, InsertData} = require("../utils/shortcuts");
const { Command } = require("sheweny");
const {ApplicationCommandOptionType} = require("discord.js");
const {KickData} = require("../db");

class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: "kick",
            description: "👟 Kick un membre",
            category: "Misc",
            options: [
                {
                    name: "membre",
                    description: "Membre à kick",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "raison",
                    description: "Raison du kick",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
            ],
            clientPermissions: ["EmbedLinks", "KickMembers"],
            userPermissions: ["KickMembers"],
        });
    }

    async execute(interaction) {
        await Defer(interaction);
        const member = interaction.options.getMember("membre");
        const reason = interaction.options.getString("raison") || "Aucune raison spécifiée";

        if (!member) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Veuillez mentionner un membre à kick.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (!member.kickable) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Je ne peux pas kick ce membre.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (member.id === interaction.user.id) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Vous ne pouvez pas vous kick vous-même.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (member.id === interaction.client.user.id) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Je ne peux pas me kick moi-même.")
                        .setColor("#FF0000"),
                ],
            });
        } else {
            try {
                await member.send({
                    embeds: [
                        Embed()
                            .setTitle("👟 Vous avez été kick")
                            .setDescription(`Vous avez été kick du serveur **${interaction.guild.name}**.\nRaison : ${reason}`)
                            .setColor("#FF0000"),
                    ],
                });
            } catch (error) {
                console.log(error);
            }
            await InsertData({
                id: member.id,
                reason: reason,
                date: new Date(),
                moderatorId: interaction.user.id,
            }, KickData);
            await member.kick(reason);
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("✅ Succès")
                        .setDescription(`Le membre ${member.user.tag} a été kick avec succès.`)
                        .setColor("#00FF00"),
                ],
            });
        }
    }
}

module.exports = KickCommand;

