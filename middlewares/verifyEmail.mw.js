const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendmail = async(transporter , mailOptions) => {
    try{
        await transporter.sendMail(mailOptions)
        return 1
        
    }catch(err) {
        console.log(err)
        return 0
    }
}

exports.sendVerificationEmail = async (req, res , next) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host : process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure : false,
            requireTLS : true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.APP_PASSWORD
            }
    });
    const token = jwt.sign({id : req.body.email} , process.env.JWT_SECRET , {
            expiresIn : 3600
        })
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: req.body.email,
            subject: 'Verify your email',
            text: `Please click on the following link to verify your email: http://localhost:${process.env.FRONTEND_PORT}/verify?token=${token}

                                The link will be valid for 1 hour.`

        }
        
        const status = await sendmail(transporter , mailOptions)
        if(status){
            next();
        }else{
            return res.status(400).send({
                message: "Failed! Error sending verification email"
            })
        }

    } catch (err) {
        console.log( err);
        return res.status(400).send({
            message: "Failed! Error sending verification email"
        })
    }

}

exports.emailVerified = async (req, res , next) => {
    try {
        const token = req.body.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await user_model.findOne({email : decoded.id})
        if(!user) {
            return res.status(400).send({
                message: "Failed! No user found"
            })
        }
        if(user.emailVerified) {
            return res.status(400).send({

                message: "Email already verified"
               })
        }
        else next();
    }catch(err) {
        return res.status(400).send({
            message: "Failed! Error verifying email"
        })
    }
            

}