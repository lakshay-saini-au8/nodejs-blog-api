import express from "express";
import { errorHandler, notFound } from "../middleware/Error.middleware.js";
import authRoutes from "../routes/Auth.routes.js";
import userRoutes from "../routes/User.routes.js";
import profileRoutes from "../routes/Profile.routes.js";
import articleRoutes from "../routes/Article.routes.js";
const routes = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/users", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/profiles", profileRoutes);
  app.use("/api/articles", articleRoutes);
  app.use(notFound);
  app.use(errorHandler);
};

export default routes;
