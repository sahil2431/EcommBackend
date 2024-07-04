const orderModels = require("../models/order.model")
const cartModels = require("../models/cart.model")
const {ApiError} = require("../utils/ApiError");
const verifyOrderBody = async (req, res, next) => {
    if (!req.body.address) {
        const order = await orderModels.findOne({ userId: req.userId })
        if (order) {
            req.body.address = order.address
        }
        else {
            throw new ApiError(400 , "Address is required")
        }
    }
    try {
        const cartData = await cartModels.find({ userId: req.userId })
        if (cartData.length == 0) {
            throw new ApiError(400 , "Cart is empty")
        }
        req.body.productId = []
        req.body.quantity = []
        req.body.price = []
        req.body.cartValue = 0
        cartData.forEach(element => {
            req.body.productId.push(element.productId)
            req.body.quantity.push(element.quantity)
            req.body.price.push(element.price)
            req.body.cartValue += element.price
        });
        next()

    } catch (error) {
        throw new ApiError(500 ,"Error while fwtching cart" , ApiError.message)
    }

}

module.exports = {
    verifyOrderBody
}
