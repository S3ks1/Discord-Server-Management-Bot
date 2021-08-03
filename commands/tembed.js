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
    Perms,
    TicketEmbed
} = require("../index") 
module.exports.run = async (client, message, msgargs, command) => {
    var i
    var channel

    if(!isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", ""))){
        channel = msgargs[0].replace("<", "").replace(">", "").replace("#", "")
    }
    else{
        channel =  message.guild.channels.cache.find(channel => channel.id === msgargs[0]) || !isNaN(msgargs[0].replace("<", "").replace(">", "").replace("#", "")) || message.guild.channels.cache.find(channel => channel.name === msgargs.join(" ").split(" | ")[0].split(" ").join("-")) || msgargs[0]
    }
    msgargs.shift()
    let str = msgargs.join(" ")
    let split = str.split(" | ")
    let arr1 = []
    let arr2 = []
    split.slice(1).forEach(type => {
        if(type.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)){
            arr2.push(type)
        }
        else if(type.match(/<a:.+?:\d+>/g) || type.match(/<:.+?:\d+>/g)){
            arr2.push(type)
        }
        else{
            arr1.push(type)
        }
    })
    let embed = new Discord.MessageEmbed().setTitle(split[0]).setThumbnail(message.guild.iconURL({
        dynamic: true
    })).setTimestamp().setColor(message.embedColor)
    let names = []
    arr1.forEach(lol => {
        console.log(arr1)
        embed.addField(`${arr2[arr1.indexOf(lol)]} **${lol.split("-d")[0]}**`, lol.split("-d")[1])
        names.push(lol.split("-d")[0])
    })
    let msgEmbed = await client.channels.cache.get(channel).send(embed)
    arr2.forEach(rea => {
        msgEmbed.react(rea)
    })
    let arr3 = []
    arr2.forEach(r => {
        if(r.includes(":")){
            arr3.push(r.split(":")[1])
        }
        else{
            arr3.push(r)
        }
    })
    const tembed = new TicketEmbed({
        messageId: msgEmbed.id,
        categories: names,
        reactions: arr3
    })
    tembed.save()


    for(i = 0; i < names.length; i++){
        if (!client.channels.cache.some(channel => channel.name === names[i] && channel.type == "category")) {
            message.guild.channels.create(names[i], {
                type: 'category',
                permissionOverwrites: [
                    {
                    id: message.guild.id,
                    deny: ["VIEW_CHANNEL"]
                    }
                ]
            })
        }
    }

}
module.exports.help = {
    name: "tembed",
    description: "Create a ticket embed!",
    usage: `tembed <channel> <title> | <category name>-d<Category Description> | <your emoji> | <category name>-d<Category Description> | <your emoji> | <category name>-d<Category Description> | <your emoji>  `,
    aliases: ["ticketembed"],
    category: "administrator",
    args: true
}