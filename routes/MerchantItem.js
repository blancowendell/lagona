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
  MerchantValidator(req, res, "MerchantItemLayout");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let merchant_id = req.session.merchant_id;
    let sql = `SELECT
    mi_item_id,
    mi_item_name,
    mi_item_image,
    mi_item_price,
    mc_category_name as mi_category,
    ms_size_name as mi_size,
    mi_is_available,
    DATE_FORMAT(mi_created_at, '%Y-%m-%d %H:%i:%s') as mi_created_at
    FROM menu_item
    INNER JOIN menu_category ON menu_item.mi_category_id = mc_category_id
    INNER JOIN menu_size ON menu_item.mi_size = ms_size_id
    WHERE mi_merchant_id = '${merchant_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mi_");
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
      size,
      category,
      item_name,
      item_amount,
      description,
      image,
    } = req.body;

    let sql = InsertStatement("menu_item", "mi", [
      "item_name",
      "item_image",
      "size",
      "category_id",
      "merchant_id",
      "description",
      "item_price",
      "is_available",
      "created_at",
    ]);

    let data = [
      [
       item_name,
       image,
       size,
       category,
       merchant_id,
       description,
       item_amount,
       status,
       createddate,
      ],
    ];

    let checkStatement = SelectStatement(
      "select * from menu_item where mi_item_name=? and mi_merchant_id=? and mi_size=? and mi_category_id=?",
      [item_name, merchant_id, size, category]
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

router.post("/getitem", async (req, res) => {
  try {
    let item_id = req.body.item_id;
    let sql = `SELECT
    *,
    mc_category_name as mi_category_name,
    ms_size_name as mi_size_name,
    DATE_FORMAT(mi_created_at, '%Y-%m-%d %H:%i:%s') as mi_created_at
    FROM menu_item
    INNER JOIN menu_category ON menu_item.mi_category_id = mc_category_id
    INNER JOIN menu_size ON menu_item.mi_size = ms_size_id
    WHERE mi_item_id = '${item_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mi_");
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
    let merchant_id = req.session.merchant_id;
    const {
      item_id,
      item_name,
      size,
      category_id,
      description,
      item_price,
      is_available,
      item_image,
    } = req.body;

    let create_date = GetCurrentDatetime();

    let data = [];
    let columns = [];
    let arguments = [];

    if (item_name) {
      data.push(item_name);
      columns.push("item_name");
    }

    if (size) {
      data.push(size);
      columns.push("size");
    }

    if (category_id) {
      data.push(category_id);
      columns.push("category_id");
    }

    if (description) {
      data.push(description);
      columns.push("description");
    }

    if (item_price) {
      data.push(item_price);
      columns.push("item_price");
    }

    if (is_available) {
      data.push(is_available);
      columns.push("is_available");
    }

    
    if (item_image) {
      data.push(item_image);
      columns.push("item_image");
    }

    if (create_date) {
      data.push(create_date);
      columns.push("created_at");
    }


    if (item_id) {
      data.push(item_id);
      arguments.push("item_id");
    }

    let updateStatement = UpdateStatement(
      "menu_item",
      "mi",
      columns,
      arguments
    );
    let checkStatement = SelectStatement(
      "select * from menu_item where mi_item_name = ? and mi_item_image = ? and mi_size = ? and mi_category_id = ? and mi_merchant_id = ? and mi_description = ? and mi_item_price = ? and mi_is_available = ?",
      [item_name, item_image, size, category_id, merchant_id, description, item_price, is_available]
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
  