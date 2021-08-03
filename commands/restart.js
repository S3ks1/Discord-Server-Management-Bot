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
    const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setDescription(":white_check_mark: Restarting bot in 3 seconds!")
    .setTimestamp();
    message.channel.send(embed)
    setTimeout(() => {
    process.exit(0)
    }, 3000)

}
module.exports.help = {
    name: "restart",
    description: "Restart the bot",
    usage: `restart`,
    aliases: ["relog"],
    category: "administrator",
    args: false
}