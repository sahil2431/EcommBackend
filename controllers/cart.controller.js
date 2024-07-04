const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const cartModel = require("../models/cart.model")
const productModel = require("../models/product.model")

async function cartValue(id) {
    try {
        const cart = await cartModel.find({ userId: id })
        if (cart.length == 0) return 0;
        let cartPrice = 0
        cart.forEach(element => {
            cartPrice += element.price;
        });

        return cartPrice
    } catch (err) {
        throw new ApiError(500, "Error while fetching cart value" , err);   
    }
}

exports.addCart = async (req, res) => {
    try {
        const product = req.product
        const price = req.body.quantity * product.price
        await cartModel.findOne({ userId: req.userId, productId: req.body.productId }).then(async (item) => {
            if (item) {
                item.quantity += req.body.quantity
                item.price += price
                await item.save()
                return res.status(200).send(
                    new ApiResponse(200, "Cart updated successfully", item)
                )
            }
            else {
                const cartData = {
                    userId: req.userId,
                    productId: req.body.productId,
                    productName : product.name ,
                    quantity: req.body.quantity,
                    price: (req.body.quantity * product.price)
                }
                const cart = await cartModel.create(cartData)
                return res.status(200).send(
                    new ApiResponse(200, "Cart added successfully", cart)
                )

            }
        })

    } catch (err) {
        throw new ApiError(500, "Error while creating the data" , err);
    }
}

exports.clearCart = async (req, res) => {
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
}

exports.getCartItems = async (req , res) =>{
    try {
        const cart = await cartModel.find({ userId: req.userId })
        if (cart.length == 0) {
            throw new ApiError(404, "Cart is empty" , err);
        }

        let cartItem = []
        cart.forEach(element=>{
            cartItem.push({
                name : element.productName ,
                productId : element.productId ,
                quantity : element.quantity ,
                pricePerItem : element.price / element.quantity ,
                totalPrice : element.price ,
            })
        })
        const cartValue = await cartValue(req.userId)
        return res.status(200).json(
            new ApiResponse(200, "Cart fetched successfully", {cartItem , cartValue})
        )
    } catch (error) {
        throw new ApiError(500, "Error while fetching cart items" , err);
    }
}