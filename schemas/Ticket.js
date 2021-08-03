const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ticketSchema = new Schema({
    ticketName:{
        type: String,
        required: true,
        index: true
    },
    ticketNumber:{
        type: Number,
        required: true
    },
    discordId:{
        type: String,
        required: true
    },
    discordTag:{
        type: String,
        required: true
    },
    guildId:{
        type: String,
        required: true
    },
    ticketLog:{
        type: Array,
        required: true,
        default: []
    },
    ticketOpen:{
        type: Boolean,
        required: true
    },
    channelId:{
        type: String,
        required: true
    }
}) 

const Ticket = mongoose.model("Ticket", ticketSchema)

module.exports = Ticket