const db = require('./../database/db.js').getMembers();
const {hypixelAPI} = require('./../config.json');

/**
 * Adds and removes guild member roles
 * @param members people with guild member role 
 */
async function main(members) {
    const guildData = await guildCall();
    const memberData = await memberCall(guildData);

    //first sync the db to match ingame
    await db.get("players").forEach(player => {
        if (player.guild === false && !memberData.find(member => member.uuid === player.minecraftUUID)) {
            console.log(`${player.minecraftUUID} is not in the guild and not in the db`); //fine
        } else if (player.guild === true && memberData.find(member => member.uuid === player.minecraftUUID)) {
            console.log(`${player.minecraftUUID} is in the guild and in the db`); //fine
        } else if (player.guild === false && memberData.find(member => member.uuid === player.minecraftUUID)) {
            console.log(`${player.minecraftUUID} is in the guild and not in the db`); //ie joined but not in db
            player.guild = true; //sets the database to say they are in the guild
        } else if (player.guild === true && !memberData.find(member => member.uuid === player.minecraftUUID)) {
            console.log(`${player.minecraftUUID} not in the guild and is in the db`); //ie they left
            player.guild = false; //sets database to say not in the guild
        }
    });
    //then sync roles to match the db
    await db.get("players").forEach(player => {
        if (player.guild === true && members.find(m => m.user.username === player.discord)) {
            //in guild and has role
        } else if (player.guild === false && members.find(m => m.user.username === player.discord)) {
            // not in guild but has guild member role therefore remove role on discord
            console.log(`i am removing guild memebr role from ${player.minecraftName}`)
        } else if (player.guild === true && !members.find(m => m.user.username === player.discord)) {
            //in guild but doesnt have role therefore add role on discord
            console.log(`i am adding guild memebr role to ${player.minecraftName}`)
        } else if (player.guild === false && !members.find(m => m.user.username === player.discord)) {
            //not in guild and doent have role
        }
    });
}


async function guildCall() {
    const response = await fetch(`https://api.hypixel.net/v2/guild?id=5fea32eb8ea8c9724b8e3f3c`, {
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

module.exports = {main}
