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
    var user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs[0]) || message.author
    const role = message.guild.roles.cache.get(msgargs[1]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === msgargs.slice(1).join(" ").toLowerCase()) || message.guild.roles.cache.get(msgargs[1].replace("<@&", "").replace(">", "")) || message.guild.roles.cache.find(role => role.name.toLowerCase().substr(0,3) === msgargs.slice(1).join(" ").toLowerCase().substr(0,3))
    if(msgargs[0] === "me"){
        user = message.guild.member(message.author)
    }
    if(!user){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid User`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(!role){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid Role`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(message.guild.me.roles.highest.position <= role.position){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: I can't give this role as it is higher than my highest role.`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(message.guild.members.cache.get(message.author.id).roles.highest.position <= role.position && message.author.id !== "818991025024270357"){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: You can't give this role as it is higher than your highest role or equal to your highest role`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(!user.roles.cache.find(r => r.name == role.name)){
        let embed = new Discord.MessageEmbed()
        .setDescription(`:ok_hand: Added the ${role} role to ${user.user.tag}`)
        .setColor(message.embedColor)
        .setTimestamp()
        message.channel.send({
            embed
        });
        user.roles.add(role)
        return;
    }
    else{
        let embed = new Discord.MessageEmbed()
        .setDescription(`:ok_hand: Removed the ${role} role from ${user.user.tag}`)
        .setTimestamp()
        .setColor(message.embedColor)
        message.channel.send({
            embed
        });
        user.roles.remove(role)
        return;
    }

}
module.exports.help = {
    name: "role",
    description: "Add or remove a role from a user",
    usage: `role <user/me> <role>`,
    aliases: ["r"],
    category: "administrator",
    args: true
}