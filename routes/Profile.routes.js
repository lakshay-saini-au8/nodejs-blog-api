import express from "express";
import {
  followUser,
  unFollowUser,
} from "../controllers/Follower.controller.js";
import { getProfile } from "../controllers/Profile.controller.js";
import { protect } from "../middleware/Auth.middleware.js";
const router = express.Router();

router.get("/:username", getProfile);
router
  .route("/:username/follow")
  .post(protect, followUser)
  .delete(protect, unFollowUser);

export default router;
