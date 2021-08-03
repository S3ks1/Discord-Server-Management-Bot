const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId



const guildSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    prefix: {
        type: String, 
        required: true,
        default: "."
    }, 
    logChannel: {
        type: String,
        required: false,
        default: "welcome"
    },
    embedColor:{
        type: String,
        required: true,
        default: "#36393E"
    },
    commandCooldown:{
        type: Number, 
        required: true,
        default: 1
    },
    privateVoiceChannel:{
        type: String,
        required: false,
        default: "Join to Create"
    },
    supportRole: {
        type: String, 
        required: false,
        default: "Support"
    },
    defaultRole: {
        type: String,
        required: false,
        default: "Member"
    },
    factionLeaderRole: {
        type: String,
        required: false,
        default: "Faction Leader"
    },
    ticketLogChannel: {
        type: String, 
        required: false, 
        default: "ticket-logs"
    },
    promoteChannel:{
        type: String,
        required: false,
        default: "staff-movements"
    },
    messageLogChannel: {
        type: String,
        required: false,
        default: "message-logs"
    },
    commandLogChannel: {
        type: String, 
        required: false,
        default: "cmd-logs"
    },
    botLogChannel: {
        type: String, 
        required: false,
        default: "bot-logs"
    },
    suggestionChannel:{
        type: String, 
        required: false,
        default: "pending-suggestions"
    },
    acceptedChannel:{
        type: String, 
        required: false,
        default: "accepted-suggestions"
    },
    deniedChannel:{
        type: String, 
        required: false,
        default: "denied-suggestions"
    },
    nickNameFormat:{
        type: String,
        required: true,
        default: "[%username%] %var%"
    }

})

const Guild = mongoose.model("Guild", guildSchema)

module.exports = Guild