

const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
        unique : true ,
    } ,
    productNumber : {
        type : Number ,
        default : 0
    }
},{timestamps : true , versionKey : false})

module.exports = mongoose.model("Category" , categorySchema)