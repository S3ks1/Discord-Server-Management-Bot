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
    const role = message.guild.roles.cache.get(msgargs[0]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === msgargs.join(" ").toLowerCase()) || message.guild.roles.cache.get(msgargs[0].replace("<@&", "").replace(">", "")) || message.guild.roles.cache.find(role => role.name.toLowerCase().substr(0,3) === msgargs.join(" ").toLowerCase().substr(0,3))
    if(!role){
        let embed = new Discord.MessageEmbed()
        .setColor(message.embedColor)
        .setTimestamp()
        .setDescription(`:warning: Invalid role provided`)
        message.channel.send(embed)
        return;
    }
    console.log(role)
    let embed = new Discord.MessageEmbed()
    .setTitle(`Role info for ${role.name}`)
    .addField(`Role`, role, true)
    .addField(`Role ID`, role.id, true)
    .addField("Role Name", role.name, true)
    .addField(`Hoisted`, role.hoist == false ? `False` : `True`, true)
    .addField(`Position`, role.rawPosition, true)
    .addField(`Mentionable`, role.mentionable == false ? "False" : "True", true)
    .setColor(message.embedColor)
    .setTimestamp()
    message.channel.send(embed)
}
module.exports.help = {
    name: "roleinfo",
    description: "View detailed information about a role",
    usage: `roleinfo <role>`,
    aliases: ["rinfo"],
    category: "administrator",
    args: true
}