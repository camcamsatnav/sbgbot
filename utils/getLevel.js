const {hypixelAPI} = require("../config.json");

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

module.exports = {fetchLevel};