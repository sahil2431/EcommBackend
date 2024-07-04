const { ApiError } = require("../utils/ApiError");
const categoryModel = require("../models/category.model")

const verifyCategoryBody =  async(req , res , next) =>{
    if(!req.body.name) {
        throw new ApiError(400, "category name is not provided")
    }
    const category = await categoryModel.findOne({name : req.body.name})
    if(category) {
        throw new ApiError(400, "category already exists")
    }
    next()
}

const verifyCategoryDeleteBody = async(req , res , next) =>{
    if(!req.body.name) {
        throw new ApiError(400, "category name is not provided")
    }
    const category = await categoryModel.findOne({name : req.body.name})
    if(!category) {
        throw new ApiError(400, "category does not exists")
        
    }
    next()
}
module.exports = {
    verifyCategoryBody,
    verifyCategoryDeleteBody
}