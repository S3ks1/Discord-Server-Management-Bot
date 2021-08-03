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
    const user = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag === msgargs.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === msgargs[0]) || message.guild.members.cache.find(member => member.user.username.toLowerCase().substr(0,3) === msgargs[1].substr(0,3))
    var role = message.guild.roles.cache.get(msgargs[1]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === msgargs.slice(1).join(" ").toLowerCase()) || message.guild.roles.cache.get(msgargs[1].replace("<@&", "").replace(">", "")) || message.guild.roles.cache.find(role => role.name.toLowerCase().substr(0,3) === msgargs.slice(1).join(" ").toLowerCase().substr(0,3))
    if(msgargs[2]){
        role = message.guild.roles.cache.get(msgargs[1]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === msgargs.slice(1).join(" ").toLowerCase()) || message.guild.roles.cache.get(msgargs[1].replace("<@&", "").replace(">", "")) || message.guild.roles.cache.find(role => role.name.toLowerCase().substr(0,3) === msgargs.slice(1).join(" ").toLowerCase().substr(0,3))
    }
    if(!user){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid User`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(!msgargs[1]){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: Provide an IGN`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(!msgargs[1]){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: No role provided`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(!role){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid Role`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(message.guild.me.roles.highest.position <= role.position){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: I can't give this role as it is higher than my highest role.`).setColor(message.embedColor)
        .setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    if(message.guild.members.cache.get(message.author.id).roles.highest.position <= role.position){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: You can't give this role as it is higher than your highest role or your highest role`).setColor(message.embedColor)
        .setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    Guild.findOne({ guildId: message.guild.id} ).then((res) => {
        if(res === null) return;
        if(!user.roles.cache.find(r => r.name == role.name)){
            let embed = new Discord.MessageEmbed()
            .setDescription(`:ok_hand: Promoted ${user.user.tag} to ${role}`)
            .setColor(message.embedColor)
            .setTimestamp()
            message.channel.send({
                embed
            });
            console.log(role.name)
            user.setNickname(`${res.nickNameFormat.replace(`%username%`, role.name).replace(`%var%`, user.user.username)}`)
            user.roles.add(role)
            let embed2 = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name} | Promotion`)
            .setDescription(`${user} has been promoted to ${role} by ${message.author}`)
            .setFooter(`Promoted by ${message.author.username}`, message.author.displayAvatarURL({
                dynamic: true
            }))
            .setColor(message.embedColor)
            .setTimestamp()
            message.guild.channels.cache.find(k=> k.name === res.promoteChannel).send(embed2)
            return;
        }
        else{
            let embed = new Discord.MessageEmbed()
            .setDescription(`:warning: The provided user already has this role!`)
            .setTimestamp()
            .setColor(message.embedColor)
            .setTimestamp()
            message.channel.send({
                embed
            });
            return;
        }
    })
    
}
module.exports.help = {
    name: "promote",
    description: "Promotes a user",
    usage: `promote <user> <ign> <role name or id>`,
    aliases: ["promo", "pr"],
    category: "administrator",
    args: true
}