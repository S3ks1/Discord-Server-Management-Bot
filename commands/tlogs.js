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
    Ticket.findOne({ ticketNumber: msgargs[0] }).then((res) => {
        if(res === null){
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setDescription(":warning: Invalid Ticket Number provided")
            .setColor(message.embedColor)
            message.channel.send(embed)
            return;
        }
        else{
            if(res.ticketOpen === true){
                let embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setDescription(":warning: This ticket is still open, you can't view the log")
                .setColor(message.embedColor)
                message.channel.send(embed)
                return;
            }
            else if(message.channel.type !== "dm"){
                if(res.discordId !== message.author.id && !message.member.roles.cache.some(r => r.name === client[message.guild.id].settings.supportRole)){
                    let embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setDescription(":warning: You don't have permission to view this ticket's logs")
                    .setColor(message.embedColor)
                    message.channel.send(embed)
                    return;
                }
                else if(message.member.roles.cache.some(r => r.name === client[message.guild.id].settings.supportRole)){
                    if(fs.existsSync(`./tlogs/${res.ticketName}.txt`)){
                        message.guild.members.cache.get(message.author.id).send({
                            files: [`./tlogs/${res.ticketName}.txt`]
                        }).then((done) => {
                            let embed = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setDescription(":ok_hand: Sending you the log for this ticket...")
                            .setColor(message.embedColor)
                            message.channel.send(embed)
                        }).catch((err) => {
                            let embed = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setDescription(":warning: Please enable DMs and try again")
                            .setColor(message.embedColor)
                            message.channel.send(embed)
                            return;
                        })
                    }
                    else{
                        fs.writeFileSync(`./tlogs/${res.ticketName}.txt`, res.ticketLog.join("\n"))
    
                        message.guild.members.cache.get(message.author.id).send({
                            files: [`./tlogs/${res.ticketName}.txt`]
                        }).then((done) => {
                            let embed = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setDescription(":ok_hand: Sending you the log for this ticket...")
                            .setColor(message.embedColor)
                            message.channel.send(embed)
                        }).catch((err) => {
                            let embed = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setDescription(":warning: Please enable DMs and try again")
                            .setColor(message.embedColor)
                            message.channel.send(embed)
                            return;
                        })
                    }

                }
                else{
                    if(fs.existsSync(`./tlogs/${res.ticketName}.txt`)){
                        message.guild.members.cache.get(message.author.id).send({
                            files: [`./tlogs/${res.ticketName}.txt`]
                        }).then((done) => {
                            let embed = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setDescription(":ok_hand: Sending you the log for this ticket...")
                            .setColor(message.embedColor)
                            message.channel.send(embed)
                        }).catch((err) => {
                            let embed = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setDescription(":warning: Please enable DMs and try again")
                            .setColor(message.embedColor)
                            message.channel.send(embed)
                            return;
                        })
                    }
                    else{
                        fs.writeFileSync(`./tlogs/${res.ticketName}.txt`, res.ticketLog.join("\n"))
    
                        message.guild.members.cache.get(message.author.id).send({
                            files: [`./tlogs/${res.ticketName}.txt`]
                        }).then((done) => {
                            let embed = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setDescription(":ok_hand: Sending you the log for this ticket...")
                            .setColor(message.embedColor)
                            message.channel.send(embed)
                        }).catch((err) => {
                            let embed = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setDescription(":warning: Please enable DMs and try again")
                            .setColor(message.embedColor)
                            message.channel.send(embed)
                            return;
                        })
                    }

                }
            }
            else{
                if(res.discordId !== message.author.id){
                    let embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setDescription(":warning: You don't have permission to view this ticket's logs")
                    .setColor(message.embedColor)
                    message.channel.send(embed)
                    return;
                }
                else{
                    if(fs.existsSync(`./tlogs/${res.ticketName}.txt`)){
                        client.users.cache.get(message.author.id).send({
                            files: [`./tlogs/${res.ticketName}.txt`]
                        })
                    }
                    else{
                        fs.writeFileSync(`./tlogs/${res.ticketName}.txt`, res.ticketLog.join("\n"))
    
                        client.users.cache.get(message.author.id).send({
                            files: [`./tlogs/${res.ticketName}.txt`]
                        })
                    }

                }
            }
            
        }
    })

}
module.exports.help = {
    name: "tlogs",
    usage: `tlogs <ticket number>`,
    description: "Fetch ticket logs",
    aliases: [],
    category: "tickets",
    args: false
}