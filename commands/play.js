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
    let embed = new Discord.MessageEmbed()
    .setDescription(`:ok_hand: Added ${msgargs.join(" ")} to the queue`)
    .setColor(message.embedColor).setTimestamp()
    message.channel.send(embed)
    client.player.play(message, msgargs.join(" "), {firstResult: true})
}
module.exports.help = {
    name: "play",
    description: "Play a song",
    usage: `play <song>`,
    aliases: ["p"],
    category: "general",
    args: true
}