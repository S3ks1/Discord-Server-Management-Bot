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
    if(msgargs[0].toLowerCase() == "queue"){
        if(client.player.getQueue(message).loopMode){
            client.player.setLoopMode(message, false)
            let embed = new Discord.MessageEmbed()
            .setDescription(":ok_hand: Stopped looping your queue")
            .setColor(message.embedColor)
            .setTimestamp()
            message.channel.send(embed)
            return;
        }
        else{
            client.player.setLoopMode(message, true)
            let embed = new Discord.MessageEmbed()
            .setDescription(":ok_hand: Started looping the whole queue")
            .setTimestamp()
            .setColor(message.embedColor)
            message.channel.send(embed)
            return;
        }
    }
    else{
        if(client.player.getQueue(message).loopMode){
            client.player.setLoopMode(message, false)
            let embed = new Discord.MessageEmbed()
            .setDescription(":ok_hand: Stopped looping the curent song")
            .setTimestamp()
            .setColor(message.embedColor)
            message.channel.send(embed)
            return;
        }
        else{
            client.player.setLoopMode(message, true)
            let embed = new Discord.MessageEmbed()
            .setDescription(":ok_hand: Started looping the current song")
            .setTimestamp()
            .setColor(message.embedColor)
            message.channel.send(embed)
            return;
        }
    }
}

module.exports.help = {
    name: "loop",
    description: "loop [queue]",
    usage: `loop`,
    aliases: ["repeat", "l"],
    category: "general",
    args: false
}