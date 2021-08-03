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
    let user2 = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", ""))
    
    if(!member.voice.channel){
        const embed = new Discord.MessageEmbed().setDescription(`:warning: You are not in a voice channel`).setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
    }
    else if(member.voice.channel.name.indexOf(member.user.username) !== -1){
        if(!user2){
            const embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid user provided`).setColor(message.embedColor).setTimestamp()
            message.channel.send(embed)
        }
        else{
            const embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Added this user to your voice channel`).setColor(message.embedColor).setTimestamp()
            message.channel.send(embed)
            member.voice.channel.updateOverwrite(user2, {
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                USE_VAD: true,
                STREAM: true
            });
        }
    }
    else{
        const embed = new Discord.MessageEmbed().setDescription(`:warning: You can't add users to this channel`).setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
    }

}
module.exports.help = {
    name: "voiceallow",
    usage: `voiceallow <user>`,
    description: "Allow a user to join your private voice channel",
    aliases: ["vallow"],
    category: "general",
    args: true
}