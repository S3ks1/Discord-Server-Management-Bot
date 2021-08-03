const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commandchannelSchema = new Schema({
    channelId:{
        type: String,
        required: true
    }
})

const Commandchannel = mongoose.model("Commandchannel", commandchannelSchema)

module.exports = Commandchannel