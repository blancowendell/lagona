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


router.get("/getPendingOrders", (req, res) => {
  try {
    let merchant_id = req.session.merchant_id;
    let sql = `
    SELECT *,
    CONCAT(mc_first_name,' ',mc_last_name) as mo_fullname
    FROM master_order
    INNER JOIN master_customer ON master_order.mo_customer_id = mc_customer_id
    WHERE mo_merchant_id = '${merchant_id}'
    AND mo_order_status = 'Pending'`;

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


router.post("/viewOrderDetails", (req, res) => {
  try {
    let order_id = req.body.order_id;
    let sql = `SELECT 
        od.od_details_id,
        mo.mo_order_code as od_order_code,
        od.od_order_category,
        od.od_product_id,
        od.od_quantity,
        od.od_status,
        DATE_FORMAT(od.od_create_date, '%d-%m-%Y %H:%i:%s') AS od_create_date,
        COALESCE(mi.mi_item_name, mc.mc_combo_name, ms.ms_solo_name, me.me_extra_name) AS od_product_name,
        COALESCE(mi.mi_item_image, mc.mc_meal_image, ms.ms_meal_image, me.me_extra_image) AS od_product_image,
        COALESCE(mi.mi_item_price, mc.mc_price, ms.ms_price, me.me_extra_price) AS od_product_price
    FROM order_details od
    INNER JOIN master_order mo ON od.od_order_id = mo.mo_order_id
    LEFT JOIN menu_item mi ON od.od_order_category = 'Item' AND od.od_product_id = mi.mi_item_id
    LEFT JOIN menu_combo mc ON od.od_order_category = 'Combo' AND od.od_product_id = mc.mc_combo_id
    LEFT JOIN menu_solo ms ON od.od_order_category = 'Solo' AND od.od_product_id = ms.ms_solo_id
    LEFT JOIN menu_extras me ON od.od_order_category = 'Extras' AND od.od_product_id = me.me_extra_id
    WHERE od_order_id = '${order_id}'`;
    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "od_");
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





