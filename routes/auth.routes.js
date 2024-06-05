const authControl = require("../controllers/auth.controller")
const authUser = require("../middlewares/auth.mw")

module.exports = (app) =>{
    app.post("/ecom/api/v1/auth/signup" ,[authUser.verifySignUpBody], authControl.signup)

    app.post("/ecom/api/v1/auth/signin" ,[authUser.verifySignInBody] , authControl.signin)

    app.delete("/ecom/api/v1/auth/delete/:userId" , [authUser.verifyToken] , authControl.deleteUser)
}
