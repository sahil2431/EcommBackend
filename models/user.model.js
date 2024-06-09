const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    name:{
        type : String,
        required : true
    },
    userId :{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String ,
        required : true,
        lowercase : true,
        minLength : 10 ,
        unique : true
    },

    mobile : {
        type : String ,
        required : true,
        unique : true
    },
    userType : {
        type : String,
        default : "CUSTOMER",
        enum : ["CUSTOMER" , "ADMIN"]
    } ,
    emailVerified : {
        type : Boolean,
        default :function() {
            return this.userType == "ADMIN";
        }
    },
    mobileVerified : {
        type : Boolean,
        default :function() {
            return this.userType == "ADMIN";
        }
    }


},{timestamps : true , versionKey : false})

module.exports = mongoose.model("User" , userSchema)