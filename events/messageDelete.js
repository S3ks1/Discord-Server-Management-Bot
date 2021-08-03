const { ClientVoiceManager } = require('discord.js');
const {
    client,
    cooldowns,
    Discord,
    fs,
    ms,
    moment,
    config,
    User,
    Guild,
    Ticket,
    Perms
} = require("../index") 

client.on("messageDelete", async (messageDelete) => {
    await Discord.Util.delayFor(1000);

    const fetched = await messageDelete.guild.fetchAuditLogs({
        limit: 6,
        type: 'MESSAGE_DELETE'
    }).catch(()=> ({
        entries: []
    }))
    const entry = fetched.entries.find(a=> 
        a.extra.channel.id === messageDelete.channel.id 
        && Date.now() - a.createdTimestamp < 20000)
    const executor = entry ? entry.executor.tag : 'Unknown';
    const deletedEmbed = new Discord.MessageEmbed()
    .setTitle("Deleted Message")
    .setDescription(`**Author:** ${messageDelete.author}\n**Deleted By:** ${executor}\n**Channel:** ${messageDelete.channel.name}\n**Content:** ${messageDelete.content || "None"}`)
    .setFooter(`Message ID: ${messageDelete.id}`)
    .setTimestamp()
    .setColor(client[messageDelete.guild.id].settings.embedColor)
    let msglogs = messageDelete.guild.channels.cache.find(c => c.name === client[messageDelete.guild.id].settings.messageLogChannel)
    if(!msglogs) return;
    else{
        msglogs.send(deletedEmbed)
    }
})