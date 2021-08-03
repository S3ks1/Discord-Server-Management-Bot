const mongoose = require("mongoose")
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
    TicketEmbed
} = require("../index")

var opened;
client.on("messageReactionAdd", async (reaction, user) => {
    Guild.findOne({ guildId: reaction.message.guild.id}).then((res) => {
        //console.log("Check for guild")
        if(res === null){}
        else{
            client[reaction.message.guild.id] = {}
            client[reaction.message.guild.id].settings = res
            reaction.settings = client[reaction.message.guild.id].settings
        }
    })
    TicketEmbed.findOne({ messageId: reaction.message.id }).then((res) => {
        //console.log("sadge")
        if(res === null) return;
        if (reaction.message.partial) 
        {
        reaction.message.fetch().then(a => {
            //console.log("got message")
            if (reaction.partial) reaction.fetch().then(a => {
                //console.log("got reaction")
                if (user.bot) return;
                if (!reaction.message.guild) return;
                console.log(reaction.emoji.name)
                if(res.reactions.indexOf(reaction.emoji.name) !== -1){
                    reaction.users.remove(user.id)
                   // console.log("got here")
                   
                    //console.log(tcategory.id)
                    Ticket.find().then(ts => {
                        let nums = []
                        let ids = []
                        ts.forEach(t => {
                            if(t.ticketNumber){
                                nums.push(t.ticketNumber)
                            }
                            if(t.discordId == user.id && t.ticketOpen == true){
                                ids.push(t.discordId)
                            }
                        })
                        if(ids.length !== 0) return;
                        //
                        //console.log(Math.max(...nums)+1)
                        
                        var num = 1
                        if(nums === []){
                            num = 1
                        }else if(nums !== []){
                       if(Math.max(...nums)+1 !== -Infinity){
                        num = Math.max(...nums)+1
                       }
                       
                   }
                   let tcategory = reaction.message.guild.channels.cache.find(c => c.name === res.categories[res.reactions.indexOf(reaction.emoji.name)])
                   reaction.message.guild.channels.create(`ticket-${num}`, {
                       type: 'text',
                       parent:  tcategory.id,
                       permissionOverwrites: [
                           {
                               id: reaction.message.guild.id,
                               deny: ["VIEW_CHANNEL"]
                           },
                           {
                               id: reaction.message.guild.roles.cache.find(r => r.name === `${res.categories[res.reactions.indexOf(reaction.emoji.name)]} Support`).id,
                               allow: ['VIEW_CHANNEL', 'ATTACH_FILES']
                           },
                           {
                               id: user.id,
                               allow: ['VIEW_CHANNEL', 'ATTACH_FILES']
                           }
                       ]
                   }).then(async c => {
                       reaction.message.channel.send(`${client.emojis.cache.find(emoji => emoji.name === "loading")} Created your **${tcategory.name}** ticket ${c}`).then((msg) => {msg.delete({ timeout: 5000 })})
                       const ticket = new Ticket({
                           ticketName: `ticket-${num}`,
                           ticketNumber: num,
                           discordId: user.id,
                           discordTag: reaction.message.guild.members.cache.get(user.id).user.tag,
                           guildId: reaction.message.guild.id,
                           ticketLog:[],
                           ticketOpen: true,
                           channelId: c.id
                       })
  
                      ticket.save()
                       const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a")
                       User.findOne({ discordId: user.id }).then((result) => {
                           if(result === null){
                               if(user.bot) return;
                               const user2 = new User({
                                   discordId: user.id,
                                   profilePoints:[],
                                   tStats:[]
                               })
                               //console.log("user,")
                               result = user2
                               user2.save().then((a) => {
                                   if(result.tStats.length !== 0){
                                       result.tStats.forEach(p=>{
                                           if(p.guildId == reaction.message.guild.id){
                                               opened = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                               let num = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                               if(user.bot) return;
                                               result.tStats[result.tStats.indexOf(p)] = {
                                                   guildId: reaction.message.guild.id,
                                                   ticketsOpened: num+1,
                                                   ticketsClosed: result.tStats[result.tStats.indexOf(p)].ticketsClosed
                                               }
                                               result.save()
                                           }
                                       })
                                   }
                                   else{
                                       opened = 1
                                       User.updateOne({ discordId: user.id }, {
                                           $push: {
                                               tStats: {
                                                   "guildId": reaction.message.guild.id,
                                                   "ticketsOpened" : 1
                                               }
                                           }
                                       }, {  safe: true, upsert: true}  ).then(a =>  {/*console.log(a)*/})
               
                   
                                   }
                               })
                           }
                           else{
                               if(result.tStats.length !== 0){
                                   result.tStats.forEach(p=>{
                                       if(p.guildId == reaction.message.guild.id){
                                           opened = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                           let num = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                           if(user.bot) return;
                                           result.tStats[result.tStats.indexOf(p)] = {
                                               guildId: reaction.message.guild.id,
                                               ticketsOpened: num+1,
                                               ticketsClosed: result.tStats[result.tStats.indexOf(p)].ticketsClosed
                                           }
                                           result.save()
                                       }
                                   })
                               }
                               else{
                                   opened = 1
                                   User.updateOne({ discordId: user.id }, {
                                       $push: {
                                           tStats: {
                                               "guildId": reaction.message.guild.id,
                                               "ticketsOpened" : 1
                                           }
                                       }
                                   }, {  safe: true, upsert: true}  ).then(a =>  {/*console.log(a)*/})
           
               
                               }
                           }
                            norm(reaction, c, user, handleTime, tcategory)

                       
                       })

                       
           
                   })
                    })
                    
                }
            })
        })
    }
    else{
        if (reaction.partial) 
        {reaction.fetch().then(a => {
            //console.log("got reaction")
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if(res.reactions.indexOf(reaction.emoji.name) !== -1){
                reaction.users.remove(user.id)
                //console.log("got here")

                //console.log(tcategory.id)
                Ticket.find().then(ts => {
                    let nums = []
                    let ids = []
                    ts.forEach(t => {
                        if(t.ticketNumber){
                            nums.push(t.ticketNumber)
                        }
                        if(t.discordId == user.id && t.ticketOpen == true){
                            ids.push(t.discordId)
                        }
                    })
                    if(ids.length !== 0) return;
                   // console.log()
                   //
                   //console.log(Math.max(...nums)+1)
                   var num = 1
                   
                   if(nums !== []){
                       if(Math.max(...nums)+1 !== -Infinity){
                        num = Math.max(...nums)+1
                       }
                       
                   }

                   let tcategory = reaction.message.guild.channels.cache.find(c => c.name === res.categories[res.reactions.indexOf(reaction.emoji.name)])
                   reaction.message.guild.channels.create(`ticket-${num}`, {
                       type: 'text',
                       parent:  tcategory.id,
                       permissionOverwrites: [
                           {
                               id: reaction.message.guild.id,
                               deny: ["VIEW_CHANNEL"]
                           },
                           {
                               id: reaction.message.guild.roles.cache.find(r => r.name === `${res.categories[res.reactions.indexOf(reaction.emoji.name)]} Support`).id,
                               allow: ['VIEW_CHANNEL', 'ATTACH_FILES']
                           },
                           {
                               id: user.id,
                               allow: ['VIEW_CHANNEL', 'ATTACH_FILES']
                           }
                       ]
                   }).then(async c => {
                    reaction.message.channel.send(`${client.emojis.cache.find(emoji => emoji.name === "loading")} Created your **${tcategory.name}** ticket ${c}`).then((msg) => {msg.delete({ timeout: 5000 })})
                       const ticket = new Ticket({
                           ticketName: `ticket-${num}`,
                           ticketNumber: num,
                           discordId: user.id,
                           discordTag: reaction.message.guild.members.cache.get(user.id).user.tag,
                           guildId: reaction.message.guild.id,
                           ticketLog:[],
                           ticketOpen: true,
                           channelId: c.id
                       })
  
                      ticket.save()
                       const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a")
                       User.findOne({ discordId: user.id }).then((result) => {
                           if(result === null){
                               if(user.bot) return;
                               const user2 = new User({
                                   discordId: user.id,
                                   profilePoints:[],
                                   tStats:[]
                               })
                               //console.log("user,")
                               result = user2
                               user2.save().then((a) => {
                                   if(result.tStats.length !== 0){
                                       result.tStats.forEach(p=>{
                                           if(p.guildId == reaction.message.guild.id){
                                               opened = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                               let num = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                               if(user.bot) return;
                                               result.tStats[result.tStats.indexOf(p)] = {
                                                   guildId: reaction.message.guild.id,
                                                   ticketsOpened: num+1,
                                                   ticketsClosed: result.tStats[result.tStats.indexOf(p)].ticketsClosed
                                               }
                                               result.save()
                                           }
                                       })
                                   }
                                   else{
                                       opened = 1
                                       User.updateOne({ discordId: user.id }, {
                                           $push: {
                                               tStats: {
                                                   "guildId": reaction.message.guild.id,
                                                   "ticketsOpened" : 1
                                               }
                                           }
                                       }, {  safe: true, upsert: true}  ).then(a =>  {/*console.log(a)*/})
               
                   
                                   }
                               })
                           }
                           else{
                               if(result.tStats.length !== 0){
                                   result.tStats.forEach(p=>{
                                       if(p.guildId == reaction.message.guild.id){
                                           opened = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                           let num = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                           if(user.bot) return;
                                           result.tStats[result.tStats.indexOf(p)] = {
                                               guildId: reaction.message.guild.id,
                                               ticketsOpened: num+1,
                                               ticketsClosed: result.tStats[result.tStats.indexOf(p)].ticketsClosed
                                           }
                                           result.save()
                                       }
                                   })
                               }
                               else{
                                   opened = 1
                                   User.updateOne({ discordId: user.id }, {
                                       $push: {
                                           tStats: {
                                               "guildId": reaction.message.guild.id,
                                               "ticketsOpened" : 1
                                           }
                                       }
                                   }, {  safe: true, upsert: true}  ).then(a =>  {/*console.log(a)*/})
           
               
                               }
                           }
                            norm(reaction, c, user, handleTime, tcategory)
                        
                       })

                       
           
                   })
                })
                
            }
        })
        }
        else{
            //console.log("got reaction")
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if(res.reactions.indexOf(reaction.emoji.name) !== -1){
                reaction.users.remove(user.id)
                //console.log("got here")
                Ticket.find().then(ts => {
                    let nums = []
                    let ids = []
                    ts.forEach(t => {
                        if(t.ticketNumber){
                            nums.push(t.ticketNumber)
                        }
                        if(t.discordId == user.id && t.ticketOpen == true){
                            ids.push(t.discordId)
                        }
                    })
                    if(ids.length !== 0) return;
                    //console.log()
                   //
                    //console.log(Math.max(...nums)+1)
                    var num = 1
                    
                    if(nums !== []){
                        if(Math.max(...nums)+1 !== -Infinity){
                            num = Math.max(...nums)+1
                           }
                    }
                    let tcategory = reaction.message.guild.channels.cache.find(c => c.name === res.categories[res.reactions.indexOf(reaction.emoji.name)])
                    reaction.message.guild.channels.create(`ticket-${num}`, {
                        type: 'text',
                        parent:  tcategory.id,
                        permissionOverwrites: [
                            {
                                id: reaction.message.guild.id,
                                deny: ["VIEW_CHANNEL"]
                            },
                            {
                                id: reaction.message.guild.roles.cache.find(r => r.name === `${res.categories[res.reactions.indexOf(reaction.emoji.name)]} Support`).id,
                                allow: ['VIEW_CHANNEL', 'ATTACH_FILES']
                            },
                            {
                                id: user.id,
                                allow: ['VIEW_CHANNEL', 'ATTACH_FILES']
                            }
                        ]
                    }).then(async c => {
                        reaction.message.channel.send(`${client.emojis.cache.find(emoji => emoji.name === "loading")} Created your **${tcategory.name}** ticket ${c}`).then((msg) => {msg.delete({ timeout: 5000 })})
                        const ticket = new Ticket({
                            ticketName: `ticket-${num}`,
                            ticketNumber: num,
                            discordId: user.id,
                            discordTag: reaction.message.guild.members.cache.get(user.id).user.tag,
                            guildId: reaction.message.guild.id,
                            ticketLog:[],
                            ticketOpen: true,
                            channelId: c.id
                        })
   
                       ticket.save()
                        const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a")
                        User.findOne({ discordId: user.id }).then((result) => {
                            if(result === null){
                                if(user.bot) return;
                                const user2 = new User({
                                    discordId: user.id,
                                    profilePoints:[],
                                    tStats:[]
                                })
                                //console.log("user,")
                                result = user2
                                user2.save().then((a) => {
                                    if(result.tStats.length !== 0){
                                        result.tStats.forEach(p=>{
                                            if(p.guildId == reaction.message.guild.id){
                                                opened = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                                let num = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                                if(user.bot) return;
                                                result.tStats[result.tStats.indexOf(p)] = {
                                                    guildId: reaction.message.guild.id,
                                                    ticketsOpened: num+1,
                                                    ticketsClosed: result.tStats[result.tStats.indexOf(p)].ticketsClosed
                                                }
                                                result.save()
                                            }
                                        })
                                    }
                                    else{
                                        opened = 1
                                        User.updateOne({ discordId: user.id }, {
                                            $push: {
                                                tStats: {
                                                    "guildId": reaction.message.guild.id,
                                                    "ticketsOpened" : 1
                                                }
                                            }
                                        }, {  safe: true, upsert: true}  ).then(a =>  {/*console.log(a)*/})
                
                    
                                    }
                                })
                            }
                            else{
                                if(result.tStats.length !== 0){
                                    result.tStats.forEach(p=>{
                                        if(p.guildId == reaction.message.guild.id){
                                            opened = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                            let num = result.tStats[result.tStats.indexOf(p)].ticketsOpened
                                            if(user.bot) return;
                                            result.tStats[result.tStats.indexOf(p)] = {
                                                guildId: reaction.message.guild.id,
                                                ticketsOpened: num+1,
                                                ticketsClosed: result.tStats[result.tStats.indexOf(p)].ticketsClosed
                                            }
                                            result.save()
                                        }
                                    })
                                }
                                else{
                                    opened = 1
                                    User.updateOne({ discordId: user.id }, {
                                        $push: {
                                            tStats: {
                                                "guildId": reaction.message.guild.id,
                                                "ticketsOpened" : 1
                                            }
                                        }
                                    }, {  safe: true, upsert: true}  ).then(a =>  {/*console.log(a)*/})
            
                
                                }
                            }

                                norm(reaction, c, user, handleTime, tcategory)
                            

                        
                        })

                        
            
                    })


                })
                
            }
        
        }
    }

        

    })
})

