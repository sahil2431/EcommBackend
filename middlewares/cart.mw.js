const cartModel = require("../models/cart.model")
const productModel = require("../models/product.model")
const {ApiError} = require("../utils/ApiError");
const verifyCartBody = async (req, res, next) => {
    const {productId, quantity } = req.body;

    if (!productId) {
        throw new ApiError(400, "Failed! NO productId entered")
    }
    if (!quantity) {
        throw new ApiError(400, "Failed! NO quantity entered")
    }
    const product = await productModel.findOne({ _id: req.body.productId, quantityAvailable: { $gt: 0 } })
    if (!product) {
        throw new ApiError(400, "Failed! Product not found or not available")
    }
    if (product.quantityAvailable < req.body.quantity) {
        throw new ApiError(400, "Failed! Quantity is not available")
    }

    req.product = product
    next()

}

module.exports = {
    verifyCartBody
}