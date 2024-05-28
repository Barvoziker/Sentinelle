const { Defer, Embed } = require("../utils/shortcuts");
const { Command } = require("sheweny");

class ClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: "clear",
            description: "🧹 Vider le chat",
            category: "Misc",
            options: [
                {
                    name: "nombre",
                    description: "Nombre de messages à supprimer",
                    type: 4,
                    required: true,
                },
            ],
            clientPermissions: ["EmbedLinks", "ManageMessages"],
            userPermissions: ["MuteMembers", "ManageMessages"],
        });
    }
    async execute(interaction) {
            const amount = interaction.options.getInteger("nombre");
            if (amount < 1 || amount > 100) {
                return await interaction.reply({
                    ephemeral: true,
                    embeds: [
                        Embed()
                            .setTitle("❌ Erreur")
                            .setDescription("Le nombre de messages à supprimer doit être compris entre 1 et 100.")
                            .setColor("#FF0000"),
                    ],
                });
            }
            await interaction.channel.bulkDelete(amount);
            await interaction.reply({
                ephemeral: true,
                embeds: [
                    Embed()
                        .setTitle("✅ Succès")
                        .setDescription(`Suppression de ${amount} messages.`)
                        .setColor("#00FF00"),
                ],
            });

    }
}

module.exports = ClearCommand;