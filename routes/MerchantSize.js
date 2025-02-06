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
  MerchantValidator(req, res, "MerchantProductsLayout");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `SELECT
    *,
      DATE_FORMAT(ms_create_date, '%Y-%m-%d %H:%i:%s') as ms_create_date
    FROM 
    menu_size`;

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
    let createddate = GetCurrentDatetime();
    const {
      sizename,
    } = req.body;

    let sql = InsertStatement("menu_size", "ms", [
      "size_name",
      "create_date",
    ]);

    let data = [
      [
        sizename,
        createddate,
      ],
    ];

    let checkStatement = SelectStatement(
      "select * from menu_size where ms_size_name=?",
      [sizename]
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
        // Ensure error is caught correctly here
        console.log(err);
        res.json(JsonErrorResponse(err));
      });
  } catch (error) {
    console.log(error); // Log the error properly
    res.json(JsonErrorResponse(error));
  }
});

router.post("/viewsize", (req, res) => {
  try {
    let size_id = req.body.size_id;
    let sql = `SELECT
    *,
      DATE_FORMAT(ms_create_date, '%Y-%m-%d %H:%i:%s') as ms_create_date
    FROM 
    menu_size
    WHERE ms_size_id = '${size_id}'`;

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

router.put("/edit", (req, res) => {
    try {
      const {
        sizename,
        size_id,
      } = req.body;
  
      let data = [];
      let columns = [];
      let arguments = []
  
      if (sizename) {
        data.push(sizename);
        columns.push("size_name");
      }
  
    
      if (size_id) {
        data.push(size_id);
        arguments.push("size_id");
      }
  
      let updateStatement = UpdateStatement(
        "menu_size",
        "ms",
        columns,
        arguments
      );
      let checkStatement = SelectStatement(
        "select * from menu_size where ms_size_name = ?",
        [sizename]
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



