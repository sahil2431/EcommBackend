const cartModel = require("../models/cart.model")
const productModel = require("../models/product.model")
const {ApiError} = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const mongoose = require('mongoose');

const verifyCartBody = asyncHandler( async (req, res, next) => {
    const {productId, quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid productId format");
    }
    if (!productId) {
        throw new ApiError(400, "Failed! NO productId entered")
    }
    const product = await productModel.findOne({ _id: productId , quantityAvailable: { $gt: 0 } })
    if (!product) {
        throw new ApiError(400, "Failed! Product not found or not available")
    }
    if (product.quantityAvailable < quantity) {
        throw new ApiError(400, "Failed! Quantity is not available")
    }

    req.product = product
    next()

})

module.exports = {
    verifyCartBody
}