const dotenv = require('dotenv'); 
const db = require('./db/index')
const {app} = require("./app")
dotenv.config()


db.connectDB()
.then(() =>{
    app.listen(process.env.PORT , ()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
})
.catch((err) =>{
    console.log("Mongo DB connection failed!!" , err)
})
