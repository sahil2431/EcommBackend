const {Router} = require("express")
const category_controller = require("../controllers/category.controller")
const authUser = require("../middlewares/user.mw")
const categoryMW = require("../middlewares/category.mw")

const router = Router()

router.route("/create").post(
    authUser.verifyToken,
    authUser.isAdmin,
    categoryMW.verifyCategoryBody,
    category_controller.createNewCategory
)

router.route("/get").get(
    category_controller.getAllcatgories
)

router.route("/delete").delete(
    authUser.verifyToken,
    authUser.isAdmin,
    categoryMW.verifyCategoryDeleteBody,
    category_controller.deleteCategory
)



module.exports = router