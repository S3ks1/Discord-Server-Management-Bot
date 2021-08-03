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
    const user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", "")) || message.author
    User.findOne({ discordId: user.id }).then((result) => {
        if(result === null){
            let embed = new Discord.MessageEmbed()
            .setDescription(`:warning: User did not exist in the ticket database`)
            .setColor(message.embedColor)
            .setTimestamp()
            message.channel.send(embed)
            return;
        }
        else{
            if(result.tStats.length == 0){
                let embed = new Discord.MessageEmbed()
                .setDescription(`:warning: User did not exist in the ticket database`)
                .setColor(message.embedColor)
                .setTimestamp()
                message.channel.send(embed)
                return;
            }
            else{
                result.tStats.forEach(t=> {
                    if(t.guildId == message.guild.id){
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`${user.tag !== undefined ? user.tag : user.user.tag}'s Ticket Statistics`)
                        .addField(`Tickets Opened`, t.ticketsOpened, true)
                        .addField(`Tickets Closed`, t.ticketsClosed, true)
                        .setColor(message.embedColor)
                        .setTimestamp()
                        message.channel.send(embed)
                    }
                })
            }
        }
    })
    

}
module.exports.help = {
    name: "tstats",
    description: "Get your or another user's ticket stats",
    usage: `tstats [user]`,
    aliases: ["ticketstats"],
    category: "general",
    args: false
}
