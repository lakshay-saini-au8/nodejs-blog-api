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

  //   checking if user is previously commented or not
  const isCommented = await Comment.findOne({ author: req.user._id });
  if (isCommented) {
    res.status(400);
    throw new Error("User already commented");
  }

  //   creating comment
  const comment = await Comment.create({
    body: req.body.comment.body,
    author: req.user._id,
  });
  const populateComment = await Comment.findById(comment._id).populate(
    "author",
    "username bio image"
  );
  article.comments.push(comment._id);
  await article.save();
  res.status(201).json({ comment: populateComment });
});

// @desc    Get comments
// @route   GET /api/articles/:slug/comments
// @access  Public

export const getComments = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  //   find article
  const article = await Article.findOne({ slug }).populate({
    path: "comments",
    populate: { path: "author", select: "username bio image" },
  });
  if (!article) {
    res.status(404);
    throw new Error("Article Not Found");
  }
  res.status(200).json({ comments: article.comments });
});

// @desc    delete comments
// @route   DELETE /api/articles/:slug/comments/:id
// @access  Private

export const deleteComment = asyncHandler(async (req, res) => {
  const { slug, id } = req.params;
  const comment = await Comment.findById(id);
  const article = await Article.findOne({ slug });
  if (!article) {
    res.status(404);
    throw new Error("Article Not Found");
  }
  if (!comment) {
    res.status(404);
    throw new Error("Comment Not Found");
  }
  await comment.remove();
  article.comments.pull(id);
  await article.save();
  res.status(200).json({
    comment: {
      delete: true,
    },
  });
});
