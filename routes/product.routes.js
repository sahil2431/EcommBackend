const {Router} = require("express")
const product_controller = require("../controllers/product.controller")
const authUser = require("../middlewares/user.mw")
const productMW = require("../middlewares/product.mw")
const multerMW = require("../middlewares/multer.mw")


const router = Router()
router.route("/create").post(
    multerMW.upload.array("images"),
    authUser.verifyToken,
    authUser.isAdmin,
    productMW.verifyProductBody,
    product_controller.create_product
)

router.route("/getAllProducts").get(
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

router.route("/productDetails").post(
    product_controller.productDetails
)

router.route("/filterProducts").post(product_controller.filterProducts)

router.route("/getProductByCategory").post(product_controller.getProductByCategory)

router.route("/search").post(product_controller.searchProductBysearch)

module.exports = router;
