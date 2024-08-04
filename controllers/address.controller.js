const {ApiError} = require("../utils/ApiError")
const {ApiResponse} = require("../utils/ApiResponse")
const {asyncHandler} = require("../utils/asyncHandler")
const addressModel = require("../models/address.model")

const addAddress = asyncHandler(async (req , res) =>{
    
    const {name , address1 , address2 , district , pincode , state , phone} = req.body;
    const userId = req.user._id
    if(!name || !address1 || !district || !state || !pincode || !state || !phone) {
       throw new ApiError(400 , "All feilds are required")
    }

    try {
        const address = await addressModel.create({
           user : userId , name ,  address1, address2, district, state, pincode , phone
        })
        
        return res.status(200).json(
            new ApiResponse(200 , "Address addedd successfully" , address)
        )
    } catch (error) {
        return res.json(
            new ApiError(500 , error.message || "Error in adding address" , error)
        )
    }
})

const getAllAddress = asyncHandler(async (req,res) => {
    const userId = req.user._id

    try {
        const address = await addressModel.find({user : userId})
        if(address.length == 0) {
            throw new ApiError(404 , "No address found")
        } 

        return res.status(200).json(
            new ApiResponse(200 , "Address fetched successfully" , address)
        )
    } catch (error) {
        throw new ApiError(500 , error.message || "Error in fetching address" , error)
    }
})

const deleteAddress = asyncHandler( async (req , res) => {
    const addressId = req.body.addressId
    const userId = req.user._id

    if(!addressId) throw new ApiError(400 , "AddressId is required")
    
    await addressModel.findByIdAndDelete(addressId)
    .then((item) => {
        return res.status(200).json(
            new ApiResponse(200 , "Address Deleted successfully")
        )
    })
    .catch((err) => {
        throw new ApiError(500 , "Error in deleting the address")
    })
})

module.exports = {
    addAddress,
    getAllAddress,
    deleteAddress
}