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
    message.channel.send("https://discord.gg/BJdZyD6V8n")
}
module.exports.help = {
    name: "factions",
    description: "Send an invite to the factions community discord",
    usage: `factions`,
    aliases: [],
    category: "general",
    args: false
}