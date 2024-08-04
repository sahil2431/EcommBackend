const {Router} = require("express")
const {verifyToken} = require("../middlewares/user.mw")
const { addReview, editReview, getAllReviewsOfUser } = require("../controllers/reviews.controller")

const router = Router()

router.route("/create").post(verifyToken , addReview)

router.route("/edit").patch(verifyToken , editReview)

router.route("/getUserReviews").get(verifyToken , getAllReviewsOfUser)

module.exports = router