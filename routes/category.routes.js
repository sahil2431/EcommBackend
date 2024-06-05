const category_controller = require("../controllers/category.controller")
const authUser = require("../middlewares/auth.mw")
module.exports = (app) =>{
    
    app.post("/ecom/api/v1/categories" ,[authUser.verifyToken , authUser.isAdmin] , category_controller.createNewCategory)

    app.get("/ecom/api/v1/getcategories",[authUser.verifyToken] , category_controller.getAllcatgories)

    app.delete("/ecom/api/v1/deleteCategory" ,[authUser.verifyToken , authUser.isAdmin] , category_controller.deleteCategory)
}