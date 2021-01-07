import express from "express";
import {
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/User.controller.js";
import { protect } from "../middleware/Auth.middleware.js";

const router = express.Router();

router.route("/").get(protect, getCurrentUser).put(protect, updateCurrentUser);

export default router;
