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
    let channel = undefined
    if(!isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", ""))){
        channel = msgargs[0].replace("<", "").replace(">", "").replace("#", "")
    }
    else{
        channel =  message.guild.channels.cache.find(channel => channel.id === msgargs[0]) || !isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", "")) || message.guild.channels.cache.find(channel => channel.name === msgargs.join(" ").split(" | ")[0].split(" ").join("-")) || message.channel.id
    }
    if(!channel){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid Channel`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(!msgargs[1]){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: No mention provided`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(msgargs[1] == "everyone"){
        client.channels.cache.get(channel).send(`@everyone \n${msgargs.slice(2).join(" ")}`)
    }
    else if(msgargs[1] == "here"){
        client.channels.cache.get(channel).send(`@here \n${msgargs.slice(2).join(" ")}`)
    }
    else{
        let role = message.guild.roles.cache.get(msgargs[1]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === msgargs[0].toLowerCase()) || message.guild.roles.cache.get(msgargs[1].replace("<@&", "").replace(">", ""))
        if(!role){
            let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid role provided`).setColor(message.embedColor).setTimestamp()
            message.channel.send({
                embed
            });
        }
        else{
            client.channels.cache.get(channel).send(`${role} \n${msgargs.slice(2).join(" ")}`)
        }
    }
   
    
}
module.exports.help = {
    name: "announce",
    description: "Announce a message w/ a ping",
    usage: `announce <channel> <here/everyone/role name> <message>`,
    aliases: [],
    category: "administrator",
    args: true
}