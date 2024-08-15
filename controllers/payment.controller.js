const razorpayInstance = require("../configs/razorpay");
const {ApiError} = require("../utils/ApiError");
const {ApiResponse} = require("../utils/ApiResponse");
const {v4: uuidv4} = require("uuid");
const {asyncHandler} = require("../utils/asyncHandler");
const crypto = require("crypto")
const payntModel = require("../models/payment.model");

const createOrder = asyncHandler(async (req, res) => {
    const {amount , currency } = req.body;
    if(!amount || !currency) {
        return res.status(400).json(new ApiResponse(400, "Invalid request"))
    }
    const receipt = uuidv4();
    try {
        const options = {
            amount: amount * 100,
            currency,
            receipt,
            
        }

        const order = await razorpayInstance.orders.create(options);
        if(!order) {
            return res.status(500).json(new ApiResponse(500, "Internal server error"));
        }
        return res.status(200).json(new ApiResponse(200, "Order created successfully", order));
    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error");
    }
})

const verifySignature  = asyncHandler(async (req, res)=> {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature , orderId} = req.body;

    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
       .digest("hex");

    if(generatedSignature !== razorpay_signature) {
        return res.status(400).json(new ApiResponse(400, "Invalid signature"));
    }

    const payment = await payntModel.create({
        userId: req.user._id,
        orderId: orderId,
        paymentType: "ONLINE",
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paymentStatus: "Success"
    })
    return res.status(200).json(new ApiResponse(200, "Signature verified" , payment));
} )

module.exports = {
    createOrder,
    verifySignature
}