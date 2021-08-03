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
            try {
                message.channel.setName(`${res.ticketName}-${msgargs.join("-")}`)
                let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Renamed this ticket to #${res.ticketName}-${msgargs.join("-")}`).setTimestamp().setColor(message.embedColor)
                return message.channel.send(embed)
            } catch (e) {
                let embed = new Discord.MessageEmbed().setDescription(`:warning: Unexpected error\n${e}`).setTimestamp().setColor(message.embedColor)
                message.channel.send(embed)
            }

        }
    })

}
module.exports.help = {
    name: "trename",
    usage: `trename <name>`,
    description: "Remove the current ticket",
    aliases: ["rename"],
    category: "tickets",
    args: true
}