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
    let member = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", "")) || message.guild.member(message.author)
    await User.find({
        profilePoints: {
            $elemMatch:{
                guildId: message.guild.id
            }    
        }            
    }).then((res) => {
        let userarray = []
        res.forEach(r=> {
            r.profilePoints.forEach(p=> {
                if(p.guildId == message.guild.id){
                    //console.log(`${message.guild.members.cache.get(r.discordId).user.tag} -> Level ${p.level}(${p.points} / ${p.level*37}) ${p.totalxp} total XP`)
                }
            })
        })
        let whitelisted = []
        let description = []
        let field2 = []

            res.forEach(r=> {
                r.profilePoints.forEach(p=> {
                   
                    if(p.guildId == message.guild.id){
                        whitelisted.push({
                            "id": r.discordId,
                            "ign": message.guild.members.cache.get(r.discordId) !== undefined ? message.guild.members.cache.get(r.discordId).user.tag : "N/A",
                            "checks": p.totalxp || 0
                        })


                        

                    }
                })
            })
            let kek = whitelisted.slice().sort((a,b) => b.checks - a.checks)
            kek.forEach(z => {
                if(client.users.cache.get(z.id)){
                    if(description.indexOf(`**<@!${z.id}> (${z.ign})**`) == -1){
                        description.push(`**<@!${z.id}> (${z.ign})**`)
                        field2[description.indexOf(`**<@!${z.id}> (${z.ign})**`)] = `**${z.checks}**`
                    }
                }
                else{
                    if(description.indexOf(`**Unknown User (ID: ${z.id})**`) == -1){
                        description.push(`**Unknown User (ID: ${z.id})**`)
                        field2[description.indexOf(`**Unknown User (ID: ${z.id})**`)] = `**${z.checks}**`
                        
                    }

                }
            })
            console.log(whitelisted.slice().sort((a,b) => b.checks - a.checks))
            const generateEmbed = start => {
                var f1 = description.slice(start, start + 10)
                var f2 = field2.slice(start,start + 10)
                var embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setTitle(`Leaderboard for ${message.guild.name}`)
                    .setColor(message.embedColor)
                if(f1.length > 0 && f2.length >0){
                    embed.addField("**Person**", f1.join("\n"), true)
                    embed.addField("**XP**", f2.join("\n"), true)
                    embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(f1.length/10)}/${Math.ceil(description.length/10)}`)
                }
                else{
                    embed.setDescription(":warning: You should not see this :eyes:")
                }
    
                return embed
            }
    
            const author = message.author
            message.channel.send(generateEmbed(0)).then(message2 => {
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
        
    

    })
    
}
module.exports.help = {
    name: "leaderboard",
    usage: `leaderboard`,
    description: "Shows top levels in the guild",
    aliases: ["levels", "lb", "top"],
    category: "general",
    args: false
}