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
  MerchantValidator(req, res, "MerchantSoloLayout");
});

module.exports = router;


router.get("/load", (req, res) => {
  try {
    let merchant_id = req.session.merchant_id;
    let sql = `SELECT
    ms_solo_id,
    ms_meal_image,
    ms_solo_name,
    ms_price,
    ms_is_available,
    DATE_FORMAT(ms_created_at, '%Y-%m-%d %H:%i:%s') as ms_created_at
    FROM menu_solo
    WHERE ms_merchant_id = '${merchant_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "ms_");
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

    let sql = InsertStatement("menu_solo", "ms", [
      "merchant_id",
      "meal_image",
      "solo_name",
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
      "select * from menu_solo where ms_merchant_id=? and ms_solo_name=?",
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
    let solo_id = req.body.solo_id;
    let sql = `SELECT 
      *,
      DATE_FORMAT(ms_created_at, '%Y-%m-%d %H:%i:%s') as ms_created_at
      FROM menu_solo
      WHERE ms_solo_id = '${solo_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "ms_");
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
      columns.push("solo_name");
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
      arguments.push("solo_id");
    }

    let updateStatement = UpdateStatement(
      "menu_solo",
      "ms",
      columns,
      arguments
    );
    let checkStatement = SelectStatement(
      "select * from menu_solo where ms_solo_name = ? and ms_meal_image = ? and ms_description = ? and ms_is_available = ? and ms_price = ?",
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