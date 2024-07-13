const {addMember, printall} = require("./database/db.js");
const {fetchPlayerdata, guildCall, memberGrab} = require("./utils/hypixelApi");

async function main() {
    const allMembers = await guildCall();
    let allUUIDS = await memberGrab(allMembers);

    for (let player of allUUIDS) {
        let hypixel = await fetchPlayerdata(player.uuid);
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