const {db} = require('./../database/members.json');

async function main() {
    const guildData = await guildCall();
    const memberData = await memberCall(guildData);

    for (const member in memberData) {
        const player = db.get("players").find(player => player.minecraftUUID === member.uuid);
        
    }
}


async function guildCall() {
    const response = await fetch(`https://api.hypixel.net/v2/guild?id=5fea32eb8ea8c9724b8e3f3c`, {
        method: "GET",
        headers: {
            "Api-Key": "e48ec7a3-df20-409c-954e-f4537044cce1"
        },
    });
    return await response.json();
}

async function memberCall(data) {
    const playerData = [];
    for (let i = 0; i < data.guild.members.length; i++) {
        playerData.push({
            uuid: data.guild.members[i].uuid,
            rank: data.guild.members[i].rank
        });
    }
    return playerData;
}