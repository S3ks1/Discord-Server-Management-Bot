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
module.exports.run = async (client, message, msgargs, command) => {
    if (!message.member.voice.channel){
        let embed = new Discord.MessageEmbed()
        .setDescription(":warning: You aren't in a voice channel")
        .setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
        return;
    }
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id){
        let embed = new Discord.MessageEmbed()
        .setDescription(":warning: You aren't in the same channel as I am")
        .setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
        return;
    }
    if (!client.player.getQueue(message)){
        let embed = new Discord.MessageEmbed()
        .setDescription(":warning: No currently playing music")
        .setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
        return;
    }
    if (!client.player.getQueue(message).paused){
        let embed = new Discord.MessageEmbed()
        .setDescription(":warning: This song is already playing")
        .setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
        return;
    }

    let embed = new Discord.MessageEmbed()
    .setDescription(`:ok_hand: Resumed ${client.player.getQueue(message).playing.title}`)
    .setColor(message.embedColor).setTimestamp()
    message.channel.send(embed)
    client.player.resume(message)
}
module.exports.help = {
    name: "resume",
    description: "resume the current song",
    usage: `resume`,
    aliases: [],
    category: "general",
    args: false
}