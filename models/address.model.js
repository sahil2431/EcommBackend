const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    name : {
        type : String,
        required : true
    },

    address1 : {
        type : String,
        required : true
    },

    address2 : {
        type : String,
    },

    district : {
        type : String,
        required : true
    },

    state : {
        type : String,
        required : true
    },
    
    pincode : {
        type : String,
        required : true
    },

    phone : {
        type : Number,
        required : true
    }
} , {timestamps : true , versionKey: false})

module.exports = mongoose.model("Address" , addressSchema)