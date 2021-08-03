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
    Ticket.findOne({ channelId: message.channel.id }).then((res) => {
        if(res === null){
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setDescription(":warning: Invalid Ticket")
            .setColor(message.embedColor)
            message.channel.send(embed)
            return;
        }
        else{
            if(res.ticketOpen == true){
                message.channel.messages.fetch().then(async messages => {
                    let closedticket = [];
                    const putInArray = async (data) => closedticket.push(data);
                    const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a")
                    for (const message of messages.array().reverse()) await putInArray(`${handleTime(message.createdTimestamp)} ${message.author.username} : ${message.content}`);
                    let reason = "None provided"
                    if (msgargs.length > 0) {
                        reason = msgargs.join(" ")
                    }
                    let closeEmbed = new Discord.MessageEmbed().setDescription(":ok_hand: Closing the ticket in 3 seconds!").setTimestamp().setColor(message.embedColor)
                    message.channel.send(closeEmbed)

                    setTimeout(() => {
                        console.log(closedticket)
                        res.ticketOpen = false
                        res.ticketLog = closedticket
                        fs.writeFileSync(`./tlogs/${res.ticketName}.txt`, closedticket.join("\n"))
                        res.save()
                        message.channel.delete()
                        User.findOne({ discordId: message.author.id }).then((result) => {
                            if(result === null){
                                return;
                            }
                            else{
				let gay = 0
                                result.tStats.forEach(t=> {
                                    if(t.guildId === message.guild.id){
                                        t.ticketsClosed++
                                        result.save()
					gay=1
                                    }
                                })
				if(gay === 0){
					result.tStats[0] = {
					ticketsOpened:0,
					ticketsClosed:1,
					guildId:message.guild.id
					}
					result.save()
				}

                            }
                        })
                        let embed = new Discord.MessageEmbed()
                        .setTitle("Ticket closed!")
                        .setThumbnail(message.guild.iconURL({
                            dynamic: true,
                            height: 64,
                            width: 64
                        }))
                        .setDescription(`**Ticket Number**: ${message.channel.name}\n**Ticket ID**: ${message.channel.id}\n**Time Open**: ${ms(message.createdTimestamp-message.channel.createdTimestamp)}\n**Opened By**: ${res.discordTag}\n**Closed By**: ${message.author.tag}\n**Reason**: ${reason}\n\`\`\`${closedticket.splice(closedticket.length-5,closedticket.length).join("\n")}\`\`\``)
                        .setColor(message.embedColor)
                        .setTimestamp()
                        let channel = message.guild.channels.cache.find(c => c.name === client[message.guild.id].settings.ticketLogChannel)
                        if(channel){   
                            channel.send(embed)
                        }
                        let user = client.users.cache.get(res.discordId)
                        if(user){
                            user.send(embed).catch((err) => {
                                //Could not send messages to this user
                            })

                            user.send({
                                files: [`./tlogs/${res.ticketName}.txt`]
                            })
                        }
                    }, 3000)

                });
    
            }
            else{
                let embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setDescription(":warning: Not sure how you fucked this up, check console or dm me")
                .setColor(message.embedColor)
                message.channel.send(embed)
                return;
            }
        }
    })

/*
    setTimeout(() => {
        message.channel.delete()
        let user = getUser.get(message.author.id)
        user.ticketsclosed++
        updateClosed.run(user.ticketsclosed,message.author.id)
        removeTicket.run(message.channel.id)
    }, 3000)
    */
}
module.exports.help = {
    name: "close",
    usage: `close [reason]`,
    description: "Closes a ticket",
    aliases: [],
    category: "tickets",
    args: false
}
