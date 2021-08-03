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
    let user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[1]) || message.guild.members.cache.find(member => member.user.tag === msgargs.slice(1).join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.slice(1).join(" ").replace("\n", ""))

    if(!user){

    }
    else{
        let channel = message.guild.channels.cache.find(c => c.name === "factions-playing") ||  message.guild.channels.cache.find(c => c.name === "fplaying") || message.guild.channels.cache.find(c => c.name.substr(c.name.length-5, c.name.length) === "aying")
        if(!channel){
            let embed = new Discord.MessageEmbed()
            .setColor(message.embedColor)
            .setDescription(`:warning: Factions playing channel not set up properly DM dev or admin to fix`)
            .setTimestamp()
            message.channel.send(embed)
        }
        else{
            let embed = new Discord.MessageEmbed()
            .setColor(message.embedColor)
            .setTimestamp()
            .setDescription(`:ok_hand: Added ${msgargs[0]} to the factions playing with a leader of ${user}`)
            message.channel.send(embed)
            let embed2= new Discord.MessageEmbed()
            .setColor(message.embedColor)
            .setDescription(`**New faction signed up!**\n**Leader:** ${user}\n**Faction:** ${msgargs[0]}`)
            .setTimestamp()
            .setFooter(`${message.guild.name}`)
            .setThumbnail(message.guild.iconURL({
                dynamic: true
            }))
            channel.send(embed2)
        }

        
    }

   
    
}
module.exports.help = {
    name: "fplaying",
    description: "Add or remove a faction from the f playing list",
    usage: `fplaying <faction> <user>`,
    aliases: [],
    category: "moderation",
    args: true
}