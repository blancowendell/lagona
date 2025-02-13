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
const basicAuth = require("basic-auth");


function swaggerAuth(req, res, next) {
  const user = basicAuth(req);
  const username = "admin";
  const password = "markcute";

  if (!user || user.name !== username || user.pass !== password) {
    res.set("WWW-Authenticate", 'Basic realm="Swagger API Docs"');
    return res.status(401).send("Authentication required.");
  }
  next();
}

const { logger, eventlogger } = require("./routes/utility/logger");

//#region ROUTES IMPORT
var AdminIndexRouter = require("./routes/AdminIndex");
var AdminLoginRouter = require("./routes/AdminLogin");
var AdminHubsRouter = require("./routes/AdminHubs");
var AdminLoadingStationRouter = require("./routes/AdminLoadingStation");
var AdminRidersRouter = require("./routes/AdminRiders");
var AdminMerchantsRouter = require("./routes/AdminMerchants");
var AdminShareholdersRouter = require("./routes/AdminShareholders");
var MerchantLoginRouter = require("./routes/MerchantLogin");
var MerchantIndexRouter = require("./routes/MerchantIndex");
var MerchantProductsRouter = require("./routes/MerchantProducts");
var MerchantCategoryRouter = require("./routes/MerchantCategory");
var MerchantSizeRouter = require("./routes/MerchantSize");
var MerchantComboRouter = require("./routes/MerchantCombo");
var MerchantSoloRouter = require("./routes/MerchantSolo");
var MerchantItemRouter = require("./routes/MerchantItem");
var MerchantExtraRouter = require("./routes/MerchantExtra");
var MobileApiRouter = require("./routes/MobileApi");
var MerchantInventoryRouter = require("./routes/MerchantInventory");
var MerchantOrdersRouter = require("./routes/MerchantOrders");
//#endregion

const verifyJWT = require("./middleware/authenticator");
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
app.use("/api-docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Use eventlogger to log requests
app.use((req, res, next) => {
  eventlogger(req, res, next);
});

//#region ROUTES USE
app.use("/AdminLogin", AdminLoginRouter);
app.use("/MerchantLogin", MerchantLoginRouter);
app.use("/MobileApi", MobileApiRouter);
// app.use(verifyJWT);
app.use("/", AdminIndexRouter);
app.use("/AdminHubs", AdminHubsRouter);
app.use("/AdminLoadingStation", AdminLoadingStationRouter);
app.use("/AdminRiders", AdminRidersRouter);
app.use("/AdminMerchants", AdminMerchantsRouter);
app.use("/AdminShareholders", AdminShareholdersRouter);
app.use("/MerchantIndex", MerchantIndexRouter);
app.use("/MerchantProducts", MerchantProductsRouter);
app.use("/MerchantCategory", MerchantCategoryRouter);
app.use("/MerchantSize", MerchantSizeRouter);
app.use("/MerchantCombo", MerchantComboRouter);
app.use("/MerchantSolo", MerchantSoloRouter);
app.use("/MerchantItem", MerchantItemRouter);
app.use("/MerchantExtra", MerchantExtraRouter);
app.use("/MerchantInventory", MerchantInventoryRouter);
app.use("/MerchantOrders", MerchantOrdersRouter);
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
