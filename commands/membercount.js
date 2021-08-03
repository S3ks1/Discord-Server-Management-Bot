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
    let embed = new Discord.MessageEmbed()
    .setColor(message.embedColor)
    .setTimestamp()
    .setTitle(`Membercount for ${message.guild.name}`)
    .setDescription(message.guild.memberCount)
    message.channel.send(embed)
}
module.exports.help = {
    name: "membercount",
    description: "Get membercount of current guild",
    usage: `membercount`,
    aliases: [],
    category: "general",
    args: false
}