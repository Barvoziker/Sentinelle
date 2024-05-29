const { Defer, Embed, ParseTime, InsertData} = require("../utils/shortcuts");
const { Command } = require("sheweny");
const {ApplicationCommandOptionType} = require("discord.js");
const {MuteData} = require("../db");

class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mute",
            description: "🔇 Mute un membre",
            category: "Misc",
            options: [
                {
                    name: "membre",
                    description: "Membre à mute",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "raison",
                    description: "Raison du mute",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "temps",
                    description: "Temps du mute",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        {
                            name: "5 minutes",
                            value: "5m",
                        },
                        {
                            name: "15 minutes",
                            value: "15m",
                        },
                        {
                            name: "30 minutes",
                            value: "30m",
                        },
                        {
                            name: "1 heure",
                            value: "1h",
                        },
                        {
                            name: "3 heures",
                            value: "3h",
                        },
                        {
                            name: "6 heures",
                            value: "6h",
                        },
                        {
                            name: "12 heures",
                            value: "12h",
                        },
                        {
                            name: "1 jour",
                            value: "1j",
                        },
                        {
                            name: "3 jours",
                            value: "3j",
                        },
                        {
                            name: "1 semaine",
                            value: "1s",
                        },
                        {
                            name: "1 mois",
                            value: "1m",
                        },

                    ],
                }
            ],
            clientPermissions: ["EmbedLinks", "MuteMembers"],
            userPermissions: ["MuteMembers"],
        });
    }

    async execute(interaction) {
       //avec member.timeout(timestamp, reason)
        await Defer(interaction);
        const member = interaction.options.getMember("membre");
        const reason = interaction.options.getString("raison") || "Aucune raison spécifiée";
        const time = ParseTime(interaction.options.getString("temps")) || 0;


        if (!member) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Veuillez mentionner un membre à mute.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (!member.kickable) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Je ne peux pas mute ce membre.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (member.id === interaction.user.id) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Vous ne pouvez pas vous mute vous-même.")
                        .setColor("#FF0000"),
                ],
            });
        } else if (member.id === interaction.client.user.id) {
            return await interaction.editReply({
                embeds: [
                    Embed()
                        .setTitle("❌ Erreur")
                        .setDescription("Je ne peux pas me mute moi-même.")
                        .setColor("#FF0000"),
                ],
            });
        } else {
            try {
                try {
                    await member.send({
                        embeds: [
                            Embed()
                                .setTitle("🔇 Vous avez été mute")
                                .setDescription(`Vous avez été mute du serveur **${interaction.guild.name}**.\nRaison : ${reason} \nTemps : ${interaction.options.getString("temps") || "Aucun temps spécifié"}` )
                                .setColor("#FF0000"),
                        ],
                    });
                } catch (error) {
                    console.log(error);
                }
                await member.timeout(time, reason);
                await InsertData({id : member.id, reason, duration : time, date : new Date(), moderatorId: interaction.user.id}, MuteData);
                return await interaction.editReply({
                    embeds: [
                        Embed()
                            .setTitle("✅ Succès")
                            .setDescription(`${member} a été mute avec succès.`)
                            .setColor("#00FF00"),
                    ],
                });
            } catch (error) {
                return await interaction.editReply({
                    embeds: [
                        Embed()
                            .setTitle("❌ Erreur")
                            .setDescription("Une erreur s'est produite lors du mute.")
                            .setColor("#FF0000"),
                    ],
                });
            }
        }
    }
}

module.exports = MuteCommand;

