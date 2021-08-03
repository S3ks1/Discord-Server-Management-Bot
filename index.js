const fs = require("fs")
const Discord = require("discord.js")
const ms = require("ms")
const moment = require("moment")
const config = require("./config")
const mongoose = require("mongoose")
const { GiveawaysManager } = require('discord-giveaways');
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]})
const cooldowns = new Set()
client.aliases = new Discord.Collection()
client.commands = new Discord.Collection()
client.vcTime = new Map()

const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    updateCountdownEvery: 600000,
    hasGuildMembersIntent: false,
    default: {
        botsCanWin: false,
        exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
        embedColor: '#36393E',
        reaction: '🎉'
    }
});

client.giveaways = manager

const User = require("./schemas/User")
const Ticket = require("./schemas/Ticket")
const Guild = require("./schemas/Guild")
const Perms = require("./schemas/Perms")
const React = require("./schemas/React")
const TicketEmbed = require("./schemas/TicketEmbed")
const Suggestion = require("./schemas/Suggestion")
const Case = require("./schemas/Case")
const Commandchannel = require("./schemas/Commandchannel")

mongoose.connect(config.mongoURL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then((lol) => {
    console.log("✔️  Connected to Mongo DB")
}).catch((err) => {
    console.log(err)
})


fs.readdir("./events/", (err,files) => {
    if(err) console.log(err)
    let events = files.filter(f => f.split(".").pop() === "js")
    if(events.length <= 0) return console.log("❌ No events to load!")
    events.forEach((f, i) => {
        require(`./events/${f}`);
    })
})



fs.readdir("./commands", (err, files) => {
    if(err) console.log(err)
    let cmdfiles = files.filter(f => f.split(".").pop() === "js")
    if(cmdfiles.length <= 0) return console.log("❌ No commands to load")
    cmdfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`)
        client.commands.set(props.help.name, props)
        if(props.help.aliases){
            props.help.aliases.forEach(a => {
                //console.log(props)
                client.aliases.set(a, props.help.name)
            })
        }
    })
})

module.exports = {
    client,
    cooldowns,
    Discord,
    config,
    fs,
    ms,
    moment,
    User: User, 
    Ticket: Ticket,
    Guild: Guild,
    Perms: Perms,
    React: React,
    TicketEmbed: TicketEmbed,
    Suggestion: Suggestion,
    Case: Case,
    Commandchannel: Commandchannel
}

client.login(config.token).catch((err) => {console.log("Invalid Token")})