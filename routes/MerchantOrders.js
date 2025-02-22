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
      console.log(result);
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

// router.get("/viewRiderStatus", (req, res) => {
//   try {
//     let sql = `    SELECT
//     mm_prio_rider as mm_rider,
//     CONCAT(mr_first_name,' ',mr_last_name) as mm_fullname,
//     mr_rider_selfie as mm_image,
//     mr_rider_code as mm_rider_code
//     FROM master_merchant
//     INNER JOIN master_rider ON master_merchant.mm_prio_rider = mr_rider_id
//     WHERE mr_rider_id = mm_prio_rider
//     AND mr_rider_status = 'Available'`;

//     Select(sql, (err, result) => {
//       if (err) {
//         console.error(err);
//         res.json(JsonErrorResponse(err));
//       }
//       if (result != 0) {
//         let data = DataModeling(result, "mm_");
//         res.json(JsonDataResponse(data));
//       } else {
//         res.json(JsonDataResponse(result));
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.json(JsonErrorResponse(error));
//   }
// });

router.get("/viewRiderStatus", (req, res) => {
  try {
    const sqlPrimary = `
      SELECT
        mr_rider_id,
        mm_prio_rider AS mm_rider,
        CONCAT(mr_first_name, ' ', mr_last_name) AS mm_fullname,
        mr_rider_selfie AS mm_image,
        mr_rider_code AS mm_rider_code
      FROM master_merchant
      INNER JOIN master_rider ON master_merchant.mm_prio_rider = mr_rider_id
      WHERE mr_rider_id = mm_prio_rider
        AND mr_rider_status = 'Available'
    `;

    Select(sqlPrimary, (err, result) => {
      if (err) {
        console.error(err);
        return res.json(JsonErrorResponse(err));
      }

      if (result.length > 0) {
        const data = DataModeling(result, "mm_");
        return res.json(JsonDataResponse(data));
      } else {
        const sqlFallback = `
          SELECT
            mr_rider_id,
            CONCAT(mr_first_name, ' ', mr_last_name) AS mr_fullname,
            mr_rider_selfie,
            mr_rider_code
          FROM master_rider
          WHERE mr_rider_status = 'Available'
          LIMIT 1
        `;

        Select(sqlFallback, (err, fallbackResult) => {
          if (err) {
            console.error(err);
            return res.json(JsonErrorResponse(err));
          }

          if (fallbackResult.length > 0) {
            const data = DataModeling(fallbackResult, "mr_");
            return res.json(JsonDataResponse(data));
          } else {
            return res.json(JsonDataResponse([]));
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/assignRider", (req, res) => {
  try {
    let order_id = req.body.order_id;
    let rider_id = req.body.rider_id;
    let order_take = GetCurrentDatetime();
    let status = "Pending";

    let sql = InsertStatement("order_riders_table", "ort", [
      "order_id",
      "rider_id",
      "status",
      "take_order_time",
    ]);

    let data = [[order_id, rider_id, status, order_take]];

    let checkStatement = SelectStatement(
      "select * from order_riders_table where ort_order_id=? and ort_rider_id=? and ort_status=?",
      [order_id, rider_id, status]
    );

    Check(checkStatement)
      .then((result) => {
        if (result != 0) {
          return res.json(JsonWarningResponse(MessageStatus.EXIST));
        } else {
          InsertTable(sql, data, (err, result) => {
            if (err) {
              console.log(err);
              return res.json(JsonErrorResponse(err));
            }
            res.json(JsonSuccess());
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json(JsonErrorResponse(err));
      });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});



//#region FUNCTION
function Check(sql) {
  return new Promise((resolve, reject) => {
    Select(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
}
//#endregion
