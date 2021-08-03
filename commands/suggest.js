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
    Suggestion
} = require("../index") 
module.exports.run = async (client, message, msgargs, command) => {
    Guild.findOne({ guildId: message.guild.id }).then((res) => {
        if(res === null){
            return;
        }
        else{
            let channel = message.guild.channels.cache.find(c => c.name === res.suggestionChannel)
            if(!channel){
                let embed = new Discord.MessageEmbed()
                .setDescription(`:warning: Suggestion channel not set up, contact an admin`)
                .setColor(message.embedColor)
                .setTimestamp()
                message.channel.send(embed)
                return;
            }
            else{
                Suggestion.find({ guildId: message.guild.id }, {suggestionNumber:1}).sort({suggestionNumber:-1}).limit(1).then(result => {
                  
                    if(result.length !== 0){
                        console.log(result)
                        let embed = new Discord.MessageEmbed()
                        .setColor(message.embedColor)
                        .setDescription(`:ok_hand: Submitted your suggestion in ${channel}`)
                        .setTimestamp()
                        message.channel.send(embed)
                        let suggestEmbed = new Discord.MessageEmbed()
                        .setAuthor(`${message.author.tag}'s suggestion`, message.author.displayAvatarURL({
                            dynamic: true
                        }))
                        .setDescription(`${msgargs.join(" ")}`)
                        .setFooter(`Suggestion #${result[0].suggestionNumber+1} | ${message.guild.name}`)
                        .setColor(message.embedColor)
                        .setTimestamp()
                        channel.send(suggestEmbed).then(async (msg) => {
                            let suggestion = new Suggestion({
                                discordId: message.author.id, 
                                suggestionNumber:result[0].suggestionNumber+1,
                                guildId:message.guild.id,
                                suggestionContent: msgargs.join(" "),
                                messageId: msg.id
                            })
                            console.log(suggestion.suggestionNumber)
                            suggestion.save()
                            await msg.react("👍")
                            await msg.react("👎")
                        })
                    }
                    else{
                        console.log(result)
                        let embed = new Discord.MessageEmbed()
                        .setColor(message.embedColor)
                        .setDescription(`:ok_hand: Submitted your suggestion in ${channel}`)
                        .setTimestamp()
                        message.channel.send(embed)
                        let suggestEmbed = new Discord.MessageEmbed()
                        .setAuthor(`${message.author.tag}'s suggestion`, message.author.displayAvatarURL({
                            dynamic: true
                        }))
                        .setDescription(`${msgargs.join(" ")}`)
                        .setFooter(`Suggestion #1 | ${message.guild.name}`)
                        .setTimestamp()
                        channel.send(suggestEmbed).then((msg) =>  {
                            let suggestion = new Suggestion({
                                discordId: message.author.id, 
                                suggestionNumber:1,
                                guildId:message.guild.id,
                                suggestionContent: msgargs.join(" "),
                                messageId: msg.id
                            })
                            console.log(suggestion.suggestionNumber)
                            suggestion.save()
                        })

                    }
                })
               
            }
        }
    })

}
module.exports.help = {
    name: "suggest",
    description: "Make a suggestion",
    usage: `suggest <suggestion>`,
    aliases: ["suggestion"],
    category: "general",
    args: true
}