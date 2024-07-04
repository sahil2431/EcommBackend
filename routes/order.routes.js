const { Router } = require("express")
const orderController = require("../controllers/order.controller")
const orderMw = require("../middlewares/order.mw")
const authMw = require("../middlewares/user.mw")

const router = Router()

router.route("/create").post( 
    authMw.verifyToken, 
    orderMw.verifyOrderBody, 
    orderController.confirmOrder
)

module.exports = router;