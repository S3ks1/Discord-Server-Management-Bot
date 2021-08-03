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
    .setTitle(`Roles for ${message.guild.name}`)
    .setDescription(message.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r))
    message.channel.send(embed)
}
module.exports.help = {
    name: "roles",
    description: "List all of the roles in the current guild",
    usage: `roles`,
    aliases: ["rolelist"],
    category: "general",
    args: false
}