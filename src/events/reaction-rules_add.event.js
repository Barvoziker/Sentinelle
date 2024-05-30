const { Event } = require("sheweny");

class MessageReactionAddEvent extends Event {
    constructor(client) {
        super(client, "messageReactionAdd", {
            description: "Ajoute un rôle lorsque l'utilisateur accepte le règlement",
            once: false,
        });
    }

    async execute(reaction, user) {
        // Vérifier si la réaction est sur le message du règlement et si c'est la bonne réaction
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;

        const rulesMessageId = '1245796497702781051'; // Remplacez par l'ID du message du règlement
        const roleId = '1244682170623332522'; // ID du rôle à ajouter

        if (reaction.message.id === rulesMessageId && reaction.emoji.name === '✅') {
            console.log(`Ajout du rôle ${roleId} à ${user.username}`);
            const member = reaction.message.guild.members.cache.get(user.id);
            if (member) {
                member.roles.add(roleId).catch(console.error);
            }
        }
    }
}

module.exports = MessageReactionAddEvent;
