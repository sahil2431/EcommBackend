const productModel = require("../models/product.model")
const categoryModel = require("../models/category.model")
const verifyProductBody = async (req, res, next) => {
    console.log(req.body)
    const notPresent = [];
    if (!req.body.name) {
        notPresent.push('name');
      }
      if (!req.body.price) {
        notPresent.push('price');
      }
      if (!req.body.category) {
        notPresent.push('category');
      }
      if (!req.body.quantityAvailable) {
        notPresent.push('quantityAvailable');
      }

      if(req.body.images.length < 1) {
        notPresent.push("images")
      }
      
    
      // If any fields are missing, send a 400 response
      if (notPresent.length > 0) {
        return res.status(400).send({
          message: `Missing required fields: ${notPresent.join(', ')}`
        });
      }

    const product = await productModel.findOne({ name: req.body.name })
    if (product) {
        return res.status(400).send({
            message: "product already exists"
        })
    }
    let category = await categoryModel.findOne({ name: req.body.category })
    if (!category) {
        category = new categoryModel({name : req.body.category})
        await category.save()
    }  
    next()

}


module.exports = {
    verifyProductBody
}   