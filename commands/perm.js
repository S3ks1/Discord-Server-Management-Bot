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
    const user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.join(" ").replace("\n", ""))
    Perms.find().then((p) => {
        let names = []
        p.forEach((perm)=> {
            names.push(perm.commandName)
            if(!msgargs[1] && perm.commandName.toLowerCase() == msgargs[0].toLowerCase()){
                let Roles = []
                let Users = []
                let Permissions = []
                perm.users.forEach(user => Users.push(`<@!${user}>`))
                perm.roles.forEach(user => Roles.push(`<@&${user}>`))
                perm.permissions.forEach(user => Permissions.push(user))
                let embed = new Discord.MessageEmbed().setTitle(`Permissions for the ${msgargs[0].toLowerCase()} command!`).setTimestamp().setColor(message.embedColor)
                if (Roles.length !== 0) {
                    embed.addField("Roles", Roles.join(", "))
                }
                if (Users.length !== 0) {
                    embed.addField("Users", Users.join(", "))
                }
                if (Permissions.length !== 0) {
                    embed.addField("Discord Permissions", Permissions.join(", "))
                }
                return message.channel.send(embed)
            }
            if (msgargs[0] && msgargs[1] && perm.commandName.toLowerCase() == msgargs[0].toLowerCase()) {
                let user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[1]) || message.guild.members.cache.find(member => member.user.tag === msgargs.slice(1).join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs.slice(1).join(" ").replace("\n", ""))
                if (!user) {
                    let role = message.guild.roles.cache.get(msgargs[1]) || message.guild.roles.cache.find(role => role.name === msgargs.slice(1).join(" ")) || message.guild.roles.cache.get(msgargs[1].replace("<@&", "").replace(">", ""))  || message.guild.roles.cache.find(role => role.name.toLowerCase().substr(0,3) === msgargs.slice(1).join(" ").toLowerCase().substr(0,3))
                    if (!role) {
                        if (perm.permissions.indexOf(msgargs[1].toUpperCase()) == -1) {
                            Perms.updateOne({ commandName: msgargs[0] }, {
                                $push: {
                                    permissions: msgargs[1].toUpperCase()
                                }
                            }, {  safe: true, upsert: true}  ).then(a =>  {})
                            let embed = new Discord.MessageEmbed().setTitle(`Updated Discord Permissions for the ${msgargs[0].toLowerCase()} command!`).setDescription(`Allowed the ${msgargs[1].toUpperCase()} permission to use the ${msgargs[0].toLowerCase()} command!`).setTimestamp().setColor(message.embedColor)
                            message.channel.send(embed)
                        } else {
                            Perms.updateOne({ commandName: msgargs[0] }, {
                                $pull: {
                                    permissions: msgargs[1].toUpperCase()
                                }
                            }, {  safe: true, upsert: true}  ).then(a =>  {})
                            let embed = new Discord.MessageEmbed().setTitle(`Updated Discord Permissions for the ${msgargs[0].toLowerCase()} command!`).setDescription(`Disallowed the ${msgargs[1].toUpperCase()} permission from using the ${msgargs[0].toLowerCase()} command!`).setTimestamp().setColor(message.embedColor)
                            message.channel.send(embed)
                        }
                    } else {
                        if (perm.roles.indexOf(role.id) == -1) {
                            Perms.updateOne({ commandName: msgargs[0] }, {
                                $push: {
                                    roles: role.id
                                }
                            }, {  safe: true, upsert: true}  ).then(a =>  {})
                            let embed = new Discord.MessageEmbed().setTitle(`Updated Role Permissions for the ${msgargs[0].toLowerCase()} command!`).setDescription(`Allowed the ${role} role to use the ${msgargs[0].toLowerCase()} command!`).setTimestamp().setColor(message.embedColor)
                            message.channel.send(embed)
                        } else {
                            Perms.updateOne({ commandName: msgargs[0] }, {
                                $pull: {
                                    roles: role.id
                                }
                            }, {  safe: true, upsert: true}  ).then(a =>  {})
                            let embed = new Discord.MessageEmbed().setTitle(`Updated Role Permissions for the ${msgargs[0].toLowerCase()} command!`).setDescription(`Disallowed the ${role} role from using the ${msgargs[0].toLowerCase()} command!`).setTimestamp().setColor(message.embedColor)
                            message.channel.send(embed)
                        }
                    }
                } else {
                    if (perm.users.indexOf(user.id) == -1) {
                        Perms.updateOne({ commandName: msgargs[0] }, {
                            $push: {
                                users: user.id
                            }
                        }, {  safe: true, upsert: true}  ).then(a =>  {})
                        let embed = new Discord.MessageEmbed().setTitle(`Updated User Permissions for the ${msgargs[0].toLowerCase()} command!`).setDescription(`Allowed <@!${user.id}> to use the ${msgargs[0].toLowerCase()} command!`).setTimestamp().setColor(message.embedColor)
                        message.channel.send(embed)
                    } else {
                        Perms.updateOne({ commandName: msgargs[0] }, {
                            $pull: {
                                users: user.id
                            }
                        }, {  safe: true, upsert: true}  ).then(a =>  {})
                        let embed = new Discord.MessageEmbed().setTitle(`Updated User Permissions for the ${msgargs[0].toLowerCase()} command!`).setDescription(`Denied <@!${user.id}> from using the ${msgargs[0].toLowerCase()} command!`).setTimestamp().setColor(message.embedColor)
                        message.channel.send(embed)
                    }
                }
            }
        })
        if(!names.indexOf(msgargs[0].toLowerCase)){
            let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid command! Make sure to run it at least once`).setTimestamp().setColor(message.embedColor)
            return message.channel.send(embed)
        }
    })
    

    
}
module.exports.help = {
    name: "perm",
    description: "Set or toggle permissions for a command!",
    usage: `perm <command> [user id, Role id, or discord permission]`,
    aliases: ["perms"],
    category: "administrator",
    args: true
}