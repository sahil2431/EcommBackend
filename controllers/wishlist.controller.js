const {ApiResponse} = require("../utils/ApiResponse")
const {ApiError} = require("../utils/ApiError")
const wishlistModel = require("../models/wishlist.model")
const { asyncHandler } = require("../utils/asyncHandler")

const addItem = asyncHandler(async (req, res) => {
    const productId = req.body?.productId

    const userId = req.user._id;
    if(!productId && !userId ) {
        throw new ApiError(400, "Please provide product id and user id")
    }

    try {
        await wishlistModel.findOne({ wishlistBy: userId, wishlistedProduct: productId }).then(async (item)=>{
            if(item) {
                throw new ApiError(400, "Item already exists in wishlist")
            } else {
                const wishlist = await wishlistModel.create({ wishlistBy: userId, wishlistedProduct: productId })

                return res.status(200).send(
                    new ApiResponse(200, "Item added successfully", wishlist)
                )
            }
        })
    } catch (error) {
        throw new ApiError(500, error.message || "Error while adding item to wishlist" , error);
        
        
    }
})

const removeItem = asyncHandler(async (req , res) =>{
    const productId = req.body?.productId
    const userId = req.user._id;

    if(!productId && !userId ) {
        throw new ApiError(400, "Please provide product id and user id")
    }

    try {
        await wishlistModel.findOneAndDelete({ wishlistBy: userId, wishlistedProduct: productId }).then(async (item) => {
            if (item) {
                return res.status(200).send(
                    new ApiResponse(200, "Item removed successfully", item)
                )
            } else {
                throw new ApiError(404, "Item does not exist in wishlist" );
            }
        })
    } catch (error) {
        throw new ApiError(500, error.message || "Error while removing item from wishlist" , error);
    }
}) 

const getWishlistedProducts = asyncHandler( async (req , res) =>{
    const userId = req.user._id;
    if(!userId) {
        throw new ApiError(400, "Please provide user id")
    }
    try {
        const products = await wishlistModel.aggregate([
            {
                $match : {
                    wishlistBy: userId
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "wishlistedProduct",
                    foreignField: "_id",
                    as: "product"
                }
            }
        ])

        if(products.length == 0) {
            throw new ApiError(404, "No products found in wishlist" );
        }
        return res.status(200).send(
            new ApiResponse(200, "Wishlisted products found successfully", products)
        )
    } catch (error) {
        throw new ApiError(500 , error.message || "Error while fetching wishlist" , error)
    }
})

module.exports = {
    addItem,
    removeItem,
    getWishlistedProducts
}