import express from "express";
import authRoutes from "../routes/Auth.routes.js";
const routes = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.json({ message: "Succes" });
  });

  app.use("/api/users", authRoutes);
};

export default routes;
