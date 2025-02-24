const mysql = require("./repository/lagonaDb");
var express = require("express");
const jwt = require("jsonwebtoken");
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
  GetCurrentDatetimeAdd1Hour,
} = require("./repository/customhelper");
const { DataModeling } = require("./model/lagonaDb");
const { MerchantLogin, generateCode } = require("./repository/helper");
const { EncrypterString, Encrypter } = require("./repository/crytography");
var router = express.Router();
const verifyJWT = require("../middleware/authenticator");
const sendMail = require("./utility/mailer");

module.exports = router;

//#region Merchant Api

router.post("/merchantSignUp", async (req, res) => {
  try {
    let merchant_code = generateCode(10);
    let create_date = GetCurrentDatetime();
    let status = "Inactive";
    const {
      merchant_type,
      merchant_owner,
      business_name,
      business_branch,
      logo,
      mobile,
      email,
      username,
      password,
      merchant_address,
      merchant_geo_code,
      latitude,
      longitude,
      payment_qr_code,
    } = req.body;

    let encrypted = EncrypterString(password);
    let otp = generateCode(5);

    let sql = InsertStatement("master_merchant", "mm", [
      "merchant_type",
      "merchant_code",
      "merchant_fullname",
      "business_name",
      "business_branch",
      "merchant_address",
      "merchant_geo_code",
      "latitude",
      "longitude",
      "mobile",
      "email",
      "username",
      "password",
      "merchant_otp",
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
        merchant_geo_code,
        latitude,
        longitude,
        mobile,
        email,
        username,
        encrypted,
        otp,
        logo,
        payment_qr_code,
        status,
        merchant_owner,
        create_date,
      ],
    ];

    let checkEmail = SelectStatement(
      "SELECT * FROM master_merchant WHERE mm_email = ?",
      [email]
    );

    let checkStatement = SelectStatement(
      "select * from master_merchant where mm_business_name=? and mm_business_branch=? and mm_merchant_type=?",
      [business_name, business_branch, merchant_type]
    );

    Check(checkEmail)
      .then((result1) => {
        if (result1.length > 0) {
          return Promise.reject(
            JsonWarningResponse(MessageStatus.EXIST, MessageStatus.EXISTEMAIL)
          );
        }
        return Check(checkStatement);
      })
      .then((result2) => {
        if (result2.length > 0) {
          return Promise.reject(
            JsonWarningResponse(
              MessageStatus.EXIST,
              MessageStatus.EXISTMERCHANT
            )
          );
        }
        InsertTable(sql, data, async (err, result) => {
          if (err) {
            console.log(err);
            return res.json(JsonErrorResponse(err));
          }
          try {
            await sendMail(
              email,
              "Congratulations! you are one step closer to becoming a merchant",
              `Your OTP code is: ${otp}`
            );
            console.log("OTP sent to email: " + email);
          } catch (error) {
            console.error("Error sending OTP email:", error);
          }

          res.json(JsonSuccess());
        });
      })
      .catch((error) => {
        console.log(error);
        return res.json(error);
      });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/verifyOtpMerchant", async (req, res) => {
  try {
    const { email, otp } = req.body;
    let status = "Active";

    let checkStatement = SelectStatement(
      "SELECT * FROM master_merchant WHERE mm_email = ? AND mm_merchant_otp = ?",
      [email, otp]
    );

    let result = await Check(checkStatement);

    if (result.length === 0) {
      return res.json(JsonWarningResponse("Invalid OTP or email"));
    }

    let data = [];
    let columns = [];
    let arguments = [];

    if (status) {
      data.push(status);
      columns.push("status");
    }

    if (email) {
      data.push(email);
      arguments.push("email");
    }

    let updateStatement = UpdateStatement(
      "master_merchant",
      "mm",
      columns,
      arguments
    );

    Update(updateStatement, data, (err, result) => {
      if (err) console.error("Error: ", err);
      res.json(JsonDataResponse("Your account has been activated"));
    });
  } catch (error) {
    console.error(error);
    res.json(JsonErrorResponse(error));
  }
});

//#endregion

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
