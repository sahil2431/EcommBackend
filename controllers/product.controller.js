const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const categoryModel = require("../models/category.model");
const product_model = require("../models/product.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { asyncHandler } = require("../utils/asyncHandler");
const mongoose = require("mongoose");

const create_product = asyncHandler(async (req, res, files) => {
  let productImage = [];
  console.log("Images :", req.imagesLocalPath);
  for (let index = 0; index < req.imagesLocalPath.length; index++) {
    const element = req.imagesLocalPath[index];
    console.log(element);
    productImage.push(await uploadOnCloudinary(element));
  }

  console.log(productImage);
  const prod_data = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    quantityAvailable: req.body.quantityAvailable,
    category: req.body.category,
    images: productImage.map((image) => image.url),
  };
  console.log(prod_data);

  try {
    const product = await product_model.create(prod_data);
    const category = await categoryModel.findById(req.body.category);
    category.productNumber++;
    await category.save();
    return res
      .status(201)
      .send(new ApiResponse(201, "Product created successfully", product));
  } catch (err) {
    console.log(err);
    throw new ApiError(
      err.status || 500,
      err.message || "Error while creating product",
      err
    );
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await product_model.find();
    if (products.length == 0) {
      throw new ApiError(404, "No products found");
    }
    return res
      .status(200)
      .send(new ApiResponse(200, "Products fetched successfully", products));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, "Error while fetching products", err);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
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
});

const updateProduct = asyncHandler(async (req, res) => {
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
    
    const updatedProduct = await product_model.findOne({ name: req.body.name });
    return res
      .status(202)
      .json(
        new ApiResponse(202, "Product updated successfully", updatedProduct)
      );
  } catch (err) {
    throw new ApiError(500, "Error while updating product", err);
  }
});

const productDetails = asyncHandler(async (req, res) => {
  try {
    const userId = req.body?.userId;
    const productId = req.body?.productId;

    const productDetails = await product_model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $lookup: {
          from: "carts",
          localField: "_id",
          foreignField: "productId",
          as: "cart",
        },
      },
      {
        $addFields: {
          isAddedToCart: {
            $cond: {
              if: { $in: [new mongoose.Types.ObjectId(userId) , "$cart.userId"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup : {
          from : "reviews",
          localField : "_id",
          foreignField : "reviewdProduct",
          as : "reviews",
          pipeline : [
            {
              $lookup : {
                from : "users" , 
                localField : "reviewdBy" ,
                foreignField : "_id" ,
                as : "reviewdBy",
                pipeline : [
                  {
                    $project : {
                      _id : 1,
                      userId : 1,
                      name : 1,
                      email : 1,
                    }
                  }
                ]
              }
            },
            {
              $project : {
                product : 0,
              }
            }
          ]
        }
      },
      {
        $lookup : {
          from : "wishlists" ,
          localField : "_id" ,
          foreignField : "wishlistedProduct" ,
          as : "wishlists" ,
        }
      },
      {
        $addFields : {
          isWishlisted : {
            $cond : {
              if : { $in : [new mongoose.Types.ObjectId(userId) , '$wishlists.wishlistBy']} ,
              then : true ,
              else : false ,
            }
          }
        }
      },
      
      {
        $project : {
          _id : 1,
          name : 1,
          price : 1,
          description : 1,
          quantityAvailable : 1,
          category : 1,
          images : 1,
          isAddedToCart : 1,
          isWishlisted : 1,
          reviews : 1,
          rating : 1,
        }
      }
      
    ]);


    if (!productDetails?.length) {
      throw new ApiError(404, "No product found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Product details fetched successfully",
          productDetails[0]
        )
      );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Error while fetching product details",
      error
    );
  }
});

const searchProductBysearch = asyncHandler(async (req , res) => {
  const {search} = req.body
  if(!req.body) {
    return res.status(400).json(new ApiResponse(400 , "Body is required"))
  }
  try{
    const products = await product_model.find( {name : { $regex : search , $options : 'i'}})
    
     if(!products) {
       return res.status(404).json(new ApiResponse(404 , "No product found"))
     }
      
     return res.status(200).json( new ApiResponse(200 , "Product fetched" , products))

  }catch(err) {
    throw new ApiError(500 , err.message || "Error while searching product" , err) 
  }
})

const getProductByCategory = asyncHandler(async (req , res) => {
  const {categoryId} = req.body
  if(!req.body) {
    return res.status(400).json(new ApiResponse(400 , "Body is required"))
  }
  try{
    const products = await product_model.find({category : categoryId})
    if(!products) {
      return res.status(404).json(new ApiResponse(404 , "No product found"))
    }
    return res.status(200).json(new ApiResponse(200 , "Product fetched" , products))
  }catch(err) {
    throw new ApiError(500 , err.message || "Error while fetching product" , err)
  }
})

const filterProducts = asyncHandler(async (req, res) => {
  const { categoryId, price, availability, rating } = req.body;
  let products = [];
  try {
    if (categoryId) {
      products = await product_model.find({ category: categoryId });
    } else {
      products = await product_model.find();
    }
    if (products.length === 0) {
      return res.status(404).json(new ApiResponse(404, "Product not found"));
    }
    if (typeof price === 'object' && price !== null && Object.keys(price).length !== 0) {
      products = products.filter(product => product.price <= price.max && product.price >= price.min);
    }
    if (availability) {
      products = products.filter(product => product.quantityAvailable > 0);
    }
    if (typeof rating === 'object' && rating !== null && Object.keys(rating).length !== 0) {
      products = products.filter(product => product.rating.averageRating >= rating.min && product.rating.averageRating <= rating.max);
    }
    return res.status(200).json(new ApiResponse(200, "Product fetched", products));
  } catch (err) {
    throw new ApiError(500, err.message || "Error while fetching product", err);
  }
});

module.exports = {
  create_product,
  getAllProducts,
  deleteProduct,
  updateProduct,
  productDetails,
  searchProductBysearch,
  getProductByCategory,
  filterProducts
};
