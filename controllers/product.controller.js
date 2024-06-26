const categoryModel = require("../models/category.model")
const product_model = require("../models/product.model")

exports.create_product = async (req , res) =>{
    
    const prod_data = {
        name : req.body.name ,
        price : req.body.price ,
        description : req.body.description ,
        quantityAvailable : req.body.quantityAvailable ,
        category : req.body.category
    }

    try {
        const product = await product_model.create(prod_data)
        const category = await categoryModel.findOne({name : req.body.category})
        category.productNumber++
        await category.save()
        return res.status(201).send(product)
    }catch(err) {
        console.log(err);
        return res.status(500).send({
            message : "Error While creating product"
        })
    }
}

exports.getAllProducts = async (req , res) =>{
    if(!req.body.category) {
        return res.status(404).send({
            message : "Category is required"
        })
    }
    try {
        const category = await categoryModel.findOne({name : req.body.category})
        if(!category) {
            return res.status(404).send({
                message : "Category is not present"
            })
        }
        const prod = await product_model.find({category : req.body.category , quantityAvailable : { $gt: 0 }})
        if(prod.length == 0) {
            return res.status(404).send({
                message : "No product is available with the following category"
            })
        }
        const products = []
        for (let index = 0; index < prod.length; index++) {
            products.push({
                name : prod[index].name,
                price : prod[index].price,
                category : prod[index].category,
                quantityAvailable : prod[index].quantityAvailable

            })
            
        }

        return res.status(200).send(products)
    }catch(err) {
        console.log(err)
        return res.status(500).send({
            message : "Error while fetching products"
        })
    }
}

exports.deleteProduct = async (req , res) =>{
    if(!req.body.name) {
        return res.status(404).send({
            message : "Name is required"
        })
    }
    try {
        const del = await product_model.findOne({name : req.body.name})
        if(!del) {
            return res.status(404).send({
                message : "Product is not found"
            })
        }

        const category = await categoryModel.findOne({name : del.category})
        category.productNumber--;
        await category.save()
        await product_model.deleteOne({name : req.body.name})
        return res.status(202).send({
            message : "Product deleted succesfully" ,
            deletedProduct : {
                name : del.name ,
                price : del.price ,
                category : del.category
            }
        })
    }catch(err) {
        console.log(err)
        return res.status(500).send({
            message : "Error while deleting product"
        })
    }
}

exports.updateProduct = async (req , res) =>{
    if(!req.body.name) {
        return res.status(404).send({
            message : "Name is required"
        })
    }
    try {
        const product = await product_model.findOne({name : req.body.name})
        if(!product) {
            return res.status(404).send({
                message : "Product is not found"
            })
        }
        if(req.body.price) {
            product.price = req.body.price
        }
        if(req.body.quantityAvailable) {
            product.quantityAvailable = req.body.quantityAvailable
        }
        await product.save()
        return res.status(202).send({
            message : "Product updated succesfully" ,
            updatedProduct : {
                name : product.name ,
                price : product.price ,
                quantityAvailable : product.quantityAvailable
            }
        })
    }catch(err) {
        console.log(err)
        return res.status(500).send({
            message : "Error while updating product"
        })
    }
}