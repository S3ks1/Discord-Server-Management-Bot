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
    let user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs[0]) || message.guild.members.cache.find(member => member.user.username === msgargs[0])
    if (!user){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid User`).setFooter(config.footerText, config.footerImageLink).setColor(message.embedColor)
        return message.channel.send(embed)
    }
    let muterole = message.guild.roles.cache.find(muterole => muterole.name === "Muted");
    if(!muterole){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: No Muted role set up`).setFooter(config.footerText, config.footerImageLink).setColor(message.embedColor)
        return message.channel.send(embed)
    }
    await (user.roles.remove(muterole.id));
    User.findOne({discordId: user.id}).then((res) => {
        res.muted = false
        res.save()
    })
    let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Unmuted ${user}`).setTimestamp().setColor(message.embedColor)
    let embed2 = new Discord.MessageEmbed().setTitle(`You have been unmuted in ${message.guild.name}!`).addField(`Moderator`, `${message.author.tag}`).setTimestamp().setColor("GREEN")
    user.send(embed2)
    return message.channel.send(embed)
}
module.exports.help = {
    name: "unmute",
    usage: `unmute <discord id, discord tag, or ping>`,
    description: "Unmute someone",
    aliases: [],
    category: "moderation",
    args: true
}