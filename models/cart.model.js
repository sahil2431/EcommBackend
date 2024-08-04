const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required: true

    },

    price: {
        type: Number,
        required: true,
    },

    quantity: {
        type: Number,
        default : 1,
    } ,

} , {timestamps : true , versionKey : false} )

module.exports = mongoose.model("Cart" , cartSchema)