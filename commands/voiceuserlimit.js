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
    const user = message.author
    const member = message.guild.member(user)
    
    
    if(!member.voice.channel){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: You are not in a voice channel`).setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
    }
    else if(member.voice.channel.name.indexOf(member.user.username) !== -1){
        if(parseInt(msgargs[0]) < 100 && parseInt(msgargs[0]) > 0){
            member.voice.channel.setUserLimit(parseInt(msgargs[0]))
            let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Set your voice channel's user limit to ${parseInt(msgargs[0])}`).setColor(message.embedColor).setTimestamp()
            message.channel.send(embed)
        }
        else{
            let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid number provided`).setColor(message.embedColor).setTimestamp()
            message.channel.send(embed)
        }
    }
    else{
        let embed = new Discord.MessageEmbed().setDescription(`:warning: You can't change the user limit for this channel`).setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
    }

}
module.exports.help = {
    name: "voiceuserlimit",
    usage: `voiceuserlimit <number>`,
    description: "Increase or decrease the number of users that can connect to your private voice channel",
    aliases: ["vlimit"],
    category: "general",
    args: true
}