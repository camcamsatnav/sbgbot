const {SlashCommandBuilder, ButtonBuilder, ActionRowBuilder} = require('discord.js');
const {staffRole} = require('../../config.json');
const {FSDB} = require("file-system-db");
const {fetchLevel} = require("../../utils/getLevel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('applysetup')
        .setDescription('setup the apply command for your server')
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const confirm = new ButtonBuilder()
            .setCustomId('apply')
            .setLabel('Click to apply')
            .setStyle(3);

        const row = new ActionRowBuilder()
            .addComponents(confirm);

        await interaction.reply({
            content: `HELLo`,
            components: [row],
        });

        const collector = interaction.channel.createMessageComponentCollector();
        collector.on('collect', async event => {
            if (event.customId === 'apply') {

                //check if the channel already exists and if it does, return the channel
                const c = interaction.guild.channels.cache.find(channel => channel.name === `${event.user.username}-apply`);
                if (c) {
                    event.reply({content: `Apply channel: <#${c.id}> `, ephemeral: true});
                    return;
                }

                //create the channel
                await interaction.guild.channels.create({
                    name: `${event.user.username}-apply`
                }).then(async (c) => {
                    //move to specific category and give permissions
                    await c.setParent(interaction.guild.channels.cache.find(channel => channel.name === "[Tickets]"));
                    await c.permissionOverwrites.edit(event.user.id, {
                        ViewChannel: true,
                        SendMessages: true,
                        ReadMessageHistory: true
                    });
                    await c.permissionOverwrites.edit(staffRole, {
                        ViewChannel: true,
                        SendMessages: true,
                        ReadMessageHistory: true
                    });
                    await c.permissionOverwrites.edit(interaction.guild.roles.everyone, {ViewChannel: false});
                    event.reply({content: `Apply channel: <#${c.id}> `, ephemeral: true});

                    const db = new FSDB("./database/members.json", false);

                    c.send("HELLO");//nice application welcome message thing
                    const xp = await fetchLevel(db.get(event.user.username).minecraftUUID);
                    c.send(`https://sky.shiiyu.moe/stats/${db.get(event.user.username).minecraftName}`);
                    c.send(xp.toString());

                    //TODO: check if xp is high enough before makign channel
                    //TODO: check if user is in members.json -> if not make them verify
                });
            }
        });
    },
};