function fapplication(msg){
    msg.channel.updateOverwrite(msg.guild.roles.cache.find(r => r.name === client[msg.guild.id].settings.supportRole), {
        VIEW_CHANNEL: false
    })
    const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a")
    const filter = m => m.author.id !== client.user.id
    const collector = msg.channel.createMessageCollector(filter, { time: 30000 });
    collector.on('collect', m => {
        let embed = new Discord.MessageEmbed()
        .setColor(client[m.guild.id].settings.embedColor)
        .setThumbnail(m.guild.iconURL({
            dynamic: true
        }))
        .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
        .addField("Time Created", handleTime(m.channel.createdTimestamp))
        .addField("Tickets Created", opened)
        .addField(`Portfolio Link`, m)
        .addField("MC-Market/MC-Plugins", "Please provide your MC-Market or MC-Plugins link. If you have neither type \"none\".")
        .setTimestamp()
        msg.edit(embed)
        m.delete()
        collector.emit("end", m)
        
        const filter2 = m2 => m2.author.id !== client.user.id 
        const collector2 = msg.channel.createMessageCollector(filter2, { time: 30000 });
        collector2.on('collect', m2 => {

        let embed = new Discord.MessageEmbed()
        .setColor(client[m.guild.id].settings.embedColor)
        .setThumbnail(m.guild.iconURL({
            dynamic: true
        }))
        .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
        .addField("Time Created", handleTime(m.channel.createdTimestamp))
        .addField("Tickets Created", opened)
 		.addField(`Portfolio Link`, m)
        .addField("MC-Market/MC-Plugins", m2.content)
        .addField("Experience", "How many years of experience do you have?")
        .setTimestamp()
        msg.edit(embed)
        m2.delete()
        collector2.emit("end", m2)
        const filter3 = m3 => m3.author.id !== client.user.id 
        const collector3 = msg.channel.createMessageCollector(filter3, { time: 30000 });
        collector3.on('collect', m3 => {
            let embed = new Discord.MessageEmbed()
            .setColor(client[m.guild.id].settings.embedColor)
            .setThumbnail(m.guild.iconURL({
                dynamic: true
            }))
            .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
            .addField("Time Created", handleTime(m.channel.createdTimestamp))
            .addField("Tickets Created", opened)
            .addField(`Portfolio Link`, m.content)
            .addField("MC-Market/MC-Plugins", m2.content)
            .addField("Experience", m3.content)
            .addField("Other teams", "Have you ever worked as a Freelancer for another service team? If yes, who?")
            .setTimestamp()
            msg.edit(embed)
            m3.delete()
            collector3.emit("end", m3)
            const filter4 = m4 => m4.author.id !== client.user.id 
            const collector4 = msg.channel.createMessageCollector(filter4, { time: 30000 });
            collector4.on('collect', m4 => {
                let embed = new Discord.MessageEmbed()
                .setColor(client[m.guild.id].settings.embedColor)
                .setThumbnail(m.guild.iconURL({
                    dynamic: true
                }))
                .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
                .addField("Time Created", handleTime(m.channel.createdTimestamp))
                .addField("Tickets Created", opened)
                .addField(`Portfolio Link`, m.content)
                .addField("MC-Market/MC-Plugins", m2.content)
                .addField("Experience", m3.content)
                .addField("Other teams", m4.content)
                .addField("Expertise", "What sets you apart from others in the same niche as you?")
                .setTimestamp()
                msg.edit(embed)
                m4.delete()
                collector4.emit("end", m4)
                const filter5 = m5 => m5.author.id !== client.user.id 
                const collector5 = msg.channel.createMessageCollector(filter5, { time: 30000 });
                collector5.on('collect', m5 => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(client[m.guild.id].settings.embedColor)
                    .setThumbnail(m.guild.iconURL({
                        dynamic: true
                    }))
                    .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
                    .addField("Time Created", handleTime(m.channel.createdTimestamp))
                    .addField("Tickets Created", opened)
                    .addField(`Portfolio Link`, m.content)
                    .addField("MC-Market/MC-Plugins", m2.content)
                    .addField("Experience", m3.content)
                    .addField("Other teams", m4.content)
                    .addField("Expertise", m5.content)
                    .addField("Time", "Will you complete all commisions in a timely manner?")
                    .setTimestamp()
                    msg.edit(embed)
                    m5.delete()
                    collector5.emit("end", m5)
                    const filter6 = m5 => m5.author.id !== client.user.id 
                    const collector6 = msg.channel.createMessageCollector(filter6, { time: 30000 });
                    collector6.on('collect', m6 => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(client[m.guild.id].settings.embedColor)
                            .setThumbnail(m.guild.iconURL({
                                dynamic: true
                            }))
                            .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
                            .addField("Time Created", handleTime(m.channel.createdTimestamp))
                            .addField("Tickets Created", opened)
                            .addField(`Portfolio Link`, m.content)
                            .addField("MC-Market/MC-Plugins", m2.content)
                            .addField("Experience", m3.content)
                            .addField("Other teams", m4.content)
                            .addField("Expertise", m5.content)
                            .addField("Time", m6.content)
                        	.addField("Agreement", "Is all of the information provided accurate and correct?")
                            .setTimestamp()
                            msg.edit(embed)
                            m6.delete()
                            collector5.emit("end", m6)
                        	const filter7 = m6 => m6.author.id !== client.user.id 
                    		const collector7 = msg.channel.createMessageCollector(filter7, { time: 30000 });
                       		collector7.on('collect', m7 => {
                                                        let embed = new Discord.MessageEmbed()
                            .setColor(client[m.guild.id].settings.embedColor)
                            .setThumbnail(m.guild.iconURL({
                                dynamic: true
                            }))
                            .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
                            .addField("Time Created", handleTime(m.channel.createdTimestamp))
                            .addField("Tickets Created", opened)
                            .addField(`Portfolio Link`, m.content)
                            .addField("MC-Market/MC-Plugins", m2.content)
                            .addField("Experience", m3.content)
                            .addField("Other teams", m4.content)
                            .addField("Expertise", m5.content)
                            .addField("Time", m6.content)
                        	.addField("Agreement", m7.content)
                            .setTimestamp()
                            msg.edit(embed)
                            m7.delete()
                            collector7.emit("end", m6)
                            })
                        collector7.on('end', collected7 => {
                                                    if(collected7.size == 0){
							close(msg)
     					}
                        })
                    })
                    collector6.on('end', collected6 => {
                        if(collected6.size == 0){
							close(msg)
     					}
                    })
                collector5.on('end', collected5 => {
                         if(collected5.size == 0){
							close(msg)
     					}
                })

            })
            collector4.on('end', collected4 => {
                     if(collected4.size == 0){
						close(msg)
     				}
            })
        })
        collector3.on('end', collected3 => {
                           if(collected3.size == 0){
								close(msg)
     						}
                      })
        })
        collector2.on('end', collected2 => {
                 if(collected2.size == 0){
			close(msg)
     			}
            console.log(`Collected ${collected2.size} items`);
        });

 });
 collector.on('end', collected => {
     if(collected.size == 0){
			close(msg)
     }
 });
})
}




