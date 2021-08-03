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
    let user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", ""))

    
    if(!msgargs[0]){
        user = message.author
        let member = message.guild.member(user)
            member.setNickname(null).then((done) => {
                let embed = new Discord.MessageEmbed()
                .setColor(message.embedColor)
                .setDescription(`:ok_hand: Reset your nickname`)
                .setTimestamp()
                message.channel.send(embed)
                return;
            }).catch(err => {
                let embed = new Discord.MessageEmbed()
                .setColor(message.embedColor)
                .setDescription(`:warning: ${err}`)
                .setTimestamp()
                message.channel.send(embed)
                return;
            })
    }
    else{
        if(msgargs[0].toLowerCase() === "me"){
            user = message.author
            let member = message.guild.member(user)
                member.setNickname(msgargs.slice(1).join(" ")).then((done) => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(message.embedColor)
                    .setDescription(`:ok_hand: Set your nickname to ${msgargs.slice(1).join(" ")}`)
                    .setTimestamp()
                    message.channel.send(embed)
                    return;
                }).catch(err => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(message.embedColor)
                    .setDescription(`:warning: ${err}`)
                    .setTimestamp()
                    message.channel.send(embed)
                    return;
                })
        }
        else{
            let member = message.guild.member(user)
            if(!msgargs[1]){
                member.setNickname(null).then((done) => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(message.embedColor)
                    .setDescription(`:ok_hand: Reset ${user}'s nickname`)
                    .setTimestamp()
                    message.channel.send(embed)
                    return;
                }).catch(err => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(message.embedColor)
                    .setDescription(`:warning: ${err}`)
                    .setTimestamp()
                    message.channel.send(embed)
                    return;
                })
            }
            else{
                member.setNickname(msgargs.slice(1).join(" ")).then((done) => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(message.embedColor)
                    .setDescription(`:ok_hand: Set ${user}'s nickname to ${msgargs.slice(1).join(" ")}`)
                    .setTimestamp()
                    message.channel.send(embed)
                    return;
                }).catch(err => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(message.embedColor)
                    .setDescription(`:warning: ${err}`)
                    .setTimestamp()
                    message.channel.send(embed)
                    return;
                })
            }
        }


    }


}
module.exports.help = {
    name: "nick",
    description: "Change your or another user's nickname",
    usage: `nick [user/me] <nickname>`,
    aliases: [],
    category: "moderation",
    args: false
}