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
  MerchantValidator(req, res, "MerchantToApprovedLayout");
});

module.exports = router;

router.get("/loadToApproved", (req, res) => {
  try {
    let merchant_id = req.session.merchant_id;
    let sql = `
    SELECT *,
    CONCAT(mc_first_name,' ',mc_last_name) as mo_fullname
    FROM master_order
    INNER JOIN master_customer ON master_order.mo_customer_id = mc_customer_id
    WHERE mo_merchant_id = '${merchant_id}'
    AND mo_order_status = 'To Approved'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mo_");
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});


router.post("/getPayment", (req, res) => {
  try {
    let order_id = req.order_id;
    let sql = `SELECT
    CONCAT(mc_first_name,' ',mc_last_name) as mo_fullname,
    mo_payment_screenshots,
    DATE_FORMAT(mo_paid_date, '%Y-%m-%d %H:%i:%s') as mo_paid_date
    FROM master_order
    INNER JOIN master_customer ON master_order.mo_customer_id = mc_customer_id
    WHERE mo_order_id = '${order_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mo_");
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error))
  }
});