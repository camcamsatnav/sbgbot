const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {verifiedRole} = require('../../config.json');
const {addMember} = require("../../database/db.js");
const {fetchPlayerdata} = require("../../utils/hypixelApi");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('link your minecraft account to your discord account')
        .addStringOption(option => option.setName('minecraft-username').setDescription('Your minecraft username').setRequired(true)),
    async execute(interaction) {
        const uuid = await fetchUUID(interaction.options.getString("minecraft-username"));
        const hypixelData = await fetchPlayerdata(uuid.id);

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

        await addMember(interaction.user.username, interaction.options.getString("minecraft-username"), uuid.id, false)

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
