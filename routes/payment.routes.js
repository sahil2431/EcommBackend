const {createOrder, verifySignature} = require("../controllers/payment.controller");
const {verifyToken} = require("../middlewares/user.mw")
const router = require("express").Router();

router.route("/create-order").post(
    verifyToken,
    createOrder
)
router.route("/verify-payment").post(
    verifyToken,
    verifySignature
)

module.exports = router;