function questions(msg){
    let p = msg.channel.guild.channels.cache.find(c=> c.name.toLowerCase() == "freelancer application")
    if(p){
        fapplication(msg)
        return;
    }
    msg.channel.updateOverwrite(msg.guild.roles.cache.find(r => r.name === client[msg.guild.id].settings.supportRole), {
        VIEW_CHANNEL: false
    })
    const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a")
    const filter = m => m.author.id !== client.user.id
    const collector = msg.channel.createMessageCollector(filter, { time: 30000 });
    collector.on('collect', m => {
        console.log(m.guild)
        if(m.mentions.roles.size == 0){
            m.reply(`:warning: Invalid role`).then(msg => {
                msg.delete({timeout: 2000})
                m.delete({timeout: 2000})
            })
            return;
        }
        let embed = new Discord.MessageEmbed()
        .setColor(client[m.guild.id].settings.embedColor)
        .setThumbnail(m.guild.iconURL({
            dynamic: true
        }))
        .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
        .addField("Time Created", handleTime(m.channel.createdTimestamp))
        .addField("Tickets Created", opened)
        .addField(`Role`, m)
        .addField("Budget", "What is your Budget? If you want a quote please put quote")
        .setTimestamp()
        msg.edit(embed)
        let role = m.guild.roles.cache.get(m.content.slice(2,-1).slice(1))
        m.delete()
        collector.emit("end", m)
        
        const filter2 = m2 => m2.author.id !== client.user.id 
        const collector2 = msg.channel.createMessageCollector(filter2, { time: 30000 });
        collector2.on('collect', m2 => {
            if(!m2.content.split("")[0] === "$" || isNaN(m2.content.slice(1)) && m2.content.toLowerCase() !== "quote"){

                m2.reply(`:warning: Invalid amount`).then(m22 => m22.delete({timeout: 2000}))
                m2.delete({timeout: 2000})
                return;
            }
        let embed = new Discord.MessageEmbed()
        .setColor(client[m.guild.id].settings.embedColor)
        .setThumbnail(m.guild.iconURL({
            dynamic: true
        }))
        .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
        .addField("Time Created", handleTime(m.channel.createdTimestamp))
        .addField("Tickets Created", opened)
        .addField(`Role`, m)
        .addField("Budget", m2.content)
        .addField("Deadline", "Is there any deadline for your order?")
        .setTimestamp()
        msg.edit(embed)
        m2.delete()
        collector2.emit("end", m2)
        const filter3 = m3 => m3.author.id !== client.user.id 
        const collector3 = msg.channel.createMessageCollector(filter3, { time: 30000 });
        collector3.on('collect', m3 => {
            let embed = new Discord.MessageEmbed()
            .setColor(client[m.guild.id].settings.embedColor)
            .setThumbnail(m.guild.iconURL({
                dynamic: true
            }))
            .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
            .addField("Time Created", handleTime(m.channel.createdTimestamp))
            .addField("Tickets Created", opened)
            .addField(`Role`, m)
            .addField("Budget", m2.content)
            .addField("Deadline", m3.content)
            .addField("Details", "What are the details of your request?")
            .setTimestamp()
            msg.edit(embed)
            m3.delete()
            collector3.emit("end", m3)
            const filter4 = m4 => m4.author.id !== client.user.id 
            const collector4 = msg.channel.createMessageCollector(filter4, { time: 30000 });
            collector4.on('collect', m4 => {
                let embed = new Discord.MessageEmbed()
                .setColor(client[m.guild.id].settings.embedColor)
                .setThumbnail(m.guild.iconURL({
                    dynamic: true
                }))
                .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
                .addField("Time Created", handleTime(m.channel.createdTimestamp))
                .addField("Tickets Created", opened)
                .addField(`Role`, m)
                .addField("Budget", m2.content)
                .addField("Deadline", m3.content)
                .addField("Details", m4.content)
                .addField("Other", "Do you have anything else to add?")
                .setTimestamp()
                msg.edit(embed)
                m4.delete()
                collector4.emit("end", m4)
                const filter5 = m5 => m5.author.id !== client.user.id 
                const collector5 = msg.channel.createMessageCollector(filter5, { time: 30000 });
                collector5.on('collect', m5 => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(client[m.guild.id].settings.embedColor)
                    .setThumbnail(m.guild.iconURL({
                        dynamic: true
                    }))
                    .addField("Creator", `${m.author.username}#${m.author.discriminator}`)
                    .addField("Time Created", handleTime(m.channel.createdTimestamp))
                    .addField("Tickets Created", opened)
                    .addField(`Role`, m)
                    .addField("Budget", m2.content)
                    .addField("Deadline", m3.content)
                    .addField("Details", m4.content)
                    .addField("Other", m5.content)
                    .setTimestamp()
                    msg.edit(embed)
                    m5.delete()
                    collector5.emit("end", m5)
                    console.log(m.mentions.roles.first().id)
                    m5.channel.overwritePermissions([
                        {
                          id: m.mentions.roles.first().id,
                          allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"]
                        },
                        {
                            id: m.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        },
                        {
                            id: m.author.id,
                            allow: ['VIEW_CHANNEL', 'ATTACH_FILES', "SEND_MESSAGES"]
                        }
                      ]);
                    m5.channel.send(`<@&${m.mentions.roles.first().id}>`)
                })
                collector5.on('end', collected5 => {
                         if(collected5.size == 0){
							close(msg)
     					}
                })

            })
            collector4.on('end', collected4 => {
                     if(collected4.size == 0){
						close(msg)
     				}
            })
        })
        collector3.on('end', collected3 => {
                           if(collected3.size == 0){
								close(msg)
     						}
                      })
        })
        collector2.on('end', collected2 => {
                 if(collected2.size == 0){
			close(msg)
     			}
            console.log(`Collected ${collected2.size} items`);
        });

 });
 collector.on('end', collected => {
     if(collected.size == 0){
			close(msg)
     }
 });
}

