const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const cartModel = require("../models/cart.model")
const { asyncHandler } = require("../utils/asyncHandler");
const { default: mongoose } = require("mongoose");


const addCart = asyncHandler( async (req, res) => {
    try {
        const product = req.product
        const quantity = req.body?.quantity || 1
        await cartModel.findOne({ userId: req.user._id, productId: req.body.productId }).then(async (item) => {
            if (item) {
                item.quantity += quantity
                await item.save()
                return res.status(200).send(
                    new ApiResponse(200, "Cart updated successfully", item)
                )
            }
            else {
                const cartData = {
                    userId: req.user._id,
                    price : product.price,
                    productId: product._id ,
                    quantity: req.body.quantity,
                }
                const cart = await cartModel.create(cartData)
                return res.status(200).send(
                    new ApiResponse(200, "Cart added successfully", cart)
                )

            }
        })

    } catch (err) {
        throw new ApiError(err.status || 500, err.message || "Error while creating the data" , err);
    }
})

const clearCart = asyncHandler( async (req, res) => {
    try {
        const cart = await cartModel.find({ userId: req.userId })
        if (cart.length == 0) {
            throw new ApiError(404, "Cart is empty" , err);
        }
        await cartModel.deleteMany({ userId: req.userId })
        return res.status(200).json(
            new ApiResponse(200, "Cart cleared successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error while clearing cart" , err);
    }
})

const updateQuantity = asyncHandler(async (req , res) =>{
    const {cartId , quantity} = req.body
    const userId = req.user._id
    if(!cartId ||!quantity){
        throw new ApiError(400, "Please provide cartId and quantity" , err);
    }
    try {
        const cart  = await cartModel.findOneAndUpdate({_id : cartId} , 
            { $set : { quantity : quantity } }
            ,{ new : true }
         )
         if(!cart){
            throw new ApiError(404, "Cart not found" , err);
        }
        return res.status(200).json(
            new ApiResponse(200, "Cart updated successfully", cart)
        )
    } catch (error) {
        throw new ApiError(500,error.message ||  "Error while updating cart" , err);
    }
})

const getCartItems = asyncHandler( async (req , res) =>{
    try {
        const cart = await cartModel.aggregate([
            {
                $match : {
                    userId : new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup : {
                    from : "products",
                    localField : "productId",
                    foreignField : "_id",
                    as : "product",
                    pipeline : [
                        
                        {
                            $project : {
                                name : 1,
                                category : 1,
                                
                                images : 1,
                                category : 1,
                            }
                        }
                    ]
                }
            },
            {
                $addFields : {
                    productTotal : {
                        $multiply : ["$quantity" , "$price" ]
                    }
                }
            },
            
            {
                $group : {
                    _id : "$_id",
                    productId : { $first : "$productId" },
                    quantity : { $first : "$quantity" },
                    price : { $first : "$price" },
                    productTotal : { $first : "$productTotal" },
                    product : { $first : "$product" },
                }
            }
        ])
        let cartValue = 0
        cart.map((item) =>{
            cartValue += item.productTotal
        })
        
        if (cart.length == 0) {
            throw new ApiError(404, "Cart is empty");
        }
    
        return res.status(200).json(
            new ApiResponse(200, "Cart fetched successfully", {cart , cartValue})
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Error while fetching cart items" , error);
    }
})

const removeItem = asyncHandler(async (req , res) =>{
    const cartId = req.body.cartId
    const userId = req.user._id
    if(!cartId ||!userId){
        throw new ApiError(400, "Please provide productId and userId");
    }
    try {
        await cartModel.findByIdAndDelete(cartId)
        .then((item) => {
            if(!item){
                throw new ApiError(404, "Cart not found");
            }
            return res.status(200).json(
                new ApiResponse(200, "Product removed successfully" , item)
            )
        })
    } catch (error) {
        throw new ApiError(500, error.message || "Error while removing product from cart" , error);
    }
})

module.exports = {
    addCart,
    clearCart,
    getCartItems,
    updateQuantity,
    removeItem
}