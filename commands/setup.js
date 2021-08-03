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
    let cat = []
    client.commands.forEach(command => {
        if (command.help.category == undefined) {}
        if (cat.indexOf(command.help.category) == -1) cat.push(command.help.category)
    })
    if(!msgargs[0]){
        for(let [key, value] of client.commands.entries()){
            let perm
            if(value.help.category.toLowerCase() == "administrator"){
                perm = "ADMINISTRATOR"
            }
            if(value.help.category.toLowerCase() == "general"){
                perm = "VIEW_CHANNEL"
            }
            if(value.help.category.toLowerCase() == "tickets"){
                perm = "MANAGE_MESSAGES"
            }
            if(value.help.category.toLowerCase() == "moderation"){
                perm = "MANAGE_MESSAGES"
            }
            const perm2 = new Perms({
                commandName: value.help.name, 
                roles: [],
                users: [],
                permissions: [perm]
            })
            perm2.save().then((a) => {})
        }
        let embed = new Discord.MessageEmbed()
        .setDescription(`:ok_hand: Set up permissions for all commands with default settings...`)
        .setColor(message.embedColor)
        .setTimestamp()
        message.channel.send(embed)
        return;
    }


}
module.exports.help = {
    name: "setup",
    description: "Set up command permissions",
    usage: `setup`,
    aliases: [],
    category: "administrator",
    args: false
}