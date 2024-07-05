const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {hypixelAPI, verifiedRole} = require('../../config.json');
const db = require("../../database/db.js").getMembers();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('link your minecraft account to your discord account')
        .addStringOption(option => option.setName('minecraft-username').setDescription('Your minecraft username').setRequired(true)),
    async execute(interaction) {
        const uuid = await fetchUUID(interaction.options.getString("minecraft-username"));
        const hypixelData = await fetchHypixel(uuid.id);

        const failedEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Unsuccessful verification')
            .addFields(
                {
                    name: 'Your discord username',
                    value: interaction.user.username
                },
                {
                    name: 'Discord username linked to minecraft account',
                    value: hypixelData.player.socialMedia.links.DISCORD
                }
            )
            .setTimestamp()
            .setFooter({text: 'Benjybot'});

        const successEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Successful verification')
            .addFields(
                {
                    name: 'Your discord username',
                    value: interaction.user.username
                },
                {
                    name: 'Discord username linked to minecraft account',
                    value: hypixelData.player.socialMedia.links.DISCORD
                }
            )
            .setTimestamp()
            .setFooter({text: 'Benjybot'});
        
        //if username doesnt match given minecraft usernames linked discord, give error
        if (interaction.user.username !== hypixelData.player.socialMedia.links.DISCORD) {
            await interaction.reply({embeds: [failedEmbed], ephemeral: true});
            return;
        }

        //add verified player to database
        db.push("players", {
            discord: interaction.user.username,
            minecraftName: interaction.options.getString("minecraft-username"),
            minecraftUUID: uuid.id,
            guild: false
        })

        const member = interaction.guild.members.cache.find(member => member.id === interaction.user.id);
        member.roles.add(verifiedRole);

        await interaction.reply({embeds: [successEmbed], ephemeral: true});
    },
};
/**
 * Converts a username into a uuid
 * @param {string} username 
 * @returns {string} uuid
 */
async function fetchUUID(username) {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
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