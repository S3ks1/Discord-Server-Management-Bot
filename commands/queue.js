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
   const queue = client.player.getQueue(message)

   let embed = new Discord.MessageEmbed()
   .setTimestamp()
   .setTitle("Current Song Queue")
   .addField("Current", `${queue.playing.title} ➥ ${queue.playing.author}`)
   .setColor(message.embedColor())
   .setDescription(`**QUEUE**\n${queue.tracks.map((a, i) => {
    return `**#${i+1} - ${a.title}** ➥ ${a.author} (Requested by ${a.requestedBy.username})`
   }).slice(0,10).join("\n")}`)
   message.channel.send(embed)
}

module.exports.help = {
    name: "queue",
    description: "queue",
    usage: `queue`,
    aliases: ["q"],
    category: "general",
    args: false
}