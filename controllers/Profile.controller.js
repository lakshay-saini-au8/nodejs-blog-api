import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";

// @desc    get user profile user
// @route   GET /api/profiles/:username
// @access  Protected

export const getProfile = asyncHandler(async (req, res) => {
  // find user
  const user = await User.findOne({ username: req.params.username }).select(
    "username bio image"
  );
  if (user) {
    res.status(200).json({ profile: user });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});
