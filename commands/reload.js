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
const { inspect } = require("util")
module.exports.run = async (client, message, args, command) => {
    let cmd = args[0].toLowerCase()
    try{
        delete require.cache[require.resolve(`../commands/${cmd}.js`)]
        client.commands.delete(cmd)

        const pull = require(`../commands/${cmd}.js`)
        client.commands.set(cmd, pull)
        let embed = new Discord.MessageEmbed()
        .setDescription(`:ok_hand: Reloaded \`${cmd}\``)
        .setColor(message.embedColor)
        .setTimestamp()
        message.channel.send(embed)
    }
    catch(err) {
        let embed = new Discord.MessageEmbed()
        .setDescription(`:warning: ${err}`)
        .setColor(message.embedColor)
        .setTimestamp()
        message.channel.send(embed)
    }
}
module.exports.help = {
    name: "reload",
    usage: `reload <command name>`,
    description: "Reload a command",
    aliases: [],
    category: "administrator",
    args: true
}