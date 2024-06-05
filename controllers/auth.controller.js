
const bcrypt = require("bcryptjs")
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

//verify email is in progress
//invalid login credential



exports.signup = async (req , res)=>{
    const request_body = req.body

    const userObj = {
        name : request_body.name ,
        userId : request_body.userId ,
        userType : request_body.userType,
        email : request_body.email ,
        password : bcrypt.hashSync(request_body.password , 8)
    }
    try{
        const user = await user_model.create(userObj)
        const res_user = {
            name : user.name,
            email : user.email,
            userType : user.userType,
            userId : user.userId,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt
        }
        
        res.status(200).send(res_user);
    }catch(err) {
        console.log("Error while registering the user" , err)
        res.status(500).send({
            message : "Error while registering the user"
        })
    }
}

exports.signin = async (req , res)=>{
    const user = await user_model.findOne({userId : req.body.userId})

    const token = jwt.sign({id : user.userId} , process.env.JWT_SECRET , {
        expiresIn : 120
    })
    res.status(200).send({
        name : user.name ,
        userId : user.userId , 
        email : user.email,
        accessToken : token
    })
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await user_model.findOneAndDelete({ userId: req.body.userId });
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }
        res.status(200).send({
            message: "User deleted succesfully"
        })
    }catch(err) {
        console.log(err)
        res.status(500).send({
            message : "Ther was problem in deleting the user"
        })
    }
}