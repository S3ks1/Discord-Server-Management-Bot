const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reactSchema = new Schema({
    messageId: {
        type: String, 
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    reactionId: {
        type: String,
        required: true
    }
}) 

const React = mongoose.model("React", reactSchema)

module.exports = React