const { Defer, Embed, fetchData, formatDuration } = require("../utils/shortcuts");
const { Command } = require("sheweny");
const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

class GiveawayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "giveaway",
            description: "🎉 Créer ou annuler un giveaway",
            category: "Misc",
            options: [
                {
                    name: "action",
                    description: "Créer ou annuler un giveaway",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: "Créer", value: "create" },
                        { name: "Annuler", value: "cancel" }
                    ]
                },
                {
                    name: "cadeau",
                    description: "Cadeau à gagner",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "temps",
                    description: "Durée du giveaway",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "gagnants",
                    description: "Nombre de gagnants",
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                }
            ],
            clientPermissions: ["EmbedLinks", "ModerateMembers"],
            userPermissions: ["ModerateMembers"],
        });

        this.giveawayTimeout = null;
        this.giveawayMessage = null;
        this.giveawayEndTime = null;
    }

    async execute(interaction) {
        const action = interaction.options.getString("action");

        if (action === "create") {
            const cadeau = interaction.options.getString("cadeau");
            const temps = interaction.options.getString("temps");
            const gagnants = interaction.options.getInteger("gagnants");

            if (!cadeau || !temps || !gagnants) {
                return interaction.reply("Veuillez fournir tous les détails du giveaway.");
            }

            // Ping everyone et supprimer le message immédiatement après
            const pingMessage = await interaction.channel.send("@everyone");
            await pingMessage.delete();

            // Créer l'embed du giveaway
            const embed = new Embed()
                .setTitle('🎉 Giveaway ! 🎉')
                .setDescription(`Réagissez avec 🎉 pour participer !\n**Prix :** ${cadeau}\n**Durée :** ${temps}\n**Nombre de gagnants :** ${gagnants}`)
                .setColor('#FF0000')
                .setTimestamp(Date.now() + ms(temps))
                .setFooter({ text: 'Fin du giveaway' });

            // Envoyer l'embed et ajouter la réaction
            this.giveawayMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
            this.giveawayMessage.react('🎉');

            // Définir l'heure de fin du giveaway
            this.giveawayEndTime = Date.now() + ms(temps);

            // Attendre la fin du giveaway
            this.giveawayTimeout = this.waitForEnd(ms(temps), async () => {
                // Récupérer les réactions
                const reactions = await this.giveawayMessage.reactions.cache.get('🎉').users.fetch();
                const participants = reactions.filter(user => !user.bot).map(user => user.id);

                if (participants.length === 0) {
                    return interaction.followUp('Personne n\'a participé au giveaway.');
                }

                // Choisir les gagnants au hasard
                const winners = new Set();
                while (winners.size < Math.min(gagnants, participants.length)) {
                    const winner = participants[Math.floor(Math.random() * participants.length)];
                    winners.add(winner);
                }

                // Annoncer les gagnants dans un embed
                await interaction.followUp(`🎉 Félicitations ${[...winners].map(w => `<@${w}>`).join(', ')} ! Vous avez gagné **${cadeau}** ! 🎉`);
            });
        } else if (action === "cancel") {
            if (this.giveawayTimeout) {
                clearTimeout(this.giveawayTimeout);
                this.giveawayTimeout = null;

                if (this.giveawayMessage) {
                    await this.giveawayMessage.delete();
                    this.giveawayMessage = null;
                }

                return interaction.reply("Le giveaway a été annulé.");
            } else {
                return interaction.reply("Aucun giveaway en cours à annuler.");
            }
        }
    }

    // Fonction pour gérer les durées longues
    async waitForEnd(ms, callback) {
        if (ms > 2147483647) {
            setTimeout(() => this.waitForEnd(ms - 2147483647, callback), 2147483647);
        } else {
            setTimeout(callback, ms);
        }
    }
}

// Fonction pour convertir la durée en millisecondes
function ms(duration) {
    const match = duration.match(/(\d+)([smhd])/);
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return 0;
    }
}

module.exports = GiveawayCommand;