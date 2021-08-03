const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    discordId:{
        type: String, 
        required: true,
        unique: true
    }, 
    profilePoints:[
            {
                guildId:{
                    type: String,
                    required: true
                },
                points: {
                    type: Number,
                    required: true,
                    default: 0
                },
                level: {
                    type: Number,
                    required: true,
                    default: 0
                },
                totalxp: {
                    type: Number,
                    required: true,
                    default: 0
                }
            }],
    tStats:[
        {
            guildId:{
                type: String,
                required: true
            },
            ticketsOpened:{
                type: Number,
                required: true,
                default: 0
            },
            ticketsClosed:{
                type: Number,
                required: true,
                default: 0
            }
        }
    ],
    vcTime:{
        type: Number,
        required: true,
        default: 0
    },
    muted:{
        type: Boolean,
        required: true,
        default: false
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User