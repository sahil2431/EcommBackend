const {Router} = require("express")
const cartController = require("../controllers/cart.controller")
const {verifyToken} = require("../middlewares/user.mw")
const cartMW = require("../middlewares/cart.mw")

const router = Router() 
router.route("/addItem").post(
    verifyToken,
    cartMW.verifyCartBody,
    cartController.addCart
)

router.route("/clear").delete(
    verifyToken,
    cartController.clearCart
)

router.route("/get").get(
    verifyToken,
    cartController.getCartItems
)

router.route("/updateQuantity").patch(
    verifyToken,
    cartController.updateQuantity
)

router.route("/removeItem").delete(
    verifyToken,
    cartController.removeItem
)

module.exports = router;