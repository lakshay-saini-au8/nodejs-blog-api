import asyncHandler from "express-async-handler";
import Article from "../models/Article.model.js";
import { createSlug } from "../utils/createSlug.js";
import {
  articleCreateValidation,
  articleUpdateValidation,
} from "../utils/validation.js";

// @desc    Get all article
// @route   GET /api/articles
// @access  public

export const getAllArticle = asyncHandler(async (req, res) => {
  const articles = await Article.find()
    .sort({ createdAt: -1 })
    .populate("author ", "username bio image")
    .populate("comments");
  res.status(200).json({ articlesCount: articles.length, articles: articles });
});

// @desc    Register a new article
// @route   POST /api/articles
// @access  Private

export const createArticle = asyncHandler(async (req, res) => {
  // data validation
  const { error } = articleCreateValidation(req.body.article);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  const slug = createSlug(req.body.article.title);
  // check for the article title according to the user
  const articleExists = await Article.findOne({ slug });
  if (articleExists) {
    res.status(400);
    throw new Error("Article with same title is present ");
  }
  // create article
  const article = await Article.create({
    ...req.body.article,
    author: req.user._id,
    slug,
  });

  const populatedArticle = await Article.findById(article._id).populate(
    "author",
    "username bio image -_id"
  );
  res.status(201).json({ article: populatedArticle });
});

// @desc    Get single article
// @route   Get /api/articles/:slug
// @access  Public
export const getSingleArticle = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // search for the article
  const article = await Article.findOne({ slug: slug }).populate(
    "author",
    "username bio image -_id"
  );
  if (article) {
    res.status(200).json({ article: article });
  } else {
    res.status(400);
    throw new Error("Article Not present");
  }
});

// @desc Delete single article
// @route DELTE /api/articles/:slug
// @access Private

export const deletSingleArticle = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // find the article =
  const article = await Article.findOne({ slug });
  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }
  if (article.author.toString() === req.user._id.toString()) {
    await article.remove();
    res.status(200).json({ article: { status: "deleted" } });
  } else {
    res.status(403);
    throw new Error("You can delete your own article");
  }
});

// @desc    Update  article
// @route   PUT /api/articles/:slug
// @access  Private

export const updateArticle = asyncHandler(async (req, res) => {
  // url slug
  const { slug } = req.params;
  // data validation
  const { error } = articleUpdateValidation(req.body.article);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  // check for the article title according to the user
  const articleExists = await Article.findOne({ slug });
  if (!articleExists) {
    res.status(400);
    throw new Error("Article not exist ");
  }
  if (articleExists.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can Update only your own article");
  }
  let newSlug;
  if (
    req.body.article.title &&
    req.body.article.title !== articleExists.title
  ) {
    newSlug = createSlug(req.body.article.title);
    articleExists.slug = newSlug;
    articleExists.title = req.body.article.title || articleExists.title;
  }

  articleExists.description =
    req.body.article.description || articleExists.description;
  articleExists.body = req.body.article.body || articleExists.body;

  await articleExists.save();

  const populatedArticle = await Article.findById(articleExists._id).populate(
    "author",
    "username bio image -_id"
  );
  res.status(201).json({ article: populatedArticle });
});
