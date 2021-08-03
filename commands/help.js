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
var cat = []
module.exports.run = async (client, message, msgargs, command) => {
    if (message.channel.type === 'dm') {
        return;
    }
    if (!msgargs[0]) {
        const embed = new Discord.MessageEmbed().setTimestamp()
        .setColor(message.embedColor)
        .setTimestamp()
        client.commands.forEach(command => {
            if (command.help.category == undefined) {}
            if (cat.indexOf(command.help.category) == -1) cat.push(command.help.category)
        })
        cat.forEach(c => {
            var temp = []
            client.commands.forEach(cmd => {
                if (cmd.help.category == c) {
                    temp.push(`\`${cmd.help.name}\``)
                }
            })
            embed.addField(`${c.charAt(0).toUpperCase() + c.slice(1)}`, `${temp.join(", ")}`)
        })
        embed.setDescription(`To get the usage for a specific command, run **help <command name>**!\nA total of **${client.commands.size}** commands have been loaded.`)
        message.channel.send(embed)
    } else {
        let usagecmd = client.commands.get(msgargs[0].toLowerCase()) || client.commands.get(client.aliases.get(msgargs[0].toLowerCase()))
        if (usagecmd === undefined) {
            const embed = new Discord.MessageEmbed().setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                dynamic: true
            })).setDescription(`:warning: **${msgargs[0]}** is not a valid command`).setTimestamp().setColor(message.embedColor)
            return message.channel.send(embed)
        } else {
            Perms.findOne({ commandName: usagecmd.help.name }).then((result) => {
                if(result !== null){
                    let users = []
                    let roles = []
                    let permissions = []
                    result.users.forEach(u=>{
                        users.push(`<@!${u}>`)
                    })
                    result.roles.forEach(r=>{
                        roles.push(`<@&${r}>`)
                    })
                    result.permissions.forEach(p=>{
                        permissions.push(`\`${p}\``)
                    })
                                                
                    let field = []
                    field.push(users.join(", "))
                    field.push(roles.join(", "))
                    field.push(permissions.join(", "))
                
                    var adata;
                    if (usagecmd.help.aliases.length < 1) {
                        adata = "No Aliases"
                    } else {
                        adata = usagecmd.help.aliases.join(", ")
                    }
                    const embed = new Discord.MessageEmbed().setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                        dynamic: true
                    })).addField("Command Name", usagecmd.help.name).addField("Usage", usagecmd.help.usage).addField("Description", usagecmd.help.description).addField("Category", usagecmd.help.category).addField("Aliases", adata).addField("Permissions", field.join("\n")).setColor(message.embedColor).setTimestamp()
                    return message.channel.send(embed)
                }

            })
        }
        
    }
}
module.exports.help = {
    name: "help",
    usage: `help [command name or alias]`,
    description: "Shows help menu!",
    aliases: ["commands"],
    category: "general",
    args: false
}