import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import { profileUpdateValidation } from "../utils/validation.js";

// @desc    GET current user
// @route   GET /api/user
// @access  Protected

export const getCurrentUser = asyncHandler(async (req, res) => {
  // find user
  const user = await User.findById(req.user._id);
  res.status(200).json({ user: user });
});

// @desc    Update current user
// @route   PUT /api/user
// @access  Protected

export const updateCurrentUser = asyncHandler(async (req, res) => {
  // update data validation
  const { error } = profileUpdateValidation(req.body.user);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  // getting user data
  const user = await User.findById(req.user._id).select("+password");
  if (user) {
    user.bio = req.body.user.bio || user.bio;
    user.image = req.body.user.image || user.image;
    if (req.body.user.password) {
      user.password = req.body.user.password;
    }

    //   update user
    const updateUser = await user.save();
    res.status(200).json({ user: updateUser });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});
