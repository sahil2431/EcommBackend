const product_controller = require("../controllers/product.controller")
const authUser = require("../middlewares/auth.mw")

module.exports = (app) => {
    app.post("/ecom/api/v1/createProduct/" , [authUser.verifyToken ,authUser.isAdmin] , product_controller.create_product)
    app.get("/ecom/api/v1/getProducts/" , [authUser.verifyToken], product_controller.getAllProducts)

    app.delete("/ecom/api/v1/deleteProduct/" , [authUser.verifyToken, authUser.isAdmin] , product_controller.deleteProduct)
}
