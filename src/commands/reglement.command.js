const { Defer, Embed, fetchData, formatDuration } = require("../utils/shortcuts");
const { Command } = require("sheweny");
const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

class RulesCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rules",
            description: "📜 Afficher le règlement du serveur",
            category: "Misc",
            clientPermissions: ["EmbedLinks", "ModerateMembers"],
            userPermissions: ["ModerateMembers"],
        });
    }

    async execute(interaction) {
        // Créer l'embed du règlement
        const embed = new Embed()
            .setTitle('📜 Règlement du Serveur')
            .setColor('#00FF00')
            .addFields(
                { name: '1. Respect et courtoisie', value: '1.1 Tous les membres doivent se traiter avec respect. Les insultes, harcèlements, discriminations et comportements offensants ne seront pas tolérés.\n1.2 Les débats et discussions sont encouragés, mais doivent rester respectueux et constructifs.' },
                { name: '2. Comportement et contenu appropriés', value: '2.1 Aucun contenu inapproprié (pornographique, violent, choquant, etc.) n\'est autorisé.\n2.2 Le partage de contenu illégal, y compris des logiciels piratés, est strictement interdit.\n2.3 Les publicités non sollicitées et les spams sont interdits. Cela inclut les liens vers d\'autres serveurs Discord sans autorisation préalable des administrateurs.' },
                { name: '3. Confidentialité et sécurité', value: '3.1 Ne partagez pas d\'informations personnelles (votre adresse, numéro de téléphone, etc.) dans les canaux publics.\n3.2 Respectez la vie privée des autres membres. Ne partagez pas leurs informations sans leur consentement.' },
                { name: '4. Utilisation des canaux', value: '4.1 Utilisez les canaux appropriés pour vos messages. Chaque canal a un but spécifique, respectez-le.\n4.2 Les canaux de streaming sont réservés aux streamers autorisés. Ne perturbez pas les sessions en cours.' },
                { name: '5. Langage et communication', value: '5.1 Utilisez un langage approprié et courtois. Évitez les grossièretés et les propos vulgaires.\n5.2 Évitez le langage SMS ou les abréviations excessives pour faciliter la compréhension de tous.' },
                { name: '6. Discussions religieuses et politiques', value: '6.1 Les discussions sur les religions et la politique doivent être menées avec respect et sensibilité. Toute forme d\'intolérance ou de prosélytisme est interdite.\n6.2 Si une discussion devient conflictuelle, les modérateurs se réservent le droit de la clôturer.' },
                { name: '7. Modération et sanctions', value: '7.1 Les modérateurs et administrateurs ont le droit d\'avertir, expulser ou bannir tout membre ne respectant pas les règles.\n7.2 Si vous êtes témoin d\'un comportement inapproprié, signalez-le à un modérateur ou administrateur.' },
                { name: '8. Changements et mises à jour', value: '8.1 Ce règlement peut être modifié à tout moment par le fondateur ou les administrateurs.\n8.2 Les membres seront informés de toute modification importante.' }
            )
            .setFooter({ text: 'Merci de respecter ces règles pour le bien de tous.' });
    }
}

module.exports = RulesCommand;