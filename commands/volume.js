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
    if(isNaN(msgargs[0]) || msgargs[0].toLowerCase() == "infinity"){
        let embed = new Discord.MessageEmbed()
        .setDescription(":warning: Invalid Number")
        .setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
        return;
    }
    if(Math.round(parseInt(msgargs[0])) < 1 || Math.round(parseInt(msgargs[0])) > 100){
        let embed = new Discord.MessageEmbed()
        .setDescription(":warning: Invalid Number")
        .setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
        return;
    }
    client.player.setVolume(message, parseInt(msgargs[0]))
    let embed = new Discord.MessageEmbed()
    .setDescription(`:ok_hand: Set volume to ${msgargs[0]}%`)
    .setColor(message.embedColor).setTimestamp()
    message.channel.send(embed)
}
module.exports.help = {
    name: "volume",
    description: "Change volume",
    usage: `volume [1-100]`,
    aliases: ["v"],
    category: "general",
    args: true
}