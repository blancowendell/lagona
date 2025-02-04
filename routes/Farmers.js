const mysql = require("./repository/lagonaDb");
//const moment = require('moment');
var express = require("express");
const { Validator } = require("./controller/middleware");
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
} = require("./repository/customhelper");
const { DataModeling } = require("./model/lagonaDb");
var router = express.Router();
//const currentDate = moment();

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "FarmersLayout");
});


module.exports = router;


router.get("/load", (req, res) => {
    try {
      let sql = `SELECT
        mm_member_id,
        CONCAT(mm_firstname,' ',mm_lastname) as mm_fullname,
        mm_phone_code,
        mr_role_name as mm_role,
        mm_gender,
        mr_region_name as mm_region,
        mp_province_name as mm_province,
        mm_register_date
        FROM master_member
        INNER JOIN master_province ON master_member.mm_province = mp_province_id
        INNER JOIN master_region ON master_member.mm_region = mr_region_id
        INNER JOIN master_roles ON master_member.mm_role = mr_role_id`;
        
      Select(sql, (err, result) => {
        if (err) {
          console.error(err);
          res.json(JsonErrorResponse(err));
        }  
        if (result != 0) {
          let data = DataModeling(result, "mm_");
            res.json(JsonDataResponse(data));            
        } else {
          res.json(JsonDataResponse(result));
        }
      });
    } catch (error) {
      console.error(error);
      res.json(JsonErrorResponse(error));
    }
});
  
