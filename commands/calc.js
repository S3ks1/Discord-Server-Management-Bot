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
const math = require("mathjs")
module.exports.run = async (client, message, msgargs, command) => {
    var result = math.evaluate(msgargs.join(""))
    let embed = new Discord.MessageEmbed().setDescription(`:nerd: Your result is **${result}**`).setTimestamp().setColor(message.embedColor)
    message.channel.send(embed)
}
module.exports.help = {
    name: "calc",
    description: "Do some math!",
    usage: `calc <expression>`,
    aliases: [],
    category: "general",
    args: true
}