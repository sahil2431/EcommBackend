const orderModels = require("../models/order.model")
const cartModels = require("../models/cart.model")
const verifyOrderBody = async (req, res, next) => {
    if (!req.body.address) {
        const order = await orderModels.findOne({ userId: req.userId })
        if (order) {
            req.body.address = order.address
        }
        else {
            return res.status(400).send({
                message: "Enter address first"
            })
        }
    }
    try {
        const cartData = await cartModels.find({ userId: req.userId })
        if (cartData.length == 0) {
            return res.status(400).send({
                message: "Cart is empty"
            })
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
        return res.status(500).send({
            message: "Error while fetching cart data"
        })
    }

}

module.exports = {
    verifyOrderBody
}
