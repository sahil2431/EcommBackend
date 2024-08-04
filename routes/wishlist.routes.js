const wishlistController = require("../controllers/wishlist.controller")
const {verifyToken} = require("../middlewares/user.mw")
const {Router} = require("express")


const router = Router()

router.route("/add").post( verifyToken, wishlistController.addItem )

router.route("/remove").delete( verifyToken, wishlistController.removeItem )

router.route("/getProducts").get( verifyToken, wishlistController.getWishlistedProducts )

module.exports = router