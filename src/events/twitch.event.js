const { Embed } = require("../utils/shortcuts");
const config = require("../config");

const twitchClientId = config.TWITCH_CLIENT_ID;
const twitchClientSecret = config.TWITCH_CLIENT_SECRET;
const twitchUsername = config.TWITCH_USERNAME;
const discordChannelId = config.TWITCH_ANNOUNCEMENT_CHANNEL_ID;

let accessToken = "";
let isLive = false;

async function getAccessToken() {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
            client_id: twitchClientId,
            client_secret: twitchClientSecret,
            grant_type: "client_credentials",
        }),
    });
    const data = await response.json();
    accessToken = data.access_token;
}

async function checkLiveStatus(client) {
    if (!accessToken) {
        await getAccessToken();
    }

    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${twitchUsername}`, {
        headers: {
            "Client-ID": twitchClientId,
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    const stream = data.data[0];

    if (stream && !isLive) {
        isLive = true;
        const channel = client.channels.cache.get(discordChannelId);
        if (channel) {
            const embed = Embed()
                .setTitle(`${twitchUsername} est en live sur Twitch !`)
                .setURL(`https://www.twitch.tv/${twitchUsername}`)
                .setDescription("▸ " + stream.title)
                .setColor("#9146FF")
                .setThumbnail("https://cdn.discordapp.com/attachments/714815450864943144/1245423836531523656/Logo.png?ex=6658b2d5&is=66576155&hm=b0732a221067078faac6a340020b6d32e8f900e6f8fba89b24055421f873c23f&")
                .setFooter("Barvoziker_1.tv")
                .set

            await channel.send({ embeds: [embed] });
            const everyone = await channel.send("@everyone");
            setTimeout(() => {
                everyone.delete().catch(console.error);
            }, 1000);
        }
    } else if (!stream && isLive) {
        isLive = false;
    }
}

module.exports = {
    startTwitchListener: (client) => {
        setInterval(() => checkLiveStatus(client), 100);
    },
};