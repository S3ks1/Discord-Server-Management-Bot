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
    const user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", ""))
    if(!user) {
        let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setDescription(":warning: Invalid User provided")
        .setColor(message.embedColor)
        message.channel.send(embed)
        return;
    }
    Ticket.findOne({ discordId: user.id, ticketOpen: true }).then((res) => {
        if(res === null){
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setDescription(":warning: Provided user does not have any open tickets")
            .setColor(message.embedColor)
            message.channel.send(embed)
            return;
        }
        else{
            res.ticketOpen = false
            res.save()
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setDescription(`:ok_hand: Cleared ticket data for ${user}`)
            .setColor(message.embedColor)
            message.channel.send(embed)
            return;
        }
    })

}
module.exports.help = {
    name: "twipe",
    usage: `twipe <user>`,
    description: "Reset a user's ticket data",
    aliases: ["wipe"],
    category: "moderation",
    args: true
}