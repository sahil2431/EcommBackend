const mongoose = require("mongoose");
const user_model = require("../models/user.model")
const bcrypt = require("bcryptjs")
const {ApiError} = require("../utils/ApiError")
const adminCreation = async () =>{
    const user = await user_model.findOne({userId : "admin"})
    try {
        if(user) {
            console.log("Admin is present")
            return
        }

    }catch(err){
        throw new ApiError(500 , "Error while reading the data" , err) 
    }

    try{
        const user = await user_model.create({
            name : process.env.ADMIN_NAME,
            userId : "admin",
            email : process.env.ADMIN_EMAIL,
            userType : "ADMIN",
            password : process.env.ADMIN_PASSWORD ,
            mobile : process.env.ADMIN_MOBILE,

        })
        console.log("Admin created succesfully" , user)
    }catch(err){
        throw new ApiError(500 , "Error while create admin" , err)
    }
}
const connectDB = async() =>{
    try {
        
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`) 
        console.log("MongoDB connected !! " , conn.connection.name)
        await adminCreation()
    } catch (error) {
        console.log("Connection FAILED! " , error)
        process.exit(1) 
    }
}

module.exports = {connectDB}