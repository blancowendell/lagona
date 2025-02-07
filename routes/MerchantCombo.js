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
  MerchantValidator(req, res, "MerchantComboLayout");
});

module.exports = router;



router.get("/load", (req, res) => {
  try {
    let merchant_id = req.session.merchant_id;
    let sql = `SELECT
    mc_combo_id,
    mc_meal_image,
    mc_combo_name,
    mc_price,
    mc_is_available,
    DATE_FORMAT(mc_created_at, '%Y-%m-%d %H:%i:%s') as mc_created_at
    FROM menu_combo
    WHERE mc_merchant_id = '${merchant_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mc_");
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    res.json(JsonErrorResponse(error));
  }
});

router.post("/save", (req, res) => {
  try {
    let status = "Active";
    let merchant_id = req.session.merchant_id;

    let createddate = GetCurrentDatetime();
    const {
      combo_name,
      combo_description,
      combo_price,
      logo,
    } = req.body;

    let sql = InsertStatement("menu_combo", "mc", [
      "merchant_id",
      "meal_image",
      "combo_name",
      "description",
      "price",
      "is_available",
      "created_at",
    ]);

    let data = [
      [
        merchant_id,
        logo,
        combo_name,
        combo_description,
        combo_price,
        status,
        createddate,
      ],
    ];

    let checkStatement = SelectStatement(
      "select * from menu_combo where mc_merchant_id=? and mc_combo_name=?",
      [merchant_id, combo_name]
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

router.post("/getcombo", async (req, res) => {
  try {
    let combo_id = req.body.combo_id;
    let sql = `SELECT 
      *,
      DATE_FORMAT(mc_created_at, '%Y-%m-%d %H:%i:%s') as mc_created_at
      FROM menu_combo
      WHERE mc_combo_id = '${combo_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mc_");
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

    let create_date = GetCurrentDatetime();

    let data = [];
    let columns = [];
    let arguments = [];

    if (combo_name) {
      data.push(combo_name);
      columns.push("combo_name");
    }

    if (combo_price) {
      data.push(combo_price);
      columns.push("price");
    }

    if (logo) {
      data.push(logo);
      columns.push("meal_image");
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
      arguments.push("combo_id");
    }

    let updateStatement = UpdateStatement(
      "menu_combo",
      "mc",
      columns,
      arguments
    );
    let checkStatement = SelectStatement(
      "select * from menu_combo where mc_combo_name = ? and mc_meal_image = ? and mc_description = ? and mc_is_available = ? and mc_price = ?",
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
  