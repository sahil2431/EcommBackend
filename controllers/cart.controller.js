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
        return res.status(500).send({
            message: "Error while fetching price "
        })
    }
}

exports.addCart = async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.body.productId, quantityAvailable : {$gt : 0} })
        if (!product) {
            return res.status(404).send({
                message: "Product not found or Not available"
            })
        }

        const price = req.body.quantity * product.price
        product.quantityAvailable -= req.body.quantity
        await product.save()
        await cartModel.findOne({ userId: req.userId, productId: req.body.productId }).then(async (item) => {
            if (item) {
                item.quantity += req.body.quantity
                item.price += price
                await item.save()
                return res.status(200).send({
                    userId: req.userId,
                    productName : item.productName,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,

                    cartValue: await cartValue(req.userId)
                })
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
                return res.status(200).send({
                    userId: req.userId,
                    productId: cart.productId,
                    productName : cart.productName ,
                    quantity: cart.quantity,
                    price: cart.price,

                    cartValue: await cartValue(req.userId)
                })

            }
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: "Error While adding item to cart"
        })
    }
}

exports.clearCart = async (req, res) => {
    try {
        const cart = await cartModel.find({ userId: req.userId })
        if (cart.length == 0) {
            return res.status(404).send({
                message: "There are no elements in the cart"
            })
        }
        await cartModel.deleteMany({ userId: req.userId })
        return res.status(200).send({
            message: "Cart cleared succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error while creating the data"
        })
    }
}

exports.getCartItems = async (req , res) =>{
    try {
        const cart = await cartModel.find({ userId: req.userId })
        if (cart.length == 0) {
            return res.status(404).send({
                message: "There are no elements in the cart"
            })
        }

        let cartItem = []
        cart.forEach(element=>{
            cartItem.push({
                productId : element.productId ,
                quantity : element.quantity ,
                pricePerItem : element.price / element.quantity ,
                totalPrice : element.price ,
            })
        })

        return res.status(200).send({
            userId : req.userId ,
            cartDetails : cartItem ,
            cartValue : await cartValue(req.userId)
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message : "Error while getting the elements of cart"
        })
    }
}