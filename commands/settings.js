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
    Guild.findOne({ guildId: message.guild.id}).then((res) => {
        if(!msgargs[0]){
            let mapped = []
            Object.keys(res._doc).forEach(k=> {
                mapped.push(`${k} : ${res._doc[k]}`)
            })
            let embed = new Discord.MessageEmbed()
            .setTitle(`Settings for ${message.guild.name}`)
            .setDescription(`\`\`\`${mapped.join("\n")}\`\`\``)
            .setTimestamp()
            .setColor(message.embedColor)
            message.channel.send(embed)
        }
        else if(Object.keys(res._doc).indexOf(msgargs[0]) !== -1){
            //message.channel.send(`*saving* ${msgargs[1]}`)
            res._doc[msgargs[0]] = msgargs.slice(1).join(" ")

            Guild.updateOne({ guildId: message.guild.id }, 
                res._doc
            ).then((xd) => {})

            let embed = new Discord.MessageEmbed()
            .setDescription(`:ok_hand: Saved ${msgargs.slice(1).join(" ")} as a new value for ${msgargs[0]}`)
            .setColor(message.embedColor)
            .setTimestamp()
            message.channel.send(embed)
            return;
        }
        else{
            let embed = new Discord.MessageEmbed()
            .setDescription(`:warning: Invalid key ${msgargs[0]} provided`)
            .setColor(message.embedColor)
            .setTimestamp()
            message.channel.send(embed)
            return;
        }
    }).catch((err) => {
        console.log(err)
    })
}
module.exports.help = {
    name: "settings",
    usage: `settings <key> <value>`,
    description: "Change guild specific settings",
    aliases: ["set"],
    category: "administrator",
    args: false
}