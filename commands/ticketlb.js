const { white } = require("chalk")
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

    if(msgargs[0] === "opened"){
        let whitelisted = []
        let description = []
        let field2 = []

        let nigga = await User.find(
            { 
                "tStats.guildId" : message.guild.id, 
                "tStats.0.ticketsOpened" : { 
                    "$ne" : 0
                }
            }
        ).sort(
            { 
                "tStats.0.ticketsOpened" : -1.0
            }
        );
            
            let ticketz = nigga.map(n=>`${n.discordId} | ${n.tStats[0].ticketsOpened}`)
            let ppl = []
            ticketz.forEach(async t=>{
                let lol = t.split(" | ")
                let user = await client.users.fetch(lol[0])
                /*
                ppl.push({
                    "username":await client.users.fetch(lol[0]) !== undefined ? `${await client.users.fetch(lol[0]).username}#${await client.users.fetch(lol[0]).discriminator}` : "Unknown User",
                    "closed":lol[1]
                })
                */
                description.push(`**${user !== undefined ? `${user.username}#${user.discriminator}` : `Unknown User`}**`)
                field2.push(lol[1])
            })
           console.log(ppl)



                const generateEmbed = start => {
                    var f1 = description.slice(start, start + 10)
                    var f2 = field2.slice(start,start + 10)
                    var embed = new Discord.MessageEmbed()
                        .setTimestamp()
                        .setTitle(`Tickets Opened Leaderboard for ${message.guild.name}`)
                        .setColor(message.embedColor)
                    if(f1.length > 0 && f2.length >0){
                        embed.addField("**Person**", f1.join("\n"), true)
                        embed.addField("**Tickets Opened**", f2.join("\n"), true)
                        embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(f1.length/10)}/${Math.ceil(description.length/10)}`)
                        return embed
                    }
                    else{
                        
                        embed.setDescription(":warning: You should not see this :eyes:")
                    }
        
                    return embed
                }
        
                const author = message.author
                message.channel.send(`:ok_hand: Fetching ticket leaderboard information...`).then((msg) => {
                    setTimeout(async () => {

                        await msg.edit({content:null, embed:generateEmbed(0)}).then(message2 => {
                            if (description.length <= 10) return
                            message2.react('◀️')
                            message2.react('▶️')
                            const collector = message2.createReactionCollector(
                                (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === author.id, {
                                    time: 180000
                                }
                            )
                
                            let currentIndex = 0
                            collector.on('collect', async (reaction, user) => {
                                reaction.users.remove(message.author.id)
                                if (reaction.emoji.name === "◀️" && currentIndex > 9) {
                                    currentIndex = currentIndex - 10
                                }
                                if (reaction.emoji.name === "▶️" && currentIndex + 10 < description.length) {
                                    currentIndex = currentIndex + 10
                                }
                
                                message2.edit(generateEmbed(currentIndex))
                
                            })
                        })
                    }, 3000)
                })


    }
    else if(msgargs[0] === "closed"){
        let whitelisted = []
        let description = []
        let field2 = []

        let nigga = await User.find(
            { 
                "tStats.guildId" : message.guild.id, 
                "tStats.0.ticketsClosed" : { 
                    "$ne" : 0
                }
            }
        ).sort(
            { 
                "tStats.0.ticketsClosed" : -1.0
            }
        );
            
            let ticketz = nigga.map(n=>`${n.discordId} | ${n.tStats[0].ticketsClosed}`)
            let ppl = []
            ticketz.forEach(async t=>{
                let lol = t.split(" | ")
                let user = await client.users.fetch(lol[0])
                /*
                ppl.push({
                    "username":await client.users.fetch(lol[0]) !== undefined ? `${await client.users.fetch(lol[0]).username}#${await client.users.fetch(lol[0]).discriminator}` : "Unknown User",
                    "closed":lol[1]
                })
                */
                description.push(`**${user !== undefined ? `${user.username}#${user.discriminator}` : `Unknown User`}**`)
                field2.push(lol[1])
            })
           console.log(ppl)



                const generateEmbed = start => {
                    var f1 = description.slice(start, start + 10)
                    var f2 = field2.slice(start,start + 10)
                    var embed = new Discord.MessageEmbed()
                        .setTimestamp()
                        .setTitle(`Tickets Closed Leaderboard for ${message.guild.name}`)
                        .setColor(message.embedColor)
                    if(f1.length > 0 && f2.length >0){
                        embed.addField("**Person**", f1.join("\n"), true)
                        embed.addField("**Tickets Closed**", f2.join("\n"), true)
                        embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(f1.length/10)}/${Math.ceil(description.length/10)}`)
                        return embed
                    }
                    else{
                        
                        embed.setDescription(":warning: You should not see this :eyes:")
                    }
        
                    return embed
                }
        
                const author = message.author
                message.channel.send(`:ok_hand: Fetching ticket leaderboard information...`).then((msg) => {
                    setTimeout(async () => {
                        msg.edit({content:null, embed:generateEmbed(0)}).then(message2 => {
                            if (description.length <= 10) return
                            message2.react('◀️')
                            message2.react('▶️')
                            const collector = message2.createReactionCollector(
                                (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === author.id, {
                                    time: 180000
                                }
                            )
                
                            let currentIndex = 0
                            collector.on('collect', async (reaction, user) => {
                                reaction.users.remove(message.author.id)
                                if (reaction.emoji.name === "◀️" && currentIndex > 9) {
                                    currentIndex = currentIndex - 10
                                }
                                if (reaction.emoji.name === "▶️" && currentIndex + 10 < description.length) {
                                    currentIndex = currentIndex + 10
                                }
                
                                message2.edit(generateEmbed(currentIndex))
                
                            })
                        })
                    }, 3000)
                })


    }
    else if(msgargs[0] === "voice"){
        let whitelisted = []
        let description = []
        let field2 = []

        let nigga = await User.find().sort({vcTime:-1})
            
            let ticketz = nigga.map(n=>`${n.discordId} | ${n.vcTime !== 0 ? ms(n.vcTime, {long:true}) : 0}`)
            let ppl = []
            ticketz.forEach(async t=>{
                let lol = t.split(" | ")
                let user = await client.users.fetch(lol[0])
                /*
                ppl.push({
                    "username":await client.users.fetch(lol[0]) !== undefined ? `${await client.users.fetch(lol[0]).username}#${await client.users.fetch(lol[0]).discriminator}` : "Unknown User",
                    "closed":lol[1]
                })
                */
                description.push(`**${user !== undefined ? `${user.username}#${user.discriminator}` : `Unknown User`}**`)
                field2.push(lol[1])
            })
           console.log(ppl)



                const generateEmbed = start => {
                    var f1 = description.slice(start, start + 10)
                    var f2 = field2.slice(start,start + 10)
                    var embed = new Discord.MessageEmbed()
                        .setTimestamp()
                        .setTitle(`VC Time Leaderboard for ${message.guild.name}`)
                        .setColor(message.embedColor)
                    if(f1.length > 0 && f2.length >0){
                        embed.addField("**Person**", f1.join("\n"), true)
                        embed.addField("**Time in VCs**", f2.join("\n"), true)
                        embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(f1.length/10)}/${Math.ceil(description.length/10)}`)
                        return embed
                    }
                    else{
                        
                        embed.setDescription(":warning: You should not see this :eyes:")
                    }
        
                    return embed
                }
        
                const author = message.author
                message.channel.send(`:ok_hand: Fetching VC leaderboard information...`).then((msg) => {
                    setTimeout(async () => {
                        msg.edit({content:null, embed:generateEmbed(0)}).then(message2 => {
                            if (description.length <= 10) return
                            message2.react('◀️')
                            message2.react('▶️')
                            const collector = message2.createReactionCollector(
                                (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === author.id, {
                                    time: 180000
                                }
                            )
                
                            let currentIndex = 0
                            collector.on('collect', async (reaction, user) => {
                                reaction.users.remove(message.author.id)
                                if (reaction.emoji.name === "◀️" && currentIndex > 9) {
                                    currentIndex = currentIndex - 10
                                }
                                if (reaction.emoji.name === "▶️" && currentIndex + 10 < description.length) {
                                    currentIndex = currentIndex + 10
                                }
                
                                message2.edit(generateEmbed(currentIndex))
                
                            })
                        })
                    }, 3000)
                })
                

    }
    else{
        let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setDescription(":warning: Invalid args provided")
        .setColor(message.embedColor)
        message.channel.send(embed)
        return;
    }
    
}
module.exports.help = {
    name: "ticketlb",
    usage: `ticketlb <closed/opened>`,
    description: "Shows top tickets opened/closed",
    aliases: ["tlb"],
    category: "general",
    args: true
}