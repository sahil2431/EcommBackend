const dotenv = require('dotenv');
dotenv.config() 
const db = require('./db/index')
const {app} = require("./app")



db.connectDB()
.then(() =>{
    app.listen(process.env.PORT , ()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
})
.catch((err) =>{
    console.log("Mongo DB connection failed!!" , err)
})