function norm(reaction, channel, user, handleTime, tcategory){
    let supportEmbed = new Discord.MessageEmbed()
                           .setThumbnail(reaction.message.guild.iconURL({
                               dynamic: true
                           }))
                           .addField("Creator", `${user.username}#${user.discriminator}`)
                           .addField("Time Created", handleTime(channel.createdTimestamp))
                           .addField("Tickets Created", opened)
                           .addField("Reason", `Thank you for creating a **${tcategory.name}** ticket in **${reaction.message.guild.name}**.\nPlease explain in detail what you need.\nSupport will be with you as soon as possible!\nPlease do not tag staff without a good reason.`)
                           .setColor(reaction.settings.embedColor)
                           .setTimestamp()
                           channel.send(supportEmbed)
}

function close(msg){
             Ticket.findOne({ channelId: msg.channel.id }).then((res) => {
        if(res === null){
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setDescription(":warning: Invalid Ticket")
            .setColor(msg.embedColor)
             msg.channel.send(embed)
            return;
        }
        else{
            if(res.ticketOpen == true){
                msg.channel.messages.fetch().then(async messages => {
                    let closedticket = [];
                    const putInArray = async (data) => closedticket.push(data);
                    const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a")
                    for (const message of messages.array().reverse()) await putInArray(`${handleTime(msg.createdTimestamp)} ${msg.author.username} : ${msg.content}`);
                    let reason = "Closed due to lack of response"
                    let closeEmbed = new Discord.MessageEmbed().setDescription(":ok_hand: Closing the ticket in 3 seconds due to inactivity").setTimestamp().setColor(msg.embedColor)
                    msg.channel.send(closeEmbed)

                    setTimeout(() => {
                        console.log(closedticket)
                        res.ticketOpen = false
                        res.ticketLog = closedticket
                        res.save()
                        msg.channel.delete()
                        let embed = new Discord.MessageEmbed()
                        .setTitle("Ticket closed!")
                        .setThumbnail(msg.guild.iconURL({
                            dynamic: true,
                            height: 64,
                            width: 64
                        }))
                        .setDescription(`**Ticket Number**: ${msg.channel.name}\n**Ticket ID**: ${msg.channel.id}\n**Time Open**: ${ms(msg.createdTimestamp-msg.channel.createdTimestamp)}\n**Closed By**: Bot\n**Reason**: ${reason}\n\`\`\`${closedticket.splice(closedticket.length-5,closedticket.length).join("\n")}\`\`\``)
                        .setColor(msg.embedColor)
                        .setTimestamp()
                        let channel = msg.guild.channels.cache.find(c => c.name === client[msg.guild.id].settings.ticketLogChannel)
                        if(channel){   
                            channel.send(embed)
                        }
                        client.users.cache.get(res.discordId).send(embed)
                    }, 3000)

                });
    
            }
            else{
                let embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setDescription(":warning: Not sure how you fucked this up, check console or dm me")
                .setColor(message.embedColor)
                msg.channel.send(embed)
                return;
            }
        }
    })
}
