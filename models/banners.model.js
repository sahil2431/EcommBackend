const mongoose = require("mongoose")

const bannersSchema = new mongoose.Schema({
    images : [{
        type : String,
    }]
} , {timestamps : true , versionKey : false})

module.exports = mongoose.model("banner" , bannersSchema)