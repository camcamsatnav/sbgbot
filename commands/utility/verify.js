const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {hypixelAPI, verifiedRole} = require('../../config.json');
const { FSDB } = require("file-system-db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('link your minecraft account to your discord account')
        .addStringOption(option => option.setName('minecraft-username').setDescription('Your minecraft username').setRequired(true)),
    async execute(interaction) {
        let uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${interaction.options.getString("minecraft-username")}`);
        uuid = await uuid.json();

        let hypixelData = await fetch(`https://api.hypixel.net/v2/player?uuid=${uuid.id}`, {
            method: "GET",
            headers: {
                "Api-Key": hypixelAPI
            },
        });
        hypixelData = await hypixelData.json();

        const failedEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Unsuccessful verification')
            .addFields(
                { name: 'Your discord username', value: interaction.user.username },
                    { name: 'Discord username linked to minecraft account', value: hypixelData.player.socialMedia.links.DISCORD }
            )
            .setTimestamp()
            .setFooter({ text: 'Benjybot' });
        const successEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Successful verification')
            .addFields(
                { name: 'Your discord username', value: interaction.user.username },
                { name: 'Discord username linked to minecraft account', value: hypixelData.player.socialMedia.links.DISCORD }
            )
            .setTimestamp()
            .setFooter({ text: 'Benjybot' });

        if (interaction.user.username !== hypixelData.player.socialMedia.links.DISCORD) {
            await interaction.reply({embeds: [failedEmbed], ephemeral: true});
            return;
        }

        const db = new FSDB("./database/members.json", false); //change to true before deployment

        db.set(interaction.user.username, {
            discordID: interaction.user.id,
            minecraftName: interaction.options.getString("minecraft-username"),
            minecraftUUID: uuid.id
        });

        const member = interaction.guild.members.cache.find(member => member.id === interaction.user.id);
        member.roles.add(verifiedRole);

        await interaction.reply({embeds: [successEmbed], ephemeral: true});


        //minecraft username to uuid ->
        //https://api.hypixel.net/v2/player?uuid=6994c547-f53e-4107-ace4-a0bb48609bb5 -> fetch this url
        //socialMedia.links.DISCORD -> check if this is the same as the discord account
        //put in database with important stuff
        //give verified role
    },
};