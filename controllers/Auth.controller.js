import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body.user;
  const user = await User.findOne({ email: email });
  if (user) {
  }
});
