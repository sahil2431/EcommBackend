const user_model = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();
const verifySignUpBody = async (req, res, next) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({
                message: "Failed! NO name entered"
            })
        }

        if (!req.body.email) {
            return res.status(400).send({
                message: "Failed! NO email entered"
            })
        }
        if (!req.body.password) {
            return res.status(400).send({
                message: "Failed! NO password entered"
            })
        }

        if(!req.body.mobile){
            return res.status(400).send({
                message: "Failed! NO mobile number entered"
            })
        }

        if (!req.body.userId) {
            return res.status(400).send({
                message: "Failed! NO userId entered"
            })
        }

        const userId = await user_model.findOne({ userId: req.body.userId })
        const emailExists = await user_model.findOne({ email: req.body.email })
        const mobileExists = await user_model.findOne({ mobile: req.body.mobile })
        if (userId ||  emailExists || mobileExists) {
            return res.status(400).send({
                message: "Failed! userId or email is already present"
            })
        }
        next()


    } catch (err) {
        console.log("error while validating", err)
        return res.status(500).send({

            message: "Server Error"
        })
    }
}

const verifySignInBody = async (req, res, next) => {
    if (!req.body.userId) {
        return res.status(400).send({
            message: "user id is not provided"
        })
    }
    if (!req.body.password) {
        return res.status(401).send({
            message: "Password is not provided"
        })
    }
    const user = await user_model.findOne({ userId: req.body.userId })

    if (!user) {
        return res.status(400).send({
            message: "UserId not Found"
        })
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).send({
            message: "Wrong password"
        })
    }
    next()
}

const verifyToken = (req, res, next) => {
    const token = req.headers["access-token"]

    if (!token) {
        return res.status(403).send({
            message: "No token found : Unauthorized"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            })
        }

        const user = await user_model.findOne({ userId: decoded.id })

        if (!user) {
            return res.status(401).send({
                message: "Unauthorized! User for this token doesn't exist."
            })
        }
        req.user = user
        req.userId = decoded.id
        next()
    })


}

const isAdmin = (req, res, next) => {

    const user = req.user
    if (user && user.userType == "ADMIN") {
        next()
    }
    else {
        return res.status(401).send({
            message: "Only admin users are authorized for this endpoint"
        })
    }
}




module.exports = {
        verifySignUpBody: verifySignUpBody,
        verifySignInBody: verifySignInBody,
        verifyToken: verifyToken,
        isAdmin: isAdmin
    }