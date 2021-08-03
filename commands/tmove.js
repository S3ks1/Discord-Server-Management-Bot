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
            let parent = client.channels.cache.find(channel => channel.name.toLowerCase() === msgargs.join(" ").toLowerCase() && channel.type == "category") || client.channels.cache.find(channel => channel.id === msgargs[0] && channel.type === "category")
            if (!parent) {
                let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid category provided`).setColor(message.embedColor).setTimestamp()
                return message.channel.send(embed)
            } 
            else if(parent.id === message.channel.parent.id){
                let embed = new Discord.MessageEmbed().setDescription(`:warning: Ticket is already in this category`).setColor(message.embedColor).setTimestamp()
                return message.channel.send(embed)
            }
            else{
                let overwrites = message.channel.permissionOverwrites
                message.channel.setParent(parent.id)
                message.channel.overwritePermissions(overwrites)
                let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Moved <#${message.channel.id}> to the ${parent.name} category!`).setTimestamp().setColor(message.embedColor)
                message.channel.send(embed)
            }

        }
    })

}
module.exports.help = {
    name: "tmove",
    usage: `tmove <category>`,
    description: "Move a ticket to a different category",
    aliases: ["move", "category", "tcategory", "parent"],
    category: "tickets",
    args: true
}