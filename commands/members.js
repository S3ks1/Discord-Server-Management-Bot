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
    var arr2 = []
    //let members = message.guild.roles.fetch().then(lol => lol.cache.forEach(c=> console.log(`${c.name} : ${message.guild.roles.fetch(c.id).members}`)))
    let role = message.guild.roles.cache.get(msgargs[0]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === msgargs.join(" ").toLowerCase()) || message.guild.roles.cache.get(msgargs[0].replace("<@&", "").replace(">", "")) || message.guild.roles.everyone

    let lol = message.guild.members.fetch({force: true}).then(membersfetch => {
        membersfetch.forEach((member) => {
            if(member.roles.cache.find(r=> r.id === role.id)){
                arr2.push(member.user.tag)
                
            }
        });
    })
    setTimeout(() => {
        let whitelisted = []
        let description = []
        let field2 = []
        let field3 = []
        
        //console.log(userObj)
        arr2.forEach(user => {
            whitelisted.push({
                "tag": user
            })
            if (whitelisted.length === arr2.length) {
                let sorted = whitelisted
                sorted.forEach(person => {
                        description.push(`**${person.tag}**`)
                })
            }
        })
        const generateEmbed = start => {
            var n = description.slice(start, start + 10)
            var embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setTitle(`Members of ${role.name} (${arr2.length})`)
            //console.log(Math.ceil(n.length / 10))
            if(n.length > 0){
                embed.setDescription(n.join("\n"))
                embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(n.length/10)}/${Math.ceil(description.length/10)}`)
                embed.setColor(message.embedColor)
            }
            else{
                embed.setDescription(":warning: No members")
                embed.setColor(message.embedColor)
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
    
    }, 500)
    
}   
module.exports.help = {
    name: "members",
    usage: `members <role>`,
    description: "List all members with a role",
    aliases: [],
    category: "general",
    args: true
}