import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";

// @desc    Follow user
// @route   POST /api/profiles/:username/follow
// @access  Protected
export const followUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const userToBeFollowed = await User.findOne({ username });
  if (userToBeFollowed) {
    userToBeFollowed.followers.push(req.user._id);
    await userToBeFollowed.save();
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }

  const currentUser = await User.findOne({ username: req.user.username });
  currentUser.following.push(userToBeFollowed._id);
  await currentUser.save();
  res.status(200).json({ profile: currentUser });
});

// @desc    Unfollow user
// @route   DELETE /api/profiles/:username/follow
// @access  Protected
export const unFollowUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const userToBeUnFollowed = await User.findOne({ username });
  if (userToBeUnFollowed) {
    userToBeUnFollowed.followers.pull(req.user._id);
    await userToBeUnFollowed.save();
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }

  const currentUser = await User.findOne({ username: req.user.username });
  currentUser.following.pull(userToBeUnFollowed._id);
  await currentUser.save();
  res.status(200).json({ profile: currentUser });
});
