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
    if (!msgargs[0]) {}
    let member = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", ""))
    if (!member) {
        let embed = new Discord.MessageEmbed().setFooter(config.footerText, config.footerImageLink).setDescription(`:warning: Invalid User`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
    }
    if (!member.bannable) {
        let embed = new Discord.MessageEmbed().setFooter(config.footerText, config.footerImageLink).setDescription(`:warning: Can't kick this user, either I do not have permission or they have a higher role.`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(member.roles.highest.position >= message.guild.members.cache.get(message.author.id).roles.highest.position){
        let embed = new Discord.MessageEmbed().setFooter(config.footerText, config.footerImageLink).setDescription(`:warning: You can't kick this user, they have a role equal or higher than your highest role`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    let reason = msgargs.slice(1).join(' ');
    if (!reason) reason = "No reason specified";
    let embed2 = new Discord.MessageEmbed().setDescription(`:boot: Kicked **${member.user.tag}**`).setTimestamp().setColor(message.embedColor)
    message.channel.send(embed2)
    setTimeout(() => {
        try {
            member.kick({
                reason: reason
            });
        } catch (e) {
            console.log(e)
        }
    }, 500);
}
module.exports.help = {
    name: "kick",
    description: "Kick a user from the guild",
    usage: `kick <discord id, discord tag, or ping>`,
    aliases: [],
    category: "moderation",
    args: true
}