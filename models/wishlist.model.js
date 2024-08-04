const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema({
    wishlistBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    wishlistedProduct : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    }


}, {timestamps : true , versionKey : false})

module.exports = mongoose.model("Wishlist" , wishlistSchema)