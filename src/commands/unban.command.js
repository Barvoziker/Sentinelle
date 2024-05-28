const { Defer, Embed} = require("../utils/shortcuts");
const { Command } = require("sheweny");
const {ApplicationCommandOptionType} = require("discord.js");

class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: "unban",
            description: "🔨 Débannir un membre",
            category: "Misc",
            options: [
                {
                    name: "membre",
                    description: "Membre à débannir",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "raison",
                    description: "Raison du déban",
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
        const member = interaction.options.getUser("membre");
        const reason = interaction.options.getString("raison") || "Aucune raison spécifiée";

        if (!member) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Veuillez mentionner un membre à débannir.")
                        .setColor("#FF0000"),
                ],
            });
        }

        const bans = await interaction.guild.bans.fetch();
        const bannedUser = bans.find((b) => b.user.id === member.id);

        if (!bannedUser) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Ce membre n'est pas banni.")
                        .setColor("#FF0000"),
                ],
            });
        }

        await interaction.guild.bans.remove(member, { reason });

        return await interaction.editReply({
            embeds: [
                Embed()
                    .setTitle("✅ Succès")
                    .setDescription(`${member} a été débanni avec succès.`)
                    .setColor("#00FF00"),
            ],
        });
    }
}

module.exports = UnbanCommand;
