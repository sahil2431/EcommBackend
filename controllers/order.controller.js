const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const orderModel = require("../models/order.model")
const productModel = require("../models/product.model")
const cartModel = require("../models/cart.model")
const { asyncHandler } = require("../utils/asyncHandler");
const confirmOrder = asyncHandler( async(req , res)=>{
    const orderDetails  = {
        userId : req.userId,
        address : req.body.address,
        productId : req.body.productId,
        quantity : req.body.quantity,
        price : req.body.price,
        cartValue : req.body.cartValue,


    }

    try{
        for(let i = 0 ; i<orderDetails.productId.length ; i++){
            const product = await productModel.findById(orderDetails.productId[i])
            product.quantityAvailable -= orderDetails.quantity[i]
            await product.save()
        }
        const order = await orderModel.create(orderDetails)
        await cartModel.deleteMany({userId : req.userId})
        res.status(200).send(
            new ApiResponse(200, "Order placed successfully", order)
        )
    }catch(err) {
        throw new ApiError(500, "Error while placing order" , err); 
    }
})

module.exports = {
    confirmOrder
}