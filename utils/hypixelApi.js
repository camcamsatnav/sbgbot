const {hypixelAPI} = require("../config.json");

/**
 * Fetches the highest level of a player
 * @param uuid
 * @returns {number} highest level
 */
async function fetchLevel(uuid) {
    const response = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`, {
        method: "GET",
        headers: {
            "Api-Key": hypixelAPI
        },
    });
    const data = await response.json();
    let highest = -1;
    for (let j = 0; j < data.profiles.length; j++) {
        if (data.profiles[j].members[uuid].leveling?.experience > highest) {
            highest = data.profiles[j].members[uuid].leveling?.experience
        }
    }
    return highest;
}

/**
 * Gets playerdata from hypixel api from uuid
 * @param {string} uuid
 * @returns {Object} data
 */
async function fetchPlayerdata(uuid) {
    const response = await fetch(`https://api.hypixel.net/v2/player?uuid=${uuid}`, {
        method: "GET",
        headers: {
            "Api-Key": hypixelAPI
        },
    });
    return await response.json();
}

/**
 * Gets sbg guild data from hypixel api
 * @returns {Object} data
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
 * Grabs the uuid and rank of each member in the guild
 * @param {Object} data
 * @returns {Object[]} array of {uuid: string, rank: string} objects
 */
async function memberGrab(data) {
    const playerData = [];
    for (let i = 0; i < data.guild.members.length; i++) {
        playerData.push({
            uuid: data.guild.members[i].uuid,
            rank: data.guild.members[i].rank
        });
    }
    return playerData;
}

module.exports = {fetchLevel, fetchPlayerdata, guildCall, memberGrab};