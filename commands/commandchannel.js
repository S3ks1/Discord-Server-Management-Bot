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
    Commandchannel
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
    Commandchannel.findOne({channelId: channel.id}).then((res) => {
        if(res === null){
            const lol = new Commandchannel({
                channelId: channel
            })
            lol.save()
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setDescription(":ok_hand: Set <#" + channel + "> as a command channel")
            .setColor(message.embedColor)
            message.channel.send(embed)
        }
        else{
            Commandchannel.findOneAndDelete({channelId: channel})
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setDescription(":ok_hand: Unset <#" + channel + "> as a command channel")
            .setColor(message.embedColor)
            message.channel.send(embed)
        }
    })

}
module.exports.help = {
    name: "commandchannel",
    description: "Set or unset a channel as a commandchannel",
    usage: `commandchannel <channel>`,
    aliases: ["cmdchannel"],
    category: "administrator",
    args: true
}