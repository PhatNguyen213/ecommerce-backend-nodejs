require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const { checkOverload } = require("./helpers/check.connect");
const app = express();
const router = require("./routes");

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// init db
require("./dbs/init.mongodb");

// init routes
app.use("/", router);

// if no matching route, this will run and forward Not Found error
app.use((req, res, next) => {
  const newError = new Error("Not Found");
  newError.status = 404;
  next(newError);
});

/**
 * Handle:
 * Synchronous: Uncaught exception and Known Exception
 * Asynchronous: API/DB errors
 */
app.use((error, req, res, next) => {
  const status = error.status || 500;
  return res
    .status(status)
    .json({ code: status, message: error.message || "Internal Error" });
});

module.exports = app;
