import asyncHandler from "express-async-handler";
import Article from "../models/Article.model.js";
import Comment from "../models/Comment.model.js";
import { commentValidation } from "../utils/validation.js";

// @desc    Add comments
// @route   POST /api/articles/:slug/comments
// @access  Protected

export const addComments = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  //   find article
  const article = await Article.findOne({ slug });
  if (!article) {
    res.status(404);
    throw new Error("Article Not Found");
  }

  // validate comment data
  const { error } = commentValidation(req.body.comment);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const isCommented = await Comment.findOne({ author: req.user._id });
  if (isCommented) {
    res.status(400);
    throw new Error("User already commented");
  }

  article.comments.push({ body: req.body.comment.body, author: req.user._id });
  const updatedArticle = await article.save();
});
