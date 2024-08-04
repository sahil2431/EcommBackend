const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { mongo, default: mongoose } = require("mongoose");

const confirmOrder = asyncHandler(async (req, res) => {
  const { addressId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await cartModel.find({ userId: userId });
    if (cart.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    let orderedProducts = [];
    let totalValue = 0;
    for (const item of cart) {
      const product = await productModel.findById(item.productId);
      if (!product || product.quantityAvailable < item.quantity) {
        throw new ApiError(404, "Product not found or not available");
      }

      orderedProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalValue += product.price * item.quantity;
      product.quantityAvailable -= item.quantity;
      await product.save();
    }

    const newOrder = await orderModel.create({
      userId: userId,
      address: addressId,
      products: orderedProducts,
      totalValue: totalValue,
    });
    await cartModel.deleteMany({ userId: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, "Order placed successfully", newOrder));
  } catch (error) {
    throw new ApiError(400, error.message || "Something went wrong");
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const orders = await orderModel.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          totalValue: { $first: "$totalValue" },
          createdAt: { $first: "$createdAt" },
          productDetails: {
            $push: {
              _id: "$productDetails._id",
              name: "$productDetails.name",
              description: "$productDetails.description",
              price: "$products.price",
              quantity: "$products.quantity",
              category: "$productDetails.category",
              images: "$productDetails.images",
              status: "$products.status",
            },
          },
        },
      },
      
    ]);

    if (orders.length === 0) {
      throw new ApiError(404, "No orders found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Orders fetched successfully", {orders }
      ));
  } catch (error) {
    throw new ApiError(400, error.message || "Something went wrong");
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId , productId} = req.params;
  if(!orderId || !productId) {
    return res.status(400).json(new ApiResponse(400, "Order Id and Product Id are required"));
  }
  try {
    const order = await orderModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
        },
      },
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.productId": new mongoose.Types.ObjectId(productId),
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
          pipeline :[{
            $project : {
              name : 1,
              description : 1,
              price : 1,
              images : 1,
              category : 1,
            }
          }]
        },
      },
      {
        $lookup : {
          from : "addresses",
          localField : "address",
          foreignField : "_id",
          as : "addressDetails",
          pipeline : [{
            $project : {
              name : 1,
              address1 : 1,
              address2 : 1,
              district : 1,
              state : 1,
              pincode : 1,
              phone : 1,
            }
          }]
        }
      },
      {
        $lookup : {
          from : "reviews",
          localField : "userId",
          foreignField : "reviewdBy",
          as : "reviews",
          pipeline : [{
            $match : {
              reviewdProduct : new mongoose.Types.ObjectId(productId)
            }
          }]
        }
      },
      {
        $group : {
          _id : "$_id",
          productId : { $first : "$products.productId"},
          userId : { $first : "$userId" },
          quantity : { $first : "$products.quantity" },
          address : { $first : "$addressDetails" },
          productDetails : { $first : "$productDetails" },
          status : { $first : "$products.status" },
          reviews : { $first : "$reviews"},
          createdAt : { $first : "$createdAt" },
          updatedAt : { $first : "$updatedAt" },
        }
      }
    ]);

    if(!order) {
      return res.status(404).json(new ApiResponse(404, "Order not found"));
    }

    return res.status(200).json(new ApiResponse(200, "Order details fetched successfully", order[0]));
  } catch (error) {
    throw new ApiError(400, error.message || "Something went wrong");
  }
});

const cancelOrder = asyncHandler( async(req , res) => {
    const {orderId , productId} = req.body
    if(!orderId || !productId) {
        throw new ApiError(400 , "Please provide orderId or productId")
    }
    try {
        const order = await orderModel.findById(orderId)
        if(!order) {
            throw new ApiError(404 , "Order Not found")
        }
        if(order.products.status !== "Pending"){
            throw new ApiError(400 , "Order can not be canceled")
        }
        order.products.status = "Cancel"
        await order.save()

        return res.status(200).json(
            new ApiResponse(200 , "Order removed successfully")        
        )
    } catch (error) {
        throw new ApiError(error.statusCode || 500 , error.message || "Something went wrong" )
    }
})

module.exports = {
  confirmOrder,
  getAllOrders,
  getOrderById,
  cancelOrder
};
