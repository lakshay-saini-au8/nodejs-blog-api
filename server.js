import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./startup/db.js";
import routes from "./startup/routes.js";

const app = express();

// for .env config
dotenv.config();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// // enables cors
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
// database connection
connectDB();
app.get("/", (req, res) => {
  res.status(200).json({ success });
});
// all routes function
routes(app);

const PORT_NO = process.env.PORT || process.env.PORT_NO;

app.listen(PORT_NO, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(
      `Server is running at ${PORT_NO} in ${process.env.NODE_ENV} mode`
    );
  }
});
