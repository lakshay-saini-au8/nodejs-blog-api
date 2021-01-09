import express from "express";
import {
  createArticle,
  deletSingleArticle,
  getAllArticle,
  getSingleArticle,
  updateArticle,
} from "../controllers/Article.controller.js";
import {
  addComments,
  deleteComment,
  getComments,
} from "../controllers/Comment.controller.js";
import { protect } from "../middleware/Auth.middleware.js";
const router = express.Router();

router.route("/").post(protect, createArticle).get(getAllArticle);
router
  .route("/:slug")
  .get(getSingleArticle)
  .delete(protect, deletSingleArticle)
  .put(protect, updateArticle);

router.route("/:slug/comments").post(protect, addComments).get(getComments);

router.delete("/:slug/comments/:id", protect, deleteComment);
export default router;
