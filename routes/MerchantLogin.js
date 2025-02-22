const mysql = require("./repository/lagonaDb");
//const moment = require('moment');
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
} = require("./repository/customhelper");
const { DataModeling } = require("./model/lagonaDb");
const { Adminlogin, MerchantLogin } = require("./repository/helper");
const { Encrypter, EncrypterString } = require("./repository/crytography");
var router = express.Router();
//const currentDate = moment();


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("MerchantLoginLayout", { title: "Express" });
});

module.exports = router;

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    let role_type = "Merchant";

    Encrypter(password, (err, encrypted) => {
      if (err) return console.error("Error: ", err);

      let sql = `SELECT
        mm_merchant_id as merchant_id,
        mm_merchant_code as merchant_code,
        mm_merchant_fullname as fullname,
        mm_status as status,
        mm_logo as image
        FROM master_merchant
        WHERE mm_username = '${username}'
        AND mm_password = '${encrypted}'`;

        console.log(sql);
        

      mysql.mysqlQueryPromise(sql)
        .then((result) => {
          if (result.length === 0) {
            return res.json({ msg: "incorrect" }); 
          }

          const user = result[0]; 

          if (user.status !== "Active") {
            return res.json({ msg: "inactive" });
          }
          result.forEach((row) => {
            row.role_type = role_type;
          });

          let data = MerchantLogin(result);
          data.forEach((user) => {
            req.session.jwt = EncrypterString(
              jwt.sign(
                JSON.stringify({
                  merchant_id: user.merchant_id,
                  fullname: user.fullname,
                }),
                process.env._SECRET_KEY
              ),
              {}
            );
            req.session.merchant_id = user.merchant_id;
            req.session.merchant_code = user.merchant_code;
            req.session.fullname = user.fullname;
            req.session.role_type = user.role_type;
            req.session.status = user.status;
            req.session.image = user.image;
          });

          console.log(data);
          

          return res.json({ msg: "success", data: data });
        })
        .catch((error) => {
          console.log(error);
          return res.json({ msg: "error", data: error });
        });
    });
  } catch (error) {
    res.json({ msg: error });
  }
});


router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      res.json({
        msg: err,
      });
    res.json({
      msg: "success",
    });
  });
});

