import express from "express";
const router = express.Router();

router.post("/", registerUser);

export default router;
