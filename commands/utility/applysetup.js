const {SlashCommandBuilder, ButtonBuilder, ActionRowBuilder} = require('discord.js');
const {staffRole, requirement, applicationPingRole} = require('../../config.json');
const {fetchLevel} = require("../../utils/getLevel");
const db = require("../../database/db").getMembers();
const {invitePlayer} = require("../../utils/wsHandler");


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
                const player = db.get("players").find(player => player.discord === event.user.username);

                //check if user is verified
                if (!player) {
                    event.reply({content: "Please run /verify first", ephemeral: true});
                    return;
                }

                //fetch xp and check if reaches minimum requirement
                const xp = await fetchLevel(player.minecraftUUID);
                if (Math.floor(xp / 100) < requirement) {
                    event.reply({content: `You must be level ${requirement} to apply`, ephemeral: true});
                    return;
                }

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
                    await applyChannel(c, event, interaction, xp, player)
                });
            }
        });
    },
};

/**
 * Creates the application channel and sets up the buttons
 * @param c channel
 * @param event apply button event
 * @param interaction apply button interaction
 * @param xp player's skyblock xp
 * @param player player's data
 * @returns {Promise<void>}
 */
async function applyChannel(c, event, interaction, xp, player) {
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
    await event.reply({content: `Apply channel: <#${c.id}> `, ephemeral: true});


    await c.send("HELLO");//nice application welcome message thing
    await c.send(`https://sky.shiiyu.moe/stats/${player.minecraftName}`);

    const cancel = new ButtonBuilder()
        .setCustomId('cancelapplication')
        .setLabel('Click to cancel')
        .setStyle(4);
    const submit = new ButtonBuilder()
        .setCustomId('submitapplication')
        .setLabel('Click to submit')
        .setStyle(3);
    const row = new ActionRowBuilder()
        .addComponents(cancel, submit);

    await c.send({content: `Skyblock level: ${Math.floor(xp / 100)}`, components: [row]});

    const collector = c.createMessageComponentCollector();

    collector.on('collect', async applicationEvent => {
        if (applicationEvent.customId === 'cancelapplication') {
            applicationEvent.reply({content: "Application cancelled", ephemeral: true});
            c.delete();
        } else if (applicationEvent.customId === 'submitapplication') {

            const accept = new ButtonBuilder()
                .setCustomId('acceptapplication')
                .setLabel('Accept')
                .setStyle(3);
            const deny = new ButtonBuilder()
                .setCustomId('denyapplication')
                .setLabel('Deny')
                .setStyle(4);
            const row = new ActionRowBuilder()
                .addComponents(deny, accept);

            await applicationEvent.reply({content: "Application submitted"});
            c.messages.fetch(`${applicationEvent.message.id}`).then(msg => msg.edit({components: []}));
            c.send({
                content: `Please wait for a staff member to review your application <@${applicationPingRole}>`,
                components: [row],
                tts: true
            });//add back &

        } else if (applicationEvent.customId === 'acceptapplication') {
            await applicationEvent.reply({content: "Application accepted"});
            await invitePlayer(player.minecraftUUID);
            c.messages.fetch(`${applicationEvent.message.id}`).then(msg => msg.edit({components: []}));
        } else if (applicationEvent.customId === 'denyapplication') {
            applicationEvent.reply({content: "Application denied"});
            c.messages.fetch(`${applicationEvent.message.id}`).then(msg => msg.edit({components: []}));
        }
    })
}
