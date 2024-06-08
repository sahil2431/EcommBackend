const authControl = require("../controllers/auth.controller")
const authUser = require("../middlewares/auth.mw")
const verifyEmail = require("../middlewares/verifyEmail.mw")

module.exports = (app) =>{
    app.post("/ecom/api/v1/auth/signup" ,[authUser.verifySignUpBody , verifyEmail.sendVerificationEmail], authControl.signup)

    app.post("/ecom/api/v1/auth/signin" ,[authUser.verifySignInBody] , authControl.signin)

    app.delete("/ecom/api/v1/auth/delete/" , [authUser.verifyToken] , authControl.deleteUser)

    app.get("/ecom/api/v1/auth/verify/" ,[verifyEmail.emailVerified] , authControl.verifyEmailLink)
}
