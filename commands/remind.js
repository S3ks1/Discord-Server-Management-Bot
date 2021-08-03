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
    let time = msgargs[0]
    let reminder = msgargs.slice(1).join(" ")
    let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: I will remind you about \`${reminder}\` in ${time}`).setTimestamp().setColor(message.embedColor)
    message.channel.send(embed)
    setTimeout(function() {
        try {
            message.channel.send(`<@!${message.author.id}> don't forget to: \`${reminder}\`!`)
        } catch (e) {
            console.log(e)
        }
    }, ms(time));
}
module.exports.help = {
    name: "remind",
    description: "Set a reminder for something in the future, the bot will ping you when you specify!",
    usage: `remind <time> <reminder>`,
    aliases: ["rmd"],
    category: "general",
    args: true
}