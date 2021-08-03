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
    if (message.channel.type === "dm") return;
    if (!msgargs[0]) {}
    let time = msgargs[0]
    message.channel.setRateLimitPerUser(time, "lol").catch((e) => {
        if (!msgargs[0]) {
            let embed = new Discord.MessageEmbed().setDescription(`:warning: Could not set slowmode in this channel - invalid time?`).setTimestamp().setColor(message.embedColor)
            message.channel.send({
                embed
            });
        }
    })
    let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Successfully added a ${msgargs[0]}s slowmode to <#${message.channel.id}>`).setColor(message.embedColor).setTimestamp()
    message.channel.send({
        embed
    });
}
module.exports.help = {
    name: "slowmode",
    usage: `slowmode <time>`,
    description: "Add slowmode to a channel",
    aliases: [],
    category: "moderation",
    args: true
}