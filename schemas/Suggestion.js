const mongoose = require("mongoose")
const Schema = mongoose.Schema

const suggestionSchema = new Schema({
    discordId:{
        type: String, 
        required: true
    }, 
    suggestionNumber:{
        type: Number,
        required: true,
        default: 1
    },
    guildId:{
        type: String,
        required: true
    },
    suggestionContent:{
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true
    }
})

const Suggestion = mongoose.model("Suggestion", suggestionSchema)

module.exports = Suggestion