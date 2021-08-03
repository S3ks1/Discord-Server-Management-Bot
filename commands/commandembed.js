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
    let channel = null;
    if(!isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", ""))){
        channel = msgargs[0].replace("<", "").replace(">", "").replace("#", "")
    }
    else{
        channel =  message.guild.channels.cache.find(channel => channel.id === msgargs[0]) || !isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", "")) || message.guild.channels.cache.find(channel => channel.name === msgargs.join(" ").split(" | ")[0].split(" ").join("-")).id || msgargs[0]
    }
    if(channel == null){
        let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setDescription(":warning: Invalid Channel")
        .setColor(message.embedColor)
        message.channel.send(embed)
        return;
    }
    else{
        let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(message.embedColor)
        .setDescription(`**__Commands__**

        **Tickets**
        Create a ticket in #create-ticket by reacting to the emoji that corresponds to the category of your ticket.
        
        **Linking** 
        To link your account and receive a free rank, run \`/link\` ingame and enter \`.link <code>\` in this channel.`)
        .setThumbnail(message.guild.iconURL({
            dynamic: true,
            height: 64,
            width: 64
        }))
        client.channels.cache.get(channel).send(embed)
    }

}
module.exports.help = {
    name: "commandembed",
    description: "Send command embed",
    usage: `commandembed <channel>`,
    aliases: ["cmdembed"],
    category: "administrator",
    args: false
}