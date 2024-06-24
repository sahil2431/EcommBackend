
const bcrypt = require("bcryptjs")
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();

exports.signup = async (req , res)=>{
    const request_body = req.body

    const userObj = {
        name : request_body.name ,
        userId : request_body.userId ,
        userType : request_body.userType,
        email : request_body.email ,
        password : bcrypt.hashSync(request_body.password , 8),
        mobile : request_body.mobile
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
        
        res.status(200).send({
            userDetails : res_user,
            message : "User is registered successfully. Check your email for verification"
        });
    }catch(err) {
        console.log("Error while registering the user" , err)
        res.status(500).send({
            message : "Error while registering the user"
        })
    }
}

exports.signin = async (req , res)=>{
    try {
        
        const user = await user_model.findOne({userId : req.body.userId})
    
        const token = jwt.sign({id : user.userId} , process.env.JWT_SECRET , {
            expiresIn : 1200
        })
        res.status(200).send({
            name : user.name ,
            userId : user.userId , 
            email : user.email,
            accessToken : token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message : "Error while signing in"
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await user_model.findOneAndDelete({ userId: req.userId });
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

exports.verifyEmailLink = async (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(403).send({
            message: "No token found : Unauthorized"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                
                message: "Link is expired or invalid! Press below to resend link"
            })
        }
        const user = await user_model.findOne({ email: decoded.id })
        user.emailVerified = true
        await user.save()
        
    res.status(200).send({
        user : user.name,
            message: "Email verified successfully"
        })
    })
}

exports.isAdmin = (req, res, next) => {
    const user = req.user
    if (user && user.userType == "ADMIN") {
        res.status(200).send({
            admin : true,
            message: "Admin user is authorized for this endpoint"
        })
    }
    else {
        admin = false;
        return res.status(200).send({
            admin : false,
            message: "Only admin users are authorized for this endpoint"
        })
    }
}
        