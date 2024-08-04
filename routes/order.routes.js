const { Router } = require("express")
const orderController = require("../controllers/order.controller")
const {verifyToken} = require("../middlewares/user.mw")

const router = Router()

router.route("/create").post( 
    verifyToken, 
    orderController.confirmOrder
)

router.route("/getAll").get(
    verifyToken,
    orderController.getAllOrders
)

router.route("/getOrderById/:orderId/:productId").get(
    verifyToken,
    orderController.getOrderById
)

router.route("/cancel").post(
    verifyToken,
    orderController.cancelOrder
)

module.exports = router;