const {verifyToken} = require("../middlewares/user.mw")
const {addAddress , deleteAddress , getAllAddress} = require("../controllers/address.controller")
const {Router} = require("express")

const router = Router()

router.route("/add").post(verifyToken , addAddress)

router.route("/delete").delete(verifyToken , deleteAddress)

router.route("/getAddress").get(verifyToken , getAllAddress)

module.exports = router