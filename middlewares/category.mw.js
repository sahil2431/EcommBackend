const categoryModel = require("../models/category.model")

const verifyCategoryBody =  async(req , res , next) =>{
    if(!req.body.name) {
        return res.status(400).send({
            message : "category name is not provided"
        })
    }
    const category = await categoryModel.findOne({name : req.body.name})
    if(category) {
        return res.status(400).send({
            message : "category already exists"
        })
    }
    next()
}

const verifyCategoryDeleteBody = async(req , res , next) =>{
    if(!req.body.name) {
        return res.status(400).send({
            message : "category name is not provided"
        })
    }
    const category = await categoryModel.findOne({name : req.body.name})
    if(!category) {
        return res.status(400).send({
            message : "category does not exists"
        })
        
    }
    next()
}
module.exports = {
    verifyCategoryBody,
    verifyCategoryDeleteBody
}