const {Router} = require("express")
const product_controller = require("../controllers/product.controller")
const authUser = require("../middlewares/user.mw")
const productMW = require("../middlewares/product.mw")
const multerMW = require("../middlewares/multer.mw")


const router = Router()
router.route("/create").post(
    multerMW.upload.array("file"),
    authUser.verifyToken,
    authUser.isAdmin,
    productMW.verifyProductBody,
    product_controller.create_product
)

router.route("/get").get(
    authUser.verifyToken,
    product_controller.getAllProducts
)

router.route("/delete").delete(
    authUser.verifyToken,
    authUser.isAdmin,
    productMW.verifyProductBody,
    product_controller.deleteProduct
)

router.route("/update").patch(
    authUser.verifyToken,
    authUser.isAdmin,
    product_controller.updateProduct
)

module.exports = router;
