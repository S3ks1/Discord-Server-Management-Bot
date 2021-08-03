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
    let user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs[0]) || message.guild.members.cache.find(member => member.user.username === msgargs[0])
    if (!user) {
        let embed = new Discord.MessageEmbed().setDescription(':warning: Invalid User').setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
        return;
    }
    if(!msgargs[1]){
        let embed = new Discord.MessageEmbed().setDescription(':warning: No faction provided').setColor(message.embedColor).setTimestamp()
        message.channel.send(embed)
        return;
    }
    else{
            let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Set ${user} as the leader of ${msgargs[1]}`).setColor(message.embedColor).setTimestamp()
            message.channel.send(embed)
            user.roles.add(message.guild.roles.cache.find(r=> r.name === client[message.guild.id].settings.factionLeaderRole)).catch((err) => {
                console.log(err)
            })
            user.setNickname(`${msgargs[1]} | ${user.user.username}`)
    }

}
module.exports.help = {
    name: "fleader",
    description: "Set a user as a faction leader!",
    usage: `fleader <user> <faction>`,
    aliases: ["facleader"],
    category: "moderation",
    args: true
}


