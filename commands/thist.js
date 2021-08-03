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
    if(!user){
        let embed = new Discord.MessageEmbed()
        .setColor(message.embedColor)
        .setTimestamp()
        .setDescription(`:warning: Invalid User Provided`)
        message.channel.send(embed)
        return;
    }
    else{
        //console.log(user.id)
        Ticket.find({discordId:`${user.id}`}).then((ticketz) => {
            let tickets = ticketz
            if(tickets.length === 0 || tickets == undefined || tickets == null ){
                let embed = new Discord.MessageEmbed()
                .setColor(message.embedColor)
                .setTimestamp()
                .setDescription(`:warning: Provided user has no tickets created!`)
                message.channel.send(embed)
                return;
            }
            else{
               
                tickets.map(t=> t.ticketNumber)
                console.log(tickets)
                //console.log(tickets)
                let embed = new Discord.MessageEmbed()
                .setTitle(`${user.user.tag}'s Ticket History`)
                .setTimestamp()
                .setDescription(tickets.join("\n"))
                .setColor(message.embedColor)
                message.channel.send(embed)
                return;
            }   
        })
 
    }
}
module.exports.help = {
    name: "thist",
    usage: `thist <user>`,
    description: "Fetch all tickets that a user has created",
    aliases: ["tickethistory"],
    category: "tickets",
    args: true
}