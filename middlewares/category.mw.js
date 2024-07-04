const { ApiError } = require("../utils/ApiError");
const categoryModel = require("../models/category.model");
const { asyncHandler } = require("../utils/asyncHandler");

const verifyCategoryBody =asyncHandler(  async(req , res , next) =>{
    if(!req.body.name) {
        throw new ApiError(400, "category name is not provided")
    }
    const category = await categoryModel.findOne({name : req.body.name})
    if(category) {
        throw new ApiError(400, "category already exists")
    }
    next()
})

const verifyCategoryDeleteBody =asyncHandler( async(req , res , next) =>{
    if(!req.body.name) {
        throw new ApiError(400, "category name is not provided")
    }
    const category = await categoryModel.findOne({name : req.body.name})
    if(!category) {
        throw new ApiError(400, "category does not exists")
        
    }
    next()
})
module.exports = {
    verifyCategoryBody,
    verifyCategoryDeleteBody
}