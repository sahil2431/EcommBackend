const express = require("express")
const body_parser = require("body-parser")
const mongoose = require("mongoose")
const user_model = require("./models/user.model")
const bcrypt = require("bcryptjs")
const dotenv = require('dotenv');
const cors = require("cors")  

let gfs;



dotenv.config();



//Middleware for product and category

const app = express()
app.use(body_parser.json())
app.use(cors())

app.use(express.json())

const mongo_url = process.env.MONGODB_URI;
console.log(mongo_url);
const mongoDbName = process.env.MONGODB_DB_NAME;
console.log(mongoDbName);

//Connection with mongo
mongoose.connect(`${mongo_url}/${mongoDbName}`)

const db = mongoose.connection

db.on("error" , () =>{
    console.log("Error while connecting to the mongo DB")
})
db.once("open" , ()=>{
    console.log("Connect to MongoDB")
    init()
})
async function init() {
    const user = await user_model.findOne({userId : "admin"})
    try {
        if(user) {
            console.log("Admin is present")
            return
        }

    }catch(err){
        console.log("Error while reading the data" , err)
    }

    try{
        const user = await user_model.create({
            name : process.env.ADMIN_NAME,
            userId : "admin",
            email : process.env.ADMIN_EMAIL,
            userType : "ADMIN",
            password : bcrypt.hashSync(process.env.ADMIN_PASSWORD ,8) 
        })
        console.log("Admin created succesfully" , user)
    }catch(err){
        console.log("Error while create admin" , err)
    }
}


require("./routes/auth.routes")(app)
require("./routes/category.routes")(app)
require("./routes/product.routes")(app)
require("./routes/cart.routes")(app)
require("./routes/order.routes")(app)

const port = process.env.PORT
app.listen(port , ()=>{
    console.log("Server started at port num : ", port)
})