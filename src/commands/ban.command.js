const { Defer, Embed, InsertData} = require("../utils/shortcuts");
const { Command } = require("sheweny");
const {ApplicationCommandOptionType} = require("discord.js");
const {BanData} = require("../db");

class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "🔨 Bannir un membre",
            category: "Misc",
            options: [
                {
                    name: "membre",
                    description: "Membre à bannir",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "raison",
                    description: "Raison du ban",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
            ],
            clientPermissions: ["EmbedLinks", "BanMembers"],
            userPermissions: ["BanMembers"],
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
                        .setDescription("Veuillez mentionner un membre à bannir.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (!member.bannable) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Je ne peux pas bannir ce membre.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (member.id === interaction.user.id) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Vous ne pouvez pas vous bannir vous-même.")
                        .setColor("#FF0000"),
                ],
            });
        }

        try {
            await member.ban({ reason: reason });

            await InsertData({id : member.id, reason, date : new Date(), moderatorId : interaction.user.id}, BanData);

            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("✅ Succès")
                        .setDescription(`${member} a été banni.`)
                        .setColor("#00FF00"),
                ],
            });
        } catch (error) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Une erreur s'est produite lors du bannissement de ce membre.")
                        .setColor("#FF0000"),
                ],
            });
        }
    }
}

module.exports = BanCommand;
