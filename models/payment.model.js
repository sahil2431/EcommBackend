const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    paymentType: {
        type: String,
        required: true,
        enum: ["COD", "ONLINE"]
    },

    paymentStatus: {
        type: String,
        default: "Pending"
    },

    razorpayPaymentId: {
        type: String
    },
    razorpayOrderId: {
        type: String
    },

}, { timestamps: true, versionKey: false })

module.exports = mongoose.model("Payment", paymentSchema)
