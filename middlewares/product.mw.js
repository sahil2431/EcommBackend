const productModel = require("../models/product.model")
const categoryModel = require("../models/category.model")
const {ApiError} = require("../utils/ApiError");

const verifyProductBody = async (req, res, next) => {
    const { name, price, category , quantityAvailable } = req.body; 
    if (
      [name, price , category , quantityAvailable].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const product = await productModel.findOne({ name: name })
    if (product) {
        return res.status(400).send({
            message: "product already exists"
        })
    }
    let cat = await categoryModel.findOne({ name: category })
    if (!cat) {
        cat = new categoryModel({name : req.body.category})
        await category.save()
    }  
    next()

}


module.exports = {
    verifyProductBody
}   