// In Server.js

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
const { SetMongo } = require("./routes/controller/mongoose");
const cors = require("cors");
const swaggerDocs = require("./document/swagger");
const swaggerUi = require("swagger-ui-express");

// Import logger and eventlogger from the logger file
const { logger, eventlogger } = require("./routes/utility/logger");

//#region ROUTES IMPORT
var AdminIndexRouter = require("./routes/AdminIndex");
var AdminLoginRouter = require("./routes/AdminLogin");
var AdminHubsRouter = require("./routes/AdminHubs");
//#endregion

var app = express();

SetMongo(app);

// View engine setup
app.set("views", path.join(__dirname, "views/layout"));
app.set("view engine", "ejs");

// Setup morgan for logging HTTP requests
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 500000 })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "assets")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use eventlogger to log requests
app.use((req, res, next) => {
  eventlogger(req, res, next);
});

//#region ROUTES USE
app.use("/", AdminIndexRouter);
app.use("/AdminLogin", AdminLoginRouter);
app.use("/AdminHubs", AdminHubsRouter);
//#endregion

app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  logger.error(err.message); 

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
