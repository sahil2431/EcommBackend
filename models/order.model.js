const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    } , 
    address : {
        address: { type: String  , required: true },
        city: { type: String  , required: true },
        state: { type: String  , required: true },
        pincode: { type: Number  , required: true },
        landmark: { type: String   }
    },

    productId : [{
        type : String,
        required : true
    }] , 

    quantity : [{
        type : Number,
        required : true
    }] ,
    
    price : [{
        type : Number,
        required : true
    }] ,



    cartValue : {
        type : Number ,
        required : true
    } ,

    status : {
        type : String,
        default : "Pending"
    }
})

module.exports = mongoose.model("Order" , orderSchema)
