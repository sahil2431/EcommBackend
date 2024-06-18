const cartController = require("../controllers/cart.controller")
const authMw = require("../middlewares/auth.mw")
const cartMW = require("../middlewares/cart.mw")
module.exports = (app) =>{
    app.post("/ecom/api/v1/auth/cart/add" ,[authMw.verifyToken , cartMW.verifyCartBody] , cartController.addCart )
    app.post("/ecom/api/v1/auth/cart/clear" , [authMw.verifyToken] , cartController.clearCart)
    app.get("/ecom/api/v1/auth/cart" , [authMw.verifyToken] , cartController.getCartItems)
}