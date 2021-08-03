const mongoose = require("mongoose")
const Schema = mongoose.Schema

const caseSchema = new Schema({
    user:{
        type: String, 
        required: true
    }, 
    moderator:{
        type: String, 
        required: true
    },
    punishment:{
        type: String, 
        required: true
    },
    caseNumber:{
        type: Number,
        required: true
    }
})

const Case = mongoose.model("Case", caseSchema)

module.exports = Case