const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db

// init routes
app.get("/", (req, res, next) => {
  const str = "Hello Phat";
  return res.status(200).json({
    message: "Welcome to Ecommerce Backend",
    metadata: str.repeat(10000),
  });
});

// handle errors

module.exports = app;
