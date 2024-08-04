
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const {ApiError} = require("../utils/ApiError");

const sendmail = async(transporter , mailOptions) => {
    try{
        await transporter.sendMail(mailOptions)
        return 1
        
    }catch(err) {
        console.log(err)
        return 0
    }
}

exports.sendVerificationEmail = async (email) => {
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
    const token = jwt.sign({id : email} , process.env.EMAIL_TOKEN_SECRET , {
            expiresIn : 3600
        })
        if(!token){
          throw new ApiError(500, "Error while sending email")
        }
    
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Verify your email',
            text: `Please click on the following link to verify your email: http://localhost:${process.env.FRONTEND_PORT}/verify?token=${token}

                                The link will be valid for 1 hour.`

        }
        
        
        const status = await sendmail(transporter , mailOptions)
        if(!status){
          throw new ApiError(500, "Error while sending email")
        }
        return true

    } catch (err) {
        throw new ApiError(500, "Error while sending email", err)
    }

}

exports.sendEmailForForgotPassword = async(email) => {
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
        })

        const token = jwt.sign({id : email} , process.env.EMAIL_TOKEN_SECRET , {
            expiresIn : 3600
        })
        if(!token){
          throw new ApiError(500, "Error while sending email")
        }

        const mailOptions = {
            from : process.env.SMTP_USER,
            to : email,
            subject : 'Reset your password',
            text : `Please click on the following link to reset your password: http://localhost:${process.env.FRONTEND_PORT}/resetPassword/${token}`
        }

        const status = await sendmail(transporter , mailOptions)
        if(!status){
          throw new ApiError(500, "Error while sending email")
        }
        return true
    } catch (error) {
        throw new ApiError(500, "Error while sending email", error)
    }
}
