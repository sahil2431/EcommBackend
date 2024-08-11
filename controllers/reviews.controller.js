const { default: mongoose } = require("mongoose");
const reviewsModel = require("../models/reviews.models");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const productModel = require("../models/product.model");

const addReview = asyncHandler(async (req, res) => {
  const { rating, review, productId } = req.body;
  const user = req.user;
  if (!rating && !review && productId) {
    return res.status(400).json( new ApiResponse(400 , "All fields are required"))
  }
  try {
    const isAlreadyReviewed = await reviewsModel.findOne({reviewdBy : user._id})
    if(isAlreadyReviewed) {
      return res.status(400).json( new ApiResponse(400 , "You have already reviewed the product"))
    }
    const reviewProduct = await reviewsModel.create({
      reviewdBy: user._id,
      reviewdProduct: productId,
      rating: rating,
      review: review,
    });

    const product = await productModel.findById(productId);
    product.rating.total += rating;
    product.rating.numberOfRatings ++;
    product.rating.averageRating = product.rating.total / product.rating.numberOfRatings;
    await product.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Review created succesfully ", reviewProduct));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Error while creating review",
      error
    );
  }
});

const editReview = asyncHandler(async (req, res) => {
  const { rating, review, productId } = req.body;
  const user = req.user;
  if (!rating && !review && productId) {
    throw new ApiError(400, "All feilds are necessary");
  }

  try {
    await reviewsModel
      .findOneAndUpdate(
        {
          reviewdBy: user._id,
          reviewdProduct: productId,
        },
        {
          rating: rating,
          review: review,
        }
      )
      .then((item) => {
        return res
          .status(200)
          .json(new ApiResponse(200, "Review updated", item));
      })
      .catch((err) => {
        throw new ApiError(500, "Errorr while updating", err);
      });
  } catch (error) {
    throw new ApiError(500, error.message || "Errorr while updating", error);
  }
});

const getAllReviewsOfUser = asyncHandler(async (req, res) => {
  const user = req.user;
  try {
    const reviews = await reviewsModel.aggregate([
      {
        $match: {
          reviewdBy: mongoose.Types.ObjectId(user._id),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "reviewdProduct",
          foreignField: "_id",
          as: "product",
          pipeline: [
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
              },
            },
          ],
        },
      },
    ]);

    if(reviews.length == 0) {
        throw new ApiError(404 , "Reviews not found!"  , err)
    }

    return res.status(200).json(
        new ApiResponse(200 , "Reviews fetched Succesfully" , reviews)
    )
  } catch (err) {
    throw new ApiError(500 , err.message || "Error while fetching data" , err)
  }
});

module.exports = {
    addReview,
    editReview,
    getAllReviewsOfUser
}