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
    Ticket.findOne({ channelId: message.channel.id }).then((res) => {
        if(res === null){
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setDescription(":warning: Invalid Ticket")
            .setColor(message.embedColor)
            message.channel.send(embed)
            return;
        }
        else{
            let user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", ""))
            if(!user) {
                let embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setDescription(":warning: Invalid User")
                .setColor(message.embedColor)
                message.channel.send(embed)
                return;
            }
            else if(message.channel.permissionsFor(user).has('VIEW_CHANNEL')){
                let embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setDescription(":warning: Provided user can already see this ticket")
                .setColor(message.embedColor)
                message.channel.send(embed)
                return;
            }
            else{
                message.channel.updateOverwrite(user, {
                    VIEW_CHANNEL: true,
                    ATTACH_FILES: true
                });
                let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Added ${user.user.tag} to <#${message.channel.id}>`).setTimestamp().setColor(message.embedColor)
                message.channel.send(embed)
            }

        }
    })

}
module.exports.help = {
    name: "tadd",
    usage: `tadd <user>`,
    description: "Add a user to the current ticket",
    aliases: ["add"],
    category: "tickets",
    args: true
}