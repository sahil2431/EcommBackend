const orderController = require("../controllers/order.controller")
const orderMw = require("../middlewares/order.mw")
const authMw = require("../middlewares/auth.mw")

module.exports = (app) => {
    app.post("/ecom/api/v1/order/confirm", [authMw.verifyToken, orderMw.verifyOrderBody], orderController.confirmOrder)
}