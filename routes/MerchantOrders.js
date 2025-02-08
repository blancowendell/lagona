const mysql = require("./repository/lagonaDb");
//const moment = require('moment');
var express = require("express");
const { MerchantValidator } = require("./controller/middleware");
const verifyJWT = require("../middleware/authenticator");
const {
  JsonErrorResponse,
  JsonSuccess,
  JsonWarningResponse,
  MessageStatus,
  JsonDataResponse,
} = require("./repository/response");
const { InsertTable, Select, Update } = require("./repository/dbconnect");
const {
  SelectStatement,
  InsertStatement,
  UpdateStatement,
  GetCurrentDatetime,
} = require("./repository/customhelper");
const { generateCode, refineCurrencyInput } = require("./repository/helper");
const { DataModeling } = require("./model/lagonaDb");
var router = express.Router();
//const currentDate = moment();

/* GET home page. */
router.get("/", function (req, res, next) {
  MerchantValidator(req, res, "MerchantOrdersLayout");
});

module.exports = router;







