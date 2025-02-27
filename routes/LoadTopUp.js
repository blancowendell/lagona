const mysql = require("./repository/lagonaDb");
const moment = require('moment');
var express = require("express");
const { LoadStationValidator } = require("./controller/middleware");
const verifyJWT = require("../middleware/authenticator");
const {
  JsonErrorResponse,
  JsonSuccess,
  JsonWarningResponse,
  MessageStatus,
  JsonDataResponse,
} = require("./repository/response");
const { InsertTable, Select, Update} = require("./repository/dbconnect");
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
  LoadStationValidator(req, res, "LoadTopUpLayout");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let station_id = req.session.station_id;
    let sql = `SELECT 
    rr_reload_id,
    DATE_FORMAT(rr_create_date, '%b %d %Y, %h:%i %p') as rr_create_date,
    CONCAT(mr_first_name,' ',mr_last_name) as rr_fullname,
    rr_amount,
    rr_reload_status
    FROM rider_reload
    INNER JOIN master_rider ON rider_reload.rr_rider_id = mr_rider_id
    WHERE rr_load_station_id = '${station_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "rr_");
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    res.json(JsonErrorResponse(error));
  }
});

router.get("/getBudget", (req, res) => {
  try {
    let station_id = req.session.station_id;
    let sql = `
    SELECT
    mls_budget 
    FROM master_load_station
    WHERE mls_station_id = '${station_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mls_");
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

