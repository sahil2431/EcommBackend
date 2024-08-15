const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const user_model = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail, sendEmailForForgotPassword , sendMessageToAdmin } = require("../utils/email");
const { asyncHandler } = require("../utils/asyncHandler");

const signup = asyncHandler(async (req, res) => {
  const request_body = req.body;

  const userObj = {
    name: request_body.name,
    userId: request_body.userId,
    userType: request_body.userType,
    email: request_body.email,
    password: request_body.password,
    mobile: request_body.mobile,
  };
  try {
    const emailVerification = await sendVerificationEmail(userObj.email);
    if (!emailVerification) {
      throw new ApiError(500, "Error while sending email");
    }
    const user = await user_model.create(userObj);
    const createdUser = await user_model
      .findById(user._id)
      .select("-password -refreshToken");

    res
      .status(200)
      .send(new ApiResponse(200, "User Created successfully", createdUser));
  } catch (err) {
    throw new ApiError(500, err.message || "Error while registering user", err);
  }
});

const signin = asyncHandler(async (req, res) => {
  try {
    const user = await user_model.findOne({ userId: req.body.userId });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const signInUser = await user_model
      .findOne(user._id)
      .select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "User logged in successfully", {
          user: signInUser,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    console.log(error.toString());
    throw new ApiError(500, error.message || "Error while signing", error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    console.log(req.body)
    const password = req.body.password;
    if (!password) {
      throw new ApiError(400, "password is required");
    }
    
    const user = await user_model.findOneAndDelete({ _id: req.user._id });

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (!user.isPasswordCorrect(password)) {
      throw new ApiError(400, "Password is incorrect");
    }

    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, "User deleted successfully", user));
  } catch (err) {
    throw new ApiError(
      err.status || 500,
      err.message || "Error while deleting user",
      err
    );
  }
});

const verifyEmailLink = asyncHandler(async (req, res) => {
  const {token} =  req.body
  try {
    if (!token) {
      throw new ApiError(400, "Token is not provided");
    }
    console.log(token);

    jwt.verify(token, process.env.EMAIL_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        throw new ApiError(
          401,
          "Link is expired or invalid! Press below to resend link"
        );
      }
      const user = await user_model.findOneAndUpdate(
        { email: decoded.id },
        {
          $set: {
            emailVerified: true,
          },
        },
        { new: true }
      )
      .select("-password -refreshToken");

      return res.status(200).json(
        new ApiResponse(200, "Email verified successfully", {
          user
        })
      );
    });
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Error while verifying email",
      error
    );
  }
});

const resendEmailVerificationLink = asyncHandler(async (req, res) => {
  try {
    const user = await user_model.findOne({ email: req.body.email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.emailVerified) {
      throw new ApiError(400, "Email already verified");
    }
    const emailVerification = await sendVerificationEmail(req.body.email);
    if (!emailVerification) {
      throw new ApiError(500, "Error while sending email");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Email verification link sent successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Error while sending email",
      error
    );
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await user_model.findById(decoded._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    const signInUser = await user_model
      .findByIdAndUpdate(
        user._id,
        {
          $set: {
            refreshToken: newRefreshToken,
          },
        },
        { new: true }
      )
      .select("-password -refreshToken");
    const options = {
      httpOnly: true,
      secure: true,
    };

    if (!signInUser) {
      throw new ApiError(401, "error while updating refresh token");
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, "Access token generated successfully", {
          user: signInUser,
          accessToken,
          refreshToken: newRefreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Error while refreshing token",
      error
    );
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new password are required");
  }
  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }

  try {
    const user = await user_model.findById(req.user._id);
    if (!user.isPasswordCorrect(oldPassword)) {
      throw new ApiError(400, "Old password is not correct");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, "Password updated successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Error while updating password",
      error
    );
  }
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { name, mobile, email } = req.body;

  if (!name && !mobile && !email) {
    throw new ApiError(400, "Atleast one field is required");
  }
  try {
    const user = await user_model.findById(req.user._id);
    console.log(req.body);

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (name) {
      user.name = name;
    }
    if (mobile) {
      const mobileExist = await user_model.findOne({ mobile });
      if (mobileExist) {
        throw new ApiError(400, "Mobile number already exist", error);
      }
      user.mobile = mobile;
    }
    if (email) {
      const emailExist = await user_model.findOne({ email });
      if (emailExist) {
        throw new ApiError(400, "Email already exist");
      }
      user.email = email;
      const emailVerification = await sendVerificationEmail(email);
      if (!emailVerification) {
        throw new ApiError(500, "Error while sending email");
      }
      user.emailVerified = false;
    }

    await user.save();

    const updatedUser = await user_model
      .findById(user._id)
      .select("-password -refreshToken");
    return res.status(200).json(
      new ApiResponse(200, "User details updated successfully", {
        updatedUser,
      })
    );
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Error while updating user details",
      error
    );
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    const user = await user_model.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    user.refreshToken = null;
    await user.save();
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json(new ApiResponse(200, "Logout successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Error while logging out", error);
  }
});

const getCurrentUserDetails = asyncHandler(async (req , res) =>{
  try {
    const user = await user_model.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, "User details fetched successfully", { user }));
  } catch (error) {
    throw new ApiError(error.status || 500, error.message || "Error while getting user details", error);
  }
})

