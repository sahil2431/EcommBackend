const mongoose = require("mongoose")

const product_schema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
        unique : true
    } ,

    description : {
        type : String 
    },

    price : {
        type : Number ,
        required : true ,

    } ,

    category : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Category" ,
        required : true
    } ,

    quantityAvailable : {
        type : Number ,
        required : true
    } ,

    images : [{
        type : String
    }]
}, {timestamps : true , versionKey : false})

module.exports = mongoose.model("Product" , product_schema)