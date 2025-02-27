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
  MerchantValidator(req, res, "MerchantCategoryLayout");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let merchant_id = req.session.merchant_id;
    let sql = `SELECT
    *,
      DATE_FORMAT(mc_created_at, '%Y-%m-%d %H:%i:%s') as mc_created_at
    FROM 
    menu_category
    WHERE mc_category_merchant_id = '${merchant_id}'`;

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
    let createddate = GetCurrentDatetime();
    let merchant_id = req.session.merchant_id;

    const {
      categoryname,
      description,
    } = req.body;

    let sql = InsertStatement("menu_category", "mc", [
      "category_merchant_id",
      "category_name",
      "category_description",
      "created_at",
    ]);

    let data = [
      [
        merchant_id,
        categoryname,
        description,
        createddate,
      ],
    ];

    let checkStatement = SelectStatement(
      "select * from menu_category where mc_category_name=? and mc_category_merchant_id=?",
      [categoryname ,merchant_id]
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

router.post("/viewcategory", (req, res) => {
  try {
    let category_id = req.body.category_id;
    let sql = `SELECT
    *,
      DATE_FORMAT(mc_created_at, '%Y-%m-%d %H:%i:%s') as mc_created_at
    FROM 
    menu_category
    WHERE mc_category_id = '${category_id}'`;

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

router.put("/edit", (req, res) => {
    try {
      const {
        description,
        categoryname,
        category_id,
      } = req.body;
  
      let data = [];
      let columns = [];
      let arguments = []
  
      if (categoryname) {
        data.push(categoryname);
        columns.push("category_name");
      }
  
      if (description) {
        data.push(description);
        columns.push("category_description");
      }
  
    
      if (category_id) {
        data.push(category_id);
        arguments.push("category_id");
      }
  
      let updateStatement = UpdateStatement(
        "menu_category",
        "mc",
        columns,
        arguments
      );
      let checkStatement = SelectStatement(
        "select * from menu_category where mc_category_name = ? and mc_category_id = ?",
        [categoryname, category_id]
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



