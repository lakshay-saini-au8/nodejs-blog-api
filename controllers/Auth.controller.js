import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import {
  registerDataValidation,
  loginDataValidation,
} from "../utils/validation.js";
import { generateToken } from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  // checking for data validation
  const { error } = registerDataValidation(req.body.user);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  // checking for existing user
  const userExists = await User.findOne().or([
    {
      email: req.body.user.email,
    },
    {
      username: req.body.user.username,
    },
  ]);
  if (userExists) {
    res.status(400);
    throw new Error("User already Exist");
  }
  // creating new user
  const user = await User.create(req.body.user);
  delete user["_doc"].password;

  res.status(201).json({ user: user });
});

// @desc    Login a  user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  // checking for data validation
  const { error } = loginDataValidation(req.body.user);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  // checking for existing user
  const user = await User.findOne({ email: req.body.user.email }).select(
    "+password"
  );
  if (!user) {
    res.status(401);
    throw new Error("Invalid Email");
  }
  // password matching
  if (!(await user.matchPassword(req.body.user.password))) {
    res.status(401);
    throw new Error("Invalid Password");
  }

  delete user["_doc"].password;

  res
    .status(200)
    .json({ user: { ...user["_doc"], token: generateToken(user._id) } });
});
