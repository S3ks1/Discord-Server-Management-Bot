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
var channel
module.exports.run = async (client, message, msgargs, command) => {
    if(!isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", ""))){
        channel = msgargs[0].replace("<", "").replace(">", "").replace("#", "")
    }
    else{
        channel =  message.guild.channels.cache.find(channel => channel.id === msgargs[0]) || !isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", "")) || message.guild.channels.cache.find(channel => channel.name === msgargs.join(" ").split(" | ")[0].split(" ").join("-")) || message.channel.id
    }
   
    let remaining = msgargs.slice(2).join(" ")
    if(remaining.includes("image")){
       var imagecheck = msgargs.join(" ").split("-image:")[1]
       var imagetext = remaining.split("-image:")[0]
    }
    if(imagecheck){
        if(channel.id){
            let embed = new Discord.MessageEmbed().setColor(message.embedColor).setImage(imagecheck).setDescription(imagetext).setTimestamp()
            client.channels.cache.get(channel.id).send(embed)
        }
        else{
            let embed = new Discord.MessageEmbed().setColor(message.embedColor).setImage(imagecheck).setDescription(imagetext).setTimestamp()
            client.channels.cache.get(channel).send(embed)
        }

    }
    else{
        if(channel.id){
            let embed = new Discord.MessageEmbed().setColor(message.embedColor).setDescription(remaining).setTimestamp()
            client.channels.cache.get(channel.id).send(embed)
        }
        else{
            let embed = new Discord.MessageEmbed().setColor(message.embedColor).setDescription(remaining).setTimestamp()
            console.log(channel)
            client.channels.cache.get(channel.toString()).send(embed)
        }

    }
    
}
module.exports.help = {
    name: "embed",
    description: "Generate a custom embed",
    usage: `embed <channel> | <message> If you want to embed an image add -image:link at the end of your message`,
    aliases: [],
    category: "administrator",
    args: true
}