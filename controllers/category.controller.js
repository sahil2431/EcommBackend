const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const category_model = require("../models/category.model");
const { asyncHandler } = require("../utils/asyncHandler");

const createNewCategory = asyncHandler(async (req, res) => {
  //Read the req body

  //Create the category object
  const cat_data = {
    name: req.body.name,
  };
  try {
    //Insert into mongodb
    const category = await category_model.create(cat_data);
    return res.status(201).send(
      new ApiResponse(201, "Category created successfully", {
        name: category.name,
        numberOfProducts: category.productNumber,
      })
    );
  } catch (err) {
    console.log("error while creating category", err);
    throw new ApiError(500, "Error while creating category");
  }

  //return the response of created category
});

//Get all the Categories
const getAllcatgories = asyncHandler(async (req, res) => {
  try {
    const categories = await category_model.find();
    
    return res
      .status(200)
      .send(new ApiResponse(200, "Categories fetched successfully", categories));
  } catch (err) {
    throw new ApiError(500, "Error while fetching categories", err);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    await category_model.deleteOne({ name: req.body.name });
    return res
      .status(204)
      .send(new ApiResponse(204, "Category deleted successfully"));
  } catch (err) {
    throw new ApiError(500, "Error while deleting the category", err);
  }
});

module.exports = {
  createNewCategory,
  getAllcatgories,
  deleteCategory,
};
