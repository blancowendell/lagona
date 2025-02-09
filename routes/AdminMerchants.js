const mysql = require("./repository/lagonaDb");
//const moment = require('moment');
var express = require("express");
const { AdminValidator } = require("./controller/middleware");
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
const { EncrypterString, DecrypterString } = require("./repository/crytography");
const e = require("express");
var router = express.Router();
//const currentDate = moment();

/* GET home page. */
router.get("/", function (req, res, next) {
  AdminValidator(req, res, "AdminMerchantsLayout");
});

module.exports = router;


router.get("/load", (req, res) => {
  try {
    let sql = `SELECT 
    mm_merchant_id,
    mm_business_name,
    mm_business_branch,
    mm_mobile,
    mm_status,
    DATE_FORMAT(mm_create_date, '%Y-%m-%d %H:%i:%s') as mm_create_date
    FROM lagona_express.master_merchant`;

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
    res.json(JsonErrorResponse(error));
  }
});

router.post("/save", (req, res) => {
  try {
    let status = "Active";
    let createddate = GetCurrentDatetime();
    let create_by = req.session.fullname;
    const {
      merchant_type,
      business_name,
      merchant_owner,
      business_branch,
      merchant_address,
      latitude,
      longitude,
      qr_code,
      email,
      phone_number,
      logo,
      username,
      password,
    } = req.body;
    let merchant_code = generateCode(10);

    let encrypted = EncrypterString(password);

    let sql = InsertStatement("master_merchant", "mm", [
      "merchant_type",
      "merchant_code",
      "merchant_fullname",
      "business_name",
      "business_branch",
      "merchant_address",
      "latitude",
      "longitude",
      "mobile",
      "email",
      "username",
      "password",
      "logo",
      "payment_qr_code",
      "status",
      "create_by",
      "create_date",
    ]);

    let data = [
      [
        merchant_type,
        merchant_code,
        merchant_owner,
        business_name,
        business_branch,
        merchant_address,
        latitude,
        longitude,
        phone_number,
        email,
        username,
        encrypted,
        logo,
        qr_code,
        status,
        create_by,        
        createddate,
      ],
    ];

    let checkStatement = SelectStatement(
      "select * from master_merchant where mm_business_name=? and mm_business_branch=? and mm_merchant_type=?",
      [business_name, business_branch, merchant_type]
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

router.post("/viewmerchant", (req, res) => {
  try {
    let merchant_id = req.body.merchant_id;
    let sql = `SELECT 
    *,
    DATE_FORMAT(mm_create_date, '%Y-%m-%d %H:%i:%s') as mm_create_date
    FROM master_merchant
    WHERE mm_merchant_id = '${merchant_id}'`;

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
    res.json(JsonErrorResponse(error));
  }
});

router.post("/getmerchant", (req, res) => {
  try {
    let merchant_id = req.body.merchant_id;
    let sql = `SELECT 
    * ,
    DATE_FORMAT(mm_create_date, '%Y-%m-%d %H:%i:%s') as mm_create_date
    FROM master_merchant
    WHERE mm_merchant_id = '${merchant_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json(JsonErrorResponse(err));
      }

      if (result.length > 0) {
        let data = DataModeling(result, "mm_");

        data[0].password = DecrypterString(data[0].password);

        return res.json(JsonDataResponse(data));
      } else {
        return res.json(JsonDataResponse([]));
      }
    });
  } catch (error) {
    return res.json(JsonErrorResponse(error));
  }
});

router.put("/edit", (req, res) => {
  try {
      const {
          business_name,
          business_branch,
          merchant_address,
          merchant_owner,
          latitude,
          longitude,
          qr_code,
          email,
          phone_number,
          logo,
          username,
          password,
          merchant_type,
          merchant_id,
      } = req.body;

      let data = [];
      let columns = [];
      let arguments = [];

      let encrypted = EncrypterString(password);

      // Function to escape apostrophes
      function escapeString(value) {
          return value ? value.replace(/'/g, "''") : value;
      }

      if (merchant_type) {
          data.push(escapeString(merchant_type));
          columns.push("merchant_type");
      }

      if (merchant_owner) {
          data.push(escapeString(merchant_owner));
          columns.push("merchant_fullname");
      }

      if (business_name) {
          data.push(escapeString(business_name));
          columns.push("business_name");
      }

      if (business_branch) {
          data.push(escapeString(business_branch));
          columns.push("business_branch");
      }

      if (merchant_address) {
          data.push(escapeString(merchant_address));
          columns.push("merchant_address");
      }

      if (latitude) {
          data.push(latitude);
          columns.push("latitude");
      }

      if (longitude) {
          data.push(longitude);
          columns.push("longitude");
      }

      if (phone_number) {
          data.push(escapeString(phone_number));
          columns.push("mobile");
      }

      if (email) {
          data.push(escapeString(email));
          columns.push("email");
      }

      if (username) {
          data.push(escapeString(username));
          columns.push("username");
      }

      if (encrypted) {
          data.push(encrypted);
          columns.push("password");
      }

      if (logo) {
          data.push(escapeString(logo));
          columns.push("logo");
      }

      if (qr_code) {
          data.push(escapeString(qr_code));
          columns.push("payment_qr_code");
      }

      if (merchant_id) {
          data.push(merchant_id);
          arguments.push("merchant_id");
      }

      let updateStatement = UpdateStatement(
          "master_merchant",
          "mm",
          columns,
          arguments
      );

      let checkStatement = SelectStatement(
          `SELECT * FROM master_merchant WHERE mm_merchant_id = ? 
          AND mm_business_name = ? 
          AND mm_merchant_type = ? 
          AND mm_merchant_fullname = ? 
          AND mm_business_branch = ? 
          AND mm_merchant_address = ? 
          AND mm_latitude = ? 
          AND mm_longitude = ? 
          AND mm_mobile = ? 
          AND mm_email = ? 
          AND mm_username = ? 
          AND mm_password = ? 
          AND mm_logo = ? 
          AND mm_payment_qr_code = ?`,
          [
              merchant_id,
              escapeString(business_name),
              escapeString(merchant_type),
              escapeString(merchant_owner),
              escapeString(business_branch),
              escapeString(merchant_address),
              latitude,
              longitude,
              escapeString(phone_number),
              escapeString(email),
              escapeString(username),
              encrypted,
              escapeString(logo),
              escapeString(qr_code)
          ]
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

