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
    let member = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", "")) || msgargs[0]
    if (!member) {
        let embed = new Discord.MessageEmbed().setDescription(`:warning: Mention a valid user`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
    }

        if(!member.bannable){
            let embed = new Discord.MessageEmbed().setDescription(`:warning: I can't ban this user, either I do not have permission or they have a higher role.`).setColor(message.embedColor).setTimestamp()
            message.channel.send({
                embed
            });
            return;
        }
        if(member.roles.highest.position >= message.guild.members.cache.get(message.author.id).roles.highest.position){
            console.log("nigga2")
            let embed = new Discord.MessageEmbed().setDescription(`:warning: You can't kick this user, they have a role equal or higher than your highest role`).setColor(message.embedColor).set.Timestamp()
            message.channel.send({
                embed
            });
            return;
        }

   
 
    let reason = msgargs.slice(1).join(' ');
    if (!reason) reason = "No reason specified";
    let embed2 = new Discord.MessageEmbed().setDescription(`:hammer: Banned **${member ? member : "None"}**`).setColor(message.embedColor).setTimestamp()
    message.channel.send(embed2)
    setTimeout(() => {
        try {
            message.guild.members.ban(member);
        } catch (e) {
            console.log(e)
        }
    }, 500);
}
module.exports.help = {
    name: "ban",
    description: "Ban a user from the guild",
    usage: `ban <discord id, discord tag, or ping>`,
    aliases: [],
    category: "moderation",
    args: true
}