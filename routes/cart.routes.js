const {Router} = require("express")
const cartController = require("../controllers/cart.controller")
const authMw = require("../middlewares/user.mw")
const cartMW = require("../middlewares/cart.mw")

const router = Router() 
router.route("/add").post(
    authMw.verifyToken,
    cartMW.verifyCartBody,
    cartController.addCart
)

router.route("/clear").delete(
    authMw.verifyToken,
    cartController.clearCart
)

router.route("/get").get(
    authMw.verifyToken,
    cartController.getCartItems
)

module.exports = router;