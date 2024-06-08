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
            text: `Please click on the following link to verify your email: http://localhost:${process.env.PORT}/ecom/api/v1/auth/verify?token=${token}

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
        const token = req.query.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await user_model.findOne({email : decoded.id})
        if(!user) {
            return res.status(400).send({
                message: "Failed! No user found"
            })
        }
        if(user.isVerified) {
            return res.status(400).send(
                `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verify</title>
        </head>
        <body>
            <h1>Hello , ${user.name}</h1>
            <p>Email is already verified </p>
        </body>
        </html>
    `)
        }
        else next();
    }catch(err) {
        console.log(err)
        return res.status(400).send({
            message: "Failed! Error verifying email"
        })
    }
            

}