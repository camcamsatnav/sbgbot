const {hypixelAPI} = require("./config.json");
const { addMember, printall } = require("./database/db.js");

/**
 * 
 * @returns All members in the guild
 */

async function guildCall() {
    const response = await fetch(`https://api.hypixel.net/v2/guild?id=5fea32eb8ea8c9724b8e3f3c`, {
        method: "GET",
        headers: {
            "Api-Key": hypixelAPI
        },
    });
    return await response.json();
}

/**
 * Gets playerdata from hypixel api from uuid
 * @param {string} uuid 
 * @returns {Object} data
 */
async function fetchHypixel(uuid) {
    const response = await fetch(`https://api.hypixel.net/v2/player?uuid=${uuid}`, {
        method: "GET",
        headers: {
            "Api-Key": hypixelAPI
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

async function main() {
    const allMembers = await guildCall();
    let allUUIDS = await memberCall(allMembers);

    for (let player of allUUIDS) {
        let hypixel = await fetchHypixel(player.uuid);
        let minecraftName = hypixel.player.playername
        let discord;
        if (hypixel.player.socialMedia === undefined || hypixel.player.socialMedia.links === undefined || !hypixel.player.socialMedia.links.DISCORD) {
            console.log(`${hypixel.player.playername} doesnt have discord linked`)
            discord = "HELLO I HAVE NO DISCORD"
        } else {
            discord = hypixel.player.socialMedia.links.DISCORD
        }
        
        player.discord = discord;
        player.minecraftName = minecraftName;

    }

    for (let player of allUUIDS) {
        await addMember(player.discord, player.minecraftName, player.uuid, true);
    }

    printall();
}

main();