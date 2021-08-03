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
    Case
} = require("../index") 
module.exports.run = async (client, message, msgargs, command) => {
    let tomute = message.mentions.members.first() || message.guild.members.cache.get(msgargs[0]) || message.guild.members.cache.find(member => member.user.tag.toLowerCase() === msgargs[0].toLowerCase()) || message.guild.members.cache.find(member => member.user.username === msgargs[0])
    if (!tomute){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid User`).setColor(message.embedColor).setTimestamp()
        return message.channel.send(embed)
    }
    if(message.guild.members.cache.get(message.author.id).roles.highest.position <= tomute.roles.highest.position){
        let embed = new Discord.MessageEmbed().setDescription(`:warning: You can't mute this user as they have a higher role than you do`).setColor(message.embedColor).setTimestamp()
        message.channel.send({
            embed
        });
        return;
    }
    let muterole = message.guild.roles.cache.find(muterole => muterole.name === "Muted");
    if (!muterole) {
        try {
            muterole = await message.guild.roles.create({
                data: {
                    name: "Muted",
                    color: "#000000",
                    permissions: []
                }
            })
            message.guild.channels.cache.forEach(async (channel, id) => {
                channel.updateOverwrite(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }
    let time = msgargs[1]
    await (tomute.roles.add(muterole.id));
    if (!msgargs[1]) {
        let embed2 = new Discord.MessageEmbed()
        .setColor("GREEN")
        .addField(`Moderator`, message.author.tag)
        .setTimestamp()
        .setTitle(`You have been muted in ${message.guild.name}`)
        tomute.send(embed2)
        time = "15m"
        Case.find().sort({caseNumber:-1}).limit(1).then((res) => {
            let embed = new Discord.MessageEmbed().setDescription(`:ok_hand: Muted ${tomute} for the default duration of 15 minutes`).setTimestamp().setColor(message.embedColor).setFooter(`Case Number: # ${!isNaN(casenumber) ? casenumber : 1}`)
            message.channel.send(embed)
            res.length !== 0 ? res[0].caseNumber : NaN
            const caase = new Case({
                user:`${tomute.user.tag}(${tomute.id})`,
                moderator:`${message.author.tag}(${message.author.id})`,
                punishment: `15m Mute, Reason:${msgargs.slice(2).join(" ") !== "" ? msgargs.slice(1).join(" ") : "None Specified"}`,
                caseNumber: !isNaN(casenumber) ? casenumber++ : 1
            })
            caase.save()
        })
        User.findOne({discordId: tomute.id}).then((res) => {
            res.muted = true
            res.save()
        })
    }
    if (time && msgargs[1]) {

        let embed2 = new Discord.MessageEmbed()
        .setColor("GREEN")
        .addField(`Moderator`, message.author.tag)
        .setTimestamp()
        .setTitle(`You have been muted in ${message.guild.name}`)
        tomute.send(embed2)
        Case.find().sort({caseNumber:-1}).limit(1).then((res) => {
            console.log()
            let casenumber = res.length !== 0 ? res[0].caseNumber : NaN
            let embed = new Discord.MessageEmbed().setDescription(`${ms(time) !== undefined ? `:ok_hand: Muted ${tomute} for ${ms(ms(time))}` : `:ok_hand: Permanently muted ${tomute}`}`).setTimestamp().setColor(message.embedColor).setFooter(`Case Number: # ${!isNaN(casenumber) ? casenumber++ : 1}`)
            message.channel.send(embed)
            const caase = new Case({
                user:`${tomute.user.tag}(${tomute.id})`,
                moderator:`${message.author.tag}(${message.author.id})`,
                punishment: `${ms(time) !== undefined ? "Temp Mute" : "Perm Mute"} - Reason:${msgargs.slice(1).join(" ") !== "" ? msgargs.slice(2).join(" ") : "None Specified"}`,
                caseNumber:  !isNaN(casenumber) ? casenumber++ : 1
            })
            
            caase.save()
        })
        User.findOne({discordId: tomute.id}).then((res) => {
            res.muted = true
            res.save()
        })
    }
    setTimeout(function() {
        try {
            tomute.roles.remove(muterole.id);
            User.findOne({discordId: tomute.id}).then((res) => {
                res.muted = false
                res.save()
            })
        } catch (e) {
            console.log(e)
        }
    }, ms(time) !== undefined ? ms(time) : 2147483647);
}
module.exports.help = {
    name: "mute",
    usage: `mute <user> [time]`,
    description: "Mute a user in the guild",
    aliases: ["stfu", "shutup"],
    category: "moderation",
    args: true
}
