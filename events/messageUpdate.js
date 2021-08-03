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

client.on("messageUpdate", async (old, newm) => {
    if(!newm.guild) return;
    if(!newm.guild.id) return;
    if(old.content == newm.content) return;

    let embed = new Discord.MessageEmbed()
    .setTitle("Edited Message")
    .setDescription(`**Author:** ${old.author.username}#${old.author.discriminator}\n**Old Content:** ${old.content}\n**New Content:** ${newm.content}\n**Channel:** ${old.channel.name}`)
    .setFooter(`Message ID: ${old.id} | Author: ${old.author.id}`)
    .setTimestamp()
    .setColor(client[newm.guild.id].settings.embedColor)
    let chan = old.guild.channels.cache.find(c => c.name == client[newm.guild.id].settings.messageLogChannel)
    if(!chan) return;
    else{
        chan.send(embed)
    }
})