const productModel = require("../models/product.model")
const categoryModel = require("../models/category.model")
const {ApiError} = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const fs = require("fs");
const verifyProductBody =asyncHandler( async (req, res, next) => {
    const { name, price, category , quantityAvailable } = req.body; 
    console.log(req.files)
    const imagesLocalPath = req.files.map(file => file.path)
    console.log(imagesLocalPath);
    if(imagesLocalPath.length < 0){
        throw new ApiError(400, "images are required");
    }
    if (
      [name, price , category , quantityAvailable].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      imagesLocalPath.forEach(element => {
        fs.unlinkSync(element);
      });
      throw new ApiError(400, "All fields are required");
    }

    const product = await productModel.findOne({ name: name })
    if (product) {
      imagesLocalPath.forEach(element => {
        fs.unlinkSync(element);
      });
        throw new ApiError(400, "Product already exists");
    }
    let cat = await categoryModel.findOne({ name: new RegExp('^' + req.body.category + '$', 'i') })
    if (!cat) {
        cat =  await categoryModel.create({name : req.body.category})
    }  
    req.body.category = cat._id;
    req.imagesLocalPath = imagesLocalPath;
    next()

})


module.exports = {
    verifyProductBody
}   