const getAllUserDetails = asyncHandler(async (req , res) => {
  try {
    const users = await user_model.find().select("-password -refreshToken")
    if(users.length == 0) {
      throw new ApiError(404 , "No user")
    }

    return res.status(200).json(
      new ApiResponse(200 , "User Details Fetched Succesfully" , {users})
    )
  } catch (error) {
    throw new ApiError(error.status || 500 , error.message || "Error in fetching data" , error)
  }
})

const forgotPassword = asyncHandler( async (req , res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(new ApiResponse(400, "Email is required"));
  }

  try {
    const user = await user_model.findOne({ email });
    if(!user) {
      return res.status(404).json(new ApiResponse(404, "Email does not exist"));
    }

    const sendEmail = await sendEmailForForgotPassword(email)
    if(!sendEmail) {
      throw new ApiError(500, "Error while sending email");
    }
    return res.status(200).json(new ApiResponse(200, "Email sent successfully"));
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Error while sending email",
      error)
  }
})

const resetPassword = asyncHandler(async (req , res) => {
  const {newPassword , token} = req.body
  if(!newPassword ||!token) {
    return res.status(400).json(new ApiResponse(400, "All fields are required"))
  }

  try {
    jwt.verify(token , process.env.EMAIL_TOKEN_SECRET, async (err, decoded) => {
      if(err) {
        return res.status(400).json(new ApiResponse(400, "Token is not valid"))
      }
      const userEmail = decoded.id;
      if(!userEmail) {
        return res.status(400).json(new ApiResponse(400, "Token is not valid"))
      }
      const user = await user_model.findOne({ email: userEmail });
      if(!user) {
        return res.status(404).json(new ApiResponse(404, "User not found"))
      }

      user.password = newPassword
      user.refreshToken= null
      await user.save()
      return res.status(200).json(new ApiResponse(200, "Password updated successfully"))
  })
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Error while updating password",
      error)
  }
})

const contactAdmin = asyncHandler(async (req , res) => {
  const {name , email , message} = req.body;
  if(!name || !email || !message) {
    return res.status(400).json(new ApiResponse(400, "All fields are required"))
  }

  try {
    const sendEmail = await sendMessageToAdmin(name , email , message)
    if(!sendEmail) {
      throw new ApiError(500, "Error while sending email")
    }

    return res.status(200).json(new ApiResponse(200, "Email sent successfully"))
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Error while sending email",
      error)
    
  }
})
module.exports = {
  signup,
  signin,
  deleteUser,
  verifyEmailLink,
  resendEmailVerificationLink,
  refreshToken,
  updatePassword,
  updateUserDetails,
  logout,
  getCurrentUserDetails,
  getAllUserDetails,
  forgotPassword,
  resetPassword,
  contactAdmin
};
