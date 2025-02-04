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
  Validator(req, res, "JasProfilesLayout");
});

module.exports = router;


router.get("/load", (req, res) => {
    try {
      let sql = `SELECT 
            jp_id,
            mm1.mm_member_id as jp_member_id,
            mm1.mm_firstname as jp_firstname,
            mm1.mm_lastname as jp_lastname,
            mm1.mm_phone_code as jp_phone,
            jp_year,
            CONCAT(mm2.mm_firstname, ' ', mm2.mm_lastname, ' (', mm2.mm_email, ')') as jp_technician,
            mp_province_name as jp_area,
            DATE_FORMAT(jp_create_date, '%d-%m-%Y') as jp_create_date,
            DATE_FORMAT(jp_modified_at, '%d-%m-%Y') as jp_modified_at
        FROM jas_profiles
        INNER JOIN master_member mm1 ON jas_profiles.jp_farmer_user_id = mm1.mm_member_id
        INNER JOIN master_member mm2 ON jas_profiles.jp_technician_id = mm2.mm_member_id
        INNER JOIN master_province ON jas_profiles.jp_area = mp_province_id`;
        
      Select(sql, (err, result) => {
        if (err) {
          console.error(err);
          res.json(JsonErrorResponse(err));
        }  
        if (result != 0) {
          let data = DataModeling(result, "jp_");
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
  