import express from "express";
import { loginUser, registerUser } from "../controllers/Auth.controller.js";
const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(loginUser);

export default router;
