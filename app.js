const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express()

//Use to connnect with frontend ports
app.use(cors)

app.use(express.json())  //sets the limit of json body 
app.use(express.urlencoded({extended : true}))   //encode the url for spaces
app.use(express.static("public"))  //Store files in public directory temporary
app.use(cookieParser())  //helps to perform crud operation in the cookies of user

//routers
const userRouter  = require("./routes/user.routes")
const categoryRouter = require("./routes/category.routes")
const productRouter = require("./routes/product.routes")
const cartRouter = require("./routes/cart.routes")
const orderRouter = require("./routes/order.routes")


app.use("/ecomm/api/v1/users", userRouter)
app.use("/ecomm/api/v1/category", categoryRouter)
app.use("/ecomm/api/v1/product", productRouter)
app.use("/ecomm/api/v1/cart", cartRouter)
app.use("/ecomm/api/v1/order", orderRouter)


module.exports = {app}