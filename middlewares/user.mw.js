const user_model = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
dotenv.config();
const verifySignUpBody =asyncHandler( async (req, res, next) => {
  try {
    const { name, email, userId, password, mobile } = req.body;

    if (
      [name, email, userId, password, mobile].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await user_model.findOne({
      $or: [{ userId }, { email }, { mobile }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or userId or email already exists");
    }
    
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const verifySignInBody =asyncHandler( async (req, res, next) => {
  const { userId, email, password } = req.body;
  if (!userId && !email) {
    throw new ApiError(400, "User id or email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is not provided");
  }
  const user = await user_model.findOne({ $or: [{ email }, { userId }] });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!user.isPasswordCorrect(password)) {
    throw new ApiError(401, "Incorrect password");
  }
  next();
});

const verifyToken =asyncHandler( async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized");
    }
    console.log(accessToken);

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await user_model
      .findById(decoded?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token");
  }
});

const isAdmin =asyncHandler( (req, res, next) => {
  const user = req.user;
  if (user && user.userType == "ADMIN") {
    next();
  } else {
    throw new ApiError(403, "Forbidden");
  }
});


const isEmailVerified =asyncHandler( async (req, res , next) => {
  try {
      const token = req.body.token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await user_model.findOne({email : decoded.id})
      if(!user) {
         throw new Error(404 , "Failed! User not found")
      }
      if(!user.emailVerified) {
          throw new Error(400 , "First verify your email")
      }
      next()
      
  }catch(err) {
      throw new Error(500 , "Failed! Error verifying email")
  }
          

})

module.exports = {
  verifySignUpBody: verifySignUpBody,
  verifySignInBody: verifySignInBody,
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isEmailVerified
};
