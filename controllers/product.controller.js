const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const categoryModel = require("../models/category.model");
const product_model = require("../models/product.model");
const uploadOncloudinary = require("../utils/cloudinary");
exports.create_product = async (req, res) => {
  let imagePath = [];
  console.log(file);
  for (let i = 0; i < file.length(); i++) {
    image.push(file[i].path);
  }

  const prodImage = await uploadOncloudinary(imagePath, (err, result) => {
    if (err) {
      throw new ApiError(500, "Error while uploading image", err);
    }
  });

  const prod_data = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    quantityAvailable: req.body.quantityAvailable,
    category: req.body.category,
    image: prodImage.url,
  };

  try {
    const product = await product_model.create(prod_data);
    const category = await categoryModel.findOne({ name: req.body.category });
    category.productNumber++;
    await category.save();
    return res
      .status(201)
      .send(new ApiResponse(201, "Product created successfully", product));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, "Error while creating product", err);
  }
};

exports.getAllProducts = async (req, res) => {
  if (!req.body.category) {
    throw new ApiError(404, "Category is required", err);
  }
  try {
    const category = await categoryModel.findOne({ name: req.body.category });
    if (!category) {
      throw new ApiError(404, "Category is not found", err);
    }
    const prod = await product_model.find({
      category: req.body.category,
      quantityAvailable: { $gt: 0 },
    });
    if (prod.length == 0) {
      throw new ApiError(404, "No products found", err);
    }
    const products = [];
    for (let index = 0; index < prod.length; index++) {
      products.push({
        name: prod[index].name,
        price: prod[index].price,
        category: prod[index].category,
        quantityAvailable: prod[index].quantityAvailable,
      });
    }

    return res
      .status(200)
      .send(new ApiResponse(200, "Products fetched successfully", products));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, "Error while fetching products", err);
  }
};

exports.deleteProduct = async (req, res) => {
  if (!req.body.name) {
    throw new ApiError(404, "Product name is required", err);
  }
  try {
    const del = await product_model.findOne({ name: req.body.name });
    if (!del) {
      throw new ApiError(404, "Product is not found", err);
    }

    const category = await categoryModel.findOne({ name: del.category });
    category.productNumber--;
    await category.save();
    await product_model.deleteOne({ name: req.body.name });
    return res.status(202).send(
      new ApiResponse(202, "Product deleted successfully", {
        name: del.name,
      })
    );
  } catch (err) {
    console.log(err);
    throw new ApiError(500, "Error while deleting product", err);
  }
};

exports.updateProduct = async (req, res) => {
  if (!req.body.name) {
    throw new ApiError(404, "Product name is required", err);
  }
  try {
    const product = await product_model.findOne({ name: req.body.name });
    if (!product) {
      throw new ApiError(404, "Product is not found", err);
    }
    if (req.body.price) {
      product.price = req.body.price;
    }
    if (req.body.quantityAvailable) {
      product.quantityAvailable = req.body.quantityAvailable;
    }
    await product.save();

    const updateProduct = await product_model.findOne({ name: req.body.name });
    return res
      .status(202)
      .json(
        new ApiResponse(202, "Product updated successfully", updatedProduct)
      );
  } catch (err) {
    throw new ApiError(500, "Error while updating product", err);
  }
};
