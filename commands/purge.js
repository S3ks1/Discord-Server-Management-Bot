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
    function createResponse(description) {
        const embed = new Discord.MessageEmbed().setDescription(`${description}`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
    }
    if (!msgargs[0]) {}
    const deleteCount = parseInt(msgargs[0], 10);
    if (!deleteCount || deleteCount < 1 || deleteCount > 100) return createResponse(":warning: Maximum 100 messages!");
    if(deleteCount !== 100){
        let fetched = await message.channel.messages.fetch({
            limit: deleteCount+1
        });
        try{
            message.channel.bulkDelete(fetched).catch((err) => createResponse(`:warning: ${err}`))
        }
        catch(err){
            createResponse(`:warning: ${err}`)
        }
       
    }
    else{
        let fetched = await message.channel.messages.fetch({
            limit: deleteCount
        });
        try{
            message.channel.bulkDelete(fetched).catch((err) => createResponse(`:warning: ${err}`))
        }
        catch(err){
            createResponse(`:warning: ${err}`)
        }
       
    }

}
module.exports.help = {
    name: "purge",
    usage: `${config.prefix}purge <# of messages>`,
    description: "Purges up to 100 messages",
    aliases: [],
    category: "moderation",
    args: true
}