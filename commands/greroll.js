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
    client.giveaways.reroll(msgargs[0]).then(() => {
    }).catch((err) => {
        let embed = new Discord.MessageEmbed().setFooter(config.footerText, config.footerImageLink).setDescription(`:warning: Error`)
        message.channel.send({
            embed
        });
    });


}
module.exports.help = {
    name: "greroll",
    description: "Reroll a giveaway",
    usage: `greroll <message id>`,
    aliases: ["giveawayreroll", "gend"],
    category: "administrator",
    args: true
}