const productModel = require("../models/product.model")
const categoryModel = require("../models/category.model")
const verifyProductBody = async (req, res, next) => {
    const notPresent = [];
    notPresent.push(!req.body.name)
    notPresent.push(!req.body.price)
    notPresent.push(!req.body.category)
    notPresent.push(!req.body.quantityAvailable)
    for(let i =0 ; i<notPresent.length; i++){
        if(notPresent[i]){
            return res.status(400).send({
                message: "product body is not complete"
            })
        }
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