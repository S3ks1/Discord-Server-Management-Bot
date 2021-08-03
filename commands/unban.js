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
    let member = msgargs[0]
    setTimeout(() => {
        try {
            message.guild.members.unban(member).catch((err) => {
                let embed = new Discord.MessageEmbed().setColor(message.embedColor).setDescription(`:warning: Could not unban user \n${err}`).setTimestamp()
                message.channel.send({
                    embed
                });
            }).then((done) => {
                if(!done) return;
                let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Unbanned ${member}`).setColor(message.embedColor).setTimestamp()
                message.channel.send({
                    embed
                });
            })

        } catch (err) {
            let embed = new Discord.MessageEmbed().setColor(message.embedColor).setDescription(`:warning: Could not unban user \n${err}`).setTimestamp()
            message.channel.send({
                embed
            });
        }
    }, 250);
}
module.exports.help = {
    name: "unban",
    description: "Unban a user from the guild.",
    usage: `unban <discord id>`,
    aliases: [],
    category: "moderation",
    args: true
}