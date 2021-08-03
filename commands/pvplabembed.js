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
    Perms,
    TicketEmbed
} = require("../index") 
module.exports.run = async (client, message, msgargs, command) => {
    var i
    var channel

    if(!isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", ""))){
        channel = msgargs[0].replace("<", "").replace(">", "").replace("#", "")
    }
    else{
        channel =  message.guild.channels.cache.find(channel => channel.id === msgargs[0]) || !isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", "")) || message.guild.channels.cache.find(channel => channel.name === msgargs.join(" ").split(" | ")[0].split(" ").join("-")) || msgargs[0]
    }
    let embed = new Discord.MessageEmbed().setTitle(`Create a Ticket`).setThumbnail(message.guild.iconURL({
        dynamic: true
    }))
    .setColor("#7DF9FF")
    .addField(`<:tnt:844308906352050176> **Factions**`, `Create a Factions ticket to get support for our Factions realms`)
    .addField(`🏝️ **Skyblock**`, `Create a Skyblock ticket to get support for our Skyblock realms`)
    .addField(`⛏️ **Prison**`, `Create a Prison ticket to get support for our Prison realms`)
    .addField(`<:discord:844309684487454741> **Discord**`, `Create a Discord ticket to get support for Discord`)
    .addField(`💰 **Buycraft**`, `Create a Buycraft ticket for any donation related questions or issues`)
    let msgEmbed = await client.channels.cache.get(channel).send(embed)
    await msgEmbed.react(`<:tnt:844308906352050176>`)
    await msgEmbed.react(`🏝️`)
    await msgEmbed.react(`⛏️`)
    await msgEmbed.react(`<:discord:844309684487454741>`)
    await msgEmbed.react(`💰`)
    let names = ["Factions", "Skyblock", "Prison", "Discord", "Buycraft"]
    let reactions = ["tnt", "🏝️", "⛏️", "discord", "💰"]
    const tembed = new TicketEmbed({
        messageId: msgEmbed.id,
        categories: names,
        reactions: reactions
    })
    tembed.save()


    for(i = 0; i < names.length; i++){
        if (!client.channels.cache.some(channel => channel.name === names[i] && channel.type == "category")) {
            message.guild.channels.create(names[i], {
                type: 'category',
                permissionOverwrites: [
                    {
                    id: message.guild.id,
                    deny: ["VIEW_CHANNEL"]
                    }
                ]
            })
        }
    }

}
module.exports.help = {
    name: "pvplabembed",
    description: "Create a ticket embed!",
    usage: `pvplabembed <channel>`,
    aliases: [],
    category: "administrator",
    args: true
}