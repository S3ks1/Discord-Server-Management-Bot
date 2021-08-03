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

module.exports.run = async (client, message, msgargs, bot) => {
    const user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.author
    const member = message.guild.member(user);
    User.findOne({discordId:user.id}).then((res) => {
        let whoisembed = new Discord.MessageEmbed()
        .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic : true}))
        .setThumbnail(user.avatarURL)
        .setDescription(`**Discord Tag:** ${member.user.tag}(${member})\n**Discord ID:** ${member.id}\n**Nickname:** ${member.nickname !== null ? `${member.nickname}` : 'None'}\n**Account Creation Date:** ${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY")}\n**Join Date:** ${moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY")}\n**Bot:** ${member.user.bot}\n**Custom Status:** ${member.presence.activities !== null ? "None" : member.presence.activities[0].state !== null ? member.presence.activities[0].state : "None"}\n**Status:** ${member.presence.status == "online" ? `${client.emojis.cache.find(emoji => emoji.name === "online")}` : member.presence.status == "idle" ? `${client.emojis.cache.find(emoji => emoji.name === "idle")}` : member.presence.status == "dnd" ? `${client.emojis.cache.find(emoji => emoji.name === "dnd")}` : `${client.emojis.cache.find(emoji => emoji.name === "offline")}`}\n**Game:** ${member.presence.activities !== null ? "None" : member.presence.activities[0].details ? member.presence.activities[0].name : member.presence.activities[1].details ? member.presence.activities[1].name :'None'}\n**Highest Role:** ${member.roles.highest}\n**Roles:** ${member.roles.cache.map(roles => `${roles}`).join(', ')}\n**Time in VC:** ${res !== undefined ? ms(res.vcTime, {long:true}) : "None"}`)
        .setColor(message.embedColor)
        .setTimestamp()
        message.channel.send(whoisembed)
    })

}
//${member.presence.status == "Online" ? `:white_check_mark:` : member.presence.status == "Away" ? ":warning:" : ":x:"}


module.exports.help = {
    name: "whois",
    usage: `${config.prefix}whois <user>`,
    description: "View user data",
    aliases: [],
    category: "general",
    args: false
}