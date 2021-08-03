const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ticketEmbedSchema = new Schema({
    messageId: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: true,
        default: []
    },
    reactions: {
        type: Array,
        required: true,
        default: []
    }
}) 

const TicketEmbed = mongoose.model("TicketEmbed", ticketEmbedSchema)

module.exports = TicketEmbed