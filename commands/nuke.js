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
    let channel = message.channel
    message.channel.delete().then(lol=> {
        message.guild.channels.create(channel.name, {
            type: "text",
            parent: channel.parent,
            permissionOverwrites: channel.permissionOverwrites,
            position: channel.rawPosition
        })
    })
}
module.exports.help = {
    name: "nuke",
    description: "Nukes the current channel and recreates it",
    usage: `nuke`,
    aliases: [],
    category: "administrator",
    args: false
}