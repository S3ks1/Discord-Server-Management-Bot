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
    let channel
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
        let embed = new Discord.MessageEmbed().setColor(message.embedColor).setTimestamp().setDescription(`:warning: No Time Provided`)
        message.channel.send({
            embed
        });
        return;
    }
    if(!msgargs[2]){
        let embed = new Discord.MessageEmbed().setColor(message.embedColor).setTimestamp().setDescription(`:warning: No # of winners provided`)
        message.channel.send({
            embed
        });
        return;
    }
    if(!msgargs.slice(3).join(" ")){
        let embed = new Discord.MessageEmbed().setColor(message.embedColor).setTimestamp().setDescription(`:warning: No Prize Provided`)
        message.channel.send({
            embed
        });
        return;
    }
    client.giveaways.start(message.guild.channels.cache.get(channel), {
        time: ms(msgargs[1]),
        prize: msgargs.slice(3).join(" "),
        winnerCount: parseInt(msgargs[2]),
        messages:{
            giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
            giveawayEnded: '🎉🎉 **GIVEAWAY ENDED** 🎉🎉',
            timeRemaining: 'Time remaining: **{duration}**!',
            inviteToParticipate: 'React with 🎉 to participate!',
            winMessage: 'Congratulations, {winners}! You won **{prize}**!\n{messageURL}',
            embedFooter: `${message.guild.name} Giveaways`,
            noWinner: 'Giveaway cancelled, no valid participants.',
            hostedBy: 'Hosted by: {user}',
            winners: 'winner(s)',
            endedAt: 'Ended at',
            units: {
                seconds: 'seconds',
                minutes: 'minutes',
                hours: 'hours',
                days: 'days',
                pluralS: false
            }
        }
    }).then((lol) => {
    })
    let embed = new Discord.MessageEmbed().setColor(message.embedColor).setTimestamp().setDescription(`:ok_hand: Started a giveaway in ${channel} for \`${msgargs.slice(3).join(" ")}\` with ${msgargs[2]} winners`)
    message.channel.send({
        embed
    });

}
module.exports.help = {
    name: "gstart",
    description: "Start a giveaway",
    usage: `gstart <channel> <time> <# of winners> <reward>`,
    aliases: ["giveawaystart"],
    category: "administrator",
    args: true
}