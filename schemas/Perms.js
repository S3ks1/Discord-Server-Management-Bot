const mongoose = require("mongoose")
const Schema = mongoose.Schema

const permsSchema = new Schema({
    commandName:{
        type: String,
        required: true
    },
    roles:{
        type: Array,
        required: true,
        default: []
    },
    users:{
        type: Array,
        required: true,
        default: []
    },
    permissions:{
        type: Array, 
        required: true,
        default: []
    }
})

const Perms = mongoose.model("Perms", permsSchema)

module.exports = Perms

