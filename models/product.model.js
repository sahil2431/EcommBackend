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

    rating : {
        total  : {type : Number , default : 0},
        numberOfRatings : {type : Number , default : 0},
        averageRating : {type: mongoose.Schema.Types.Decimal128, default: 0.0}
    },

    images : [{
        type : String
    }]
}, {timestamps : true , versionKey : false})

module.exports = mongoose.model("Product" , product_schema)