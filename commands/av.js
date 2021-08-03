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
    const user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", "")) || message.author
    if (!user) {
        let embed = new Discord.MessageEmbed().setDescription(':warning: Invalid User')
        message.channel.send(embed)
        return;
    }
    if(!user.user){
        const avatarEmbed = new Discord.MessageEmbed().setAuthor(`${user.username}'s Avatar`).setImage(user.displayAvatarURL({
            dynamic: true,
            size: 1024
        }))
        .setColor(message.embedColor)
        .setTimestamp()
        message.channel.send(avatarEmbed);
    }
    else{
        const avatarEmbed = new Discord.MessageEmbed().setAuthor(`${user.user.username}'s Avatar`).setImage(user.user.displayAvatarURL({
            dynamic: true,
            size: 1024
        }))
        .setColor(message.embedColor)
        .setTimestamp()
        message.channel.send(avatarEmbed);
    }

}
module.exports.help = {
    name: "av",
    description: "Gets your or another users avatar",
    usage: `av [discord id, discord tag, or ping]`,
    aliases: ["avatar"],
    category: "general",
    args: false
}