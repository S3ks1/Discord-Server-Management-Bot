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

                Suggestion.findOne({
                    $or: [ { messageId: msgargs[0] }, { suggestionNumber: msgargs[0]} ]
                }).then(result => {
                    if(result === null){
                        let embed = new Discord.MessageEmbed()
                        .setColor(message.embedColor)
                        .setDescription(`:warning: Invalid suggestion provided`)
                        .setTimestamp()
                        message.channel.send(embed)
                        return;
                    }
                    else{
                        let channel = message.guild.channels.cache.find(c => c.name === res.deniedChannel)
                        if(!channel){
                            let embed = new Discord.MessageEmbed()
                            .setDescription(`:warning: denied-suggestions channel not set up, contact an admin`)
                            .setColor(message.embedColor)
                            .setTimestamp()
                            message.channel.send(embed)
                            return;
                        }
                        else{
                            let user = message.guild.members.fetch(result.discordId).then(user => {
                                console.log(result.discordId)
                                if(!user){
                                    let embed = new Discord.MessageEmbed()
                                    .setDescription(`:warning: Could not deny this suggestion as the user left the discord`)
                                    .setColor(message.embedColor)
                                    .setTimestamp()
                                    message.channel.send(embed)
                                    return;
                                }else{
                                    console.log(user)
                                    let pending = message.guild.channels.cache.find(c => c.name === res.suggestionChannel)
                                    let embed = new Discord.MessageEmbed()
                                    .setTitle(`${message.guild.name} | Denied Suggestion(#${result.suggestionNumber})`)
                                    .setDescription(`**Suggestion Author:** ${user.user.username}#${user.user.discriminator}\n**Suggestion Number:** ${result.suggestionNumber}\n**Suggestion Content:** ${result.suggestionContent}\n**Denied By:** ${message.author.tag}\n**Reason:** ${msgargs.slice(1).length === 0 ? "None" : msgargs.slice(1).join(" ")}`)
                                    .setColor("#FF0000")
                                    .setFooter(`Denied | Suggestion #${result.suggestionNumber}`)
                                    .setTimestamp()
                                    channel.send(embed)
                                    let userEmbed = new Discord.MessageEmbed()
                                    .setTitle(`Your suggestion in ${message.guild.name} was denied!`)
                                    .setDescription(`**Suggestion Number:** ${result.suggestionNumber}\n**Suggestion Content:** ${result.suggestionContent}\n**Denied By:** ${message.author.tag}\n**Reason:** ${msgargs.slice(1).length === 0 ? "None" : msgargs.slice(1).join(" ")}`)
                                    .setColor("#FF0000")
                                    .setFooter(`Denied | Suggestion #${result.suggestionNumber}`)
                                    .setTimestamp()
                                    user.send(userEmbed).catch((err) => {
                                        console.log(err)
                                    })
                                    pending.messages.fetch(result.messageId).then((msg) => {
                                        msg.delete()
                                    }).catch((err) => console.log(err))
                                }
                            })
 
                            
                        }
                    }
                })
               
            
        }
    })

}
module.exports.help = {
    name: "deny",
    description: "Deny a suggestion",
    usage: `deny <message id/suggestion number>`,
    aliases: ["denysuggestion"],
    category: "general",
    args: true
}