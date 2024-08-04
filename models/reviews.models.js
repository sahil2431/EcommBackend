const mongoose = require("mongoose")

const reviewsSchema = new mongoose.Schema({

    reviewdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },

    reviewdProduct : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    },

    rating : {
        type : Number,
        required : true,
        min : 1,
        max : 5
    } ,

    review : {
        type : String,
    }

} ,{timestamps : true , versionKey : false} )

module.exports = mongoose.model("Review" , reviewsSchema)