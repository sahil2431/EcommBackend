
const {v2 : cloudinary} =require('cloudinary')
const fs = require('fs')
const { ApiError } = require('./ApiError')
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) =>{
    try {
        if(!localFilePath) {
            throw new ApiError(400, "File path is not provided")
        }

        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type : auto
        })

        console.log("File is uploades in cloudinary" , response.url);

        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath)

        return null
    }
}

module.exports = {uploadOnCloudinary}