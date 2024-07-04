const {Router} = require("express")
const user_controller = require("../controllers/user.controller")
const {verifySignInBody , verifySignUpBody , verifyToken } = require("../middlewares/user.mw")


const router = Router()
router.route("/signup").post(
    verifySignUpBody,
    user_controller.signup

),

router.route("/signin").post(
    verifySignInBody,
    user_controller.signin
),

router.route("/delete").delete(
    verifyToken,
    user_controller.deleteUser
),
router.route("/emailVerify").post(
    
    user_controller.verifyEmailLink
),


router.route("/resendEmailVerificationLink").post(
    user_controller.resendEmailVerificationLink
),

router.route("/refreshToken").post(
    user_controller.refreshToken
),

router.route("/update").patch(
    verifyToken,
    user_controller.updateUserDetails
),

router.route("/updatePassword").patch(
    verifyToken,
    user_controller.updatePassword
)

router.route("/logout").post(
    verifyToken,
    user_controller.logout
)

module.exports = router
