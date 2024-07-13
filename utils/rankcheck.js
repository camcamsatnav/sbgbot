const {guildRole} = require('./../config.json');
const {getGuildMembers, removeGuildMember, addGuildMember} = require("../database/db.js")
const {getMemberByUUID} = require("../database/db");
const {guildCall} = require("../utils/hypixelApi");
const {memberGrab} = require("./hypixelApi");

/**
 * Adds and removes guild member roles
 * @param members people with guild member role
 */
async function main(members) {
    const guildData = await guildCall();
    const memberData = await memberGrab(guildData);

    const dbData = await getGuildMembers();
    //says they are in guild but they arent
    for (const member of dbData) {
        if (!memberData.find(m => m.uuid === member.minecraftuuid)) {
            //remove role and update db
            // await removeGuildMember(member.discord);
            //
            // const member = members.find(member => member.id === member.discord);
            // member.roles.remove(guildRole);
            console.log(`i wouold have removed roles from ${member.discord}`);
        }
    }
    //they are in the guild but says they arent in the db
    for (const member of memberData) {
        const userData = await getMemberByUUID(member.uuid);
        try {
            if (!dbData.find(m => m.minecraftuuid === member.uuid)) {
                //add role and update db
                await addGuildMember(userData.discord);

                const member = members.find(member => member.id === userData.discord);
                member.roles.add(guildRole);
            } else {
                console.log(`i would have done nothing to ${userData.discord}`);
            }
        } catch (e) {
            console.log(`i would have added roles to ${member.uuid}`)
        }

    }
}

module.exports = {main}
