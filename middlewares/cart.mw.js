const cartModel = require("../models/cart.model")
const productModel = require("../models/product.model")
const verifyCartBody = async (req, res, next) => {

    if (!req.body.productId) {
        return res.status(400).send({
            message: "Failed! NO productId entered"
        })
    }
    if (!req.body.quantity) {
        return res.status(400).send({
            message: "Failed! NO quantity entered"
        })
    }
    const product = await productModel.findOne({ _id: req.body.productId, quantityAvailable: { $gt: 0 } })
    if (!product) {
        return res.status(404).send({
            message: "Product not found or Not available"
        })
    }
    if (product.quantityAvailable < req.body.quantity) {
        return res.status(400).send({
            message: "Failed! quantity is greater than available quantity"
        })
    }

    req.product = product
    next()

}

module.exports = {
    verifyCartBody
}