router.post("/getTopUp", (req, res) => {
  try {
    let load_id = req.body.load_id;
    let sql = `
    SELECT 
    DATE_FORMAT(rr_create_date, '%b %d %Y, %h:%i %p') as rr_create_date,
    CONCAT(mr_first_name,' ',mr_last_name) as rr_fullname,
    mr_rider_code as rr_rider_code,
    rr_amount,
    rr_attachment,
    rr_reload_status
    FROM rider_reload
    INNER JOIN master_rider ON rider_reload.rr_rider_id = mr_rider_id
    WHERE rr_reload_id = '${load_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "rr_");
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

// router.post("/topUp", (req, res) => {
//   try {
//     let station_id = req.session.station_id;
//     let date_response = GetCurrentDatetime();
//     const { load_id, load_amount, create_date, status, attachment } = req.body;

//     const checkQuery = `
//       SELECT rr_rider_id
//       FROM rider_reload
//       WHERE rr_reload_id = '${load_id}'`;

//     Select(checkQuery, (err, result) => {
//       if (err) {
//         console.error("Error: ", err);
//         return res.json(JsonErrorResponse(err));
//       }

//       if (result.length === 0) {
//         return res.json(JsonErrorResponse("Rider not found."));
//       }

//       const rider = result[0];

//       let sql = InsertStatement("rider_reload_history", "rrh", [
//         "rider_id",
//         "load_station_id",
//         "amount",
//         "attachment",
//         "create_date",
//         "date_response",
//         "status",
//         "reload_reference_id",
//       ]);

//       let data = [
//         [
//           rider,
//           station_id,
//           load_amount,
//           attachment,
//           create_date,
//           date_response,
//           status,
//           load_id,
//         ],
//       ];

//       let checkStatement = SelectStatement(
//         `SELECT 
//             CASE 
//               WHEN ? > mls_budget THEN 'Insufficient Funds' 
//               ELSE 'Sufficient Funds' 
//             END AS budget_status 
//          FROM master_load_station 
//          WHERE mls_station_id = ?`,
//         [load_amount, station_id]
//       );
      
//       Check(checkStatement)
//         .then((result) => {
//           if (result != 'Sufficient Funds') {
//             return res.json(JsonWarningResponse(MessageStatus.INSUFFICIENT));
//           } else {
//             InsertTable(sql, data, (err, result) => {
//               if (err) {
//                 console.log(err);
//                 return res.json(JsonErrorResponse(err));
//               }

//               let data = [];
//               let columns = [];
//               let arguments = [];

//               if (paid_date) {
//                 data.push(paid_date);
//                 columns.push("paid_date");
//               }

//               if (payment_screenshots) {
//                 data.push(payment_screenshots);
//                 columns.push("payment_screenshots");
//               }

//               if (order_id) {
//                 data.push(order_id);
//                 arguments.push("order_id");
//               }

//               let updateStatement = UpdateStatement(
//                 "master_order",
//                 "mo",
//                 columns,
//                 arguments
//               );

//               Update(updateStatement, data, (err, result) => {
//                 if (err) console.error("Error: ", err);
//                 res.json(JsonSuccess());
//               });
//               res.json(JsonSuccess());
//             });
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//           res.json(JsonErrorResponse(err));
//         });
//     });
//   } catch (error) {
//     console.log(error);
//     res.json(JsonErrorResponse(error));
//   }
// });

router.post("/topUp", async (req, res) => {
  try {
    let station_id = req.session.station_id;
    let date_response = GetCurrentDatetime();
    const { load_id, load_amount, create_date, status, attachment } = req.body;

    let reloadType = "TopUp";
    let createDate = moment(create_date, "MMM DD YYYY, hh:mm A").format("YYYY-MM-DD HH:mm:ss");

    if (!load_id || !load_amount || !status) {
      return res.json(JsonErrorResponse("Missing required fields."));
    }

    const checkQuery = `SELECT rr_rider_id FROM rider_reload WHERE rr_reload_id = '${load_id}'`;
    let result = await mysql.SelectPromise(checkQuery);
    
    if (result.length === 0) {
      return res.json(JsonErrorResponse("Rider not found."));
    }

    const rider_id = result[0].rr_rider_id;

    let checkBudgetSQL = `SELECT mls_budget FROM master_load_station WHERE mls_station_id = '${station_id}'`;
    let budgetResult = await mysql.SelectPromise(checkBudgetSQL);

    if (budgetResult.length === 0) {
      return res.json(JsonErrorResponse("Load station not found."));
    }

    let available_budget = parseFloat(budgetResult[0].mls_budget);

    if (load_amount > available_budget) {
      return res.json(JsonWarningResponse(MessageStatus.INSUFFICIENT));
    }

    let insertHistorySQL = InsertStatement("rider_reload_history", "rrh", [
      "rider_id",
      "load_station_id",
      "amount",
      "attachment",
      "create_date",
      "date_response",
      "reload_type",
      "status",
      "reload_reference_id",
    ]);

    let historyData = [[
      rider_id,
      station_id,
      load_amount,
      attachment,
      createDate,
      date_response,
      reloadType,
      status,
      load_id,
    ]];

    await mysql.InsertTablePromise(insertHistorySQL, historyData);

    if (status === "Rejected") {
      return res.json(JsonSuccess("Top-up recorded as rejected."));
    }

    let updateLoadStation = `UPDATE master_load_station SET mls_budget = mls_budget - ${load_amount} WHERE mls_station_id = '${station_id}'`;
    let updateRiderBudget = `UPDATE master_rider SET mr_budget = mr_budget + ${load_amount} WHERE mr_rider_id = '${rider_id}'`;

    await mysql.mysqlQueryPromise(updateLoadStation);
    await mysql.mysqlQueryPromise(updateRiderBudget);

    // ✅ Update `rr_reload_status` to "Credited"
    let updateRiderReloadStatus = `UPDATE rider_reload SET rr_reload_status = 'Credited' WHERE rr_reload_id = '${load_id}'`;
    await mysql.mysqlQueryPromise(updateRiderReloadStatus);

    return res.json(JsonSuccess("Top-up successful"));

  } catch (error) {
    console.error("Unexpected error:", error);
    res.json(JsonErrorResponse(error));
  }
});







router.post("/getextra", async (req, res) => {
  try {
    let extra_id = req.body.extra_id;
    let sql = `SELECT 
      *
      FROM menu_extras
      WHERE me_extra_id = '${extra_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "me_");
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

router.put("/edit", (req, res) => {
  try {
    const {
      combo_id,
      combo_name,
      combo_price,
      logo,
      combo_description,
      combo_availability,
    } = req.body;

    console.log(logo, "img");

    let create_date = GetCurrentDatetime();

    let data = [];
    let columns = [];
    let arguments = [];

    if (combo_name) {
      data.push(combo_name);
      columns.push("extra_name");
    }

    if (combo_price) {
      data.push(combo_price);
      columns.push("extra_price");
    }

    if (logo) {
      data.push(logo);
      columns.push("extra_image");
    }

    if (combo_description) {
      data.push(combo_description);
      columns.push("description");
    }

    if (combo_availability) {
      data.push(combo_availability);
      columns.push("is_available");
    }

    if (create_date) {
      data.push(create_date);
      columns.push("created_at");
    }

    if (combo_id) {
      data.push(combo_id);
      arguments.push("extra_id");
    }

    let updateStatement = UpdateStatement(
      "menu_extras",
      "me",
      columns,
      arguments
    );

    let checkStatement = SelectStatement(
      "select * from menu_extras where me_extra_name = ? and me_extra_image = ? and me_description = ? and me_is_available = ? and me_extra_price = ?",
      [combo_name, logo, combo_description, combo_availability, combo_price]
    );

    Check(checkStatement)
      .then((result) => {
        if (result != 0) {
          return res.json(JsonWarningResponse(MessageStatus.EXIST));
        } else {
          Update(updateStatement, data, (err, result) => {
            if (err) console.error("Error: ", err);
            res.json(JsonSuccess());
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json(JsonErrorResponse(error));
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
