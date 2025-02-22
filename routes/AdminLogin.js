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
const { Adminlogin } = require("./repository/helper");
const { EncrypterString, Encrypter } = require("./repository/crytography");
var router = express.Router();
//const currentDate = moment();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("AdminloginLayout", { title: "Express" });
});

module.exports = router;


router.post("/login", (req, res) => {
  try {
    const {username, password} = req.body;

    console.log(req.body);

    Encrypter(password, (err, encrypted) => {
      if (err) console.error("Error: ", err);

      let sql = `SELECT
      au_admin_id AS admin_id,
      CONCAT(ma_first_name,' ',ma_last_name) AS fullname,
      au_role AS role_type,
      au_user_status AS status,
      ma_image AS image
      FROM admin_user
      INNER JOIN master_admin ON admin_user.au_admin_id = ma_admin_id
      WHERE au_user_name = '${username}'
      AND au_password = '${encrypted}'`;

      console.log(sql);
      

      mysql.mysqlQueryPromise(sql)
        .then((result) => {
          if (result.length !== 0) {
            const user = result[0];
            if (
              user.status === "Active"
            ) {
              let data = Adminlogin(result);
                data.forEach((user) => {
                  req.session.jwt = EncrypterString(
                    jwt.sign(
                      JSON.stringify({
                        admin_id: user.admin_id,
                        fullname: user.fullname,
                      }),
                      process.env._SECRET_KEY
                    ),
                    {}
                  );
                  req.session.admin_id = user.admin_id;
                  req.session.fullname = user.fullname;
                  req.session.role_type = user.role_type;
                  req.session.status = user.status;
                  req.session.image = user.image;
                });
                return res.json({
                  msg: "success",
                  data: data,
                });
            } else {
              return res.json({
                msg: "inactive",
              });
            }
          } else {
            return res.json({
              msg: "incorrect",
            });
          }
        })
        .catch((error) => {
          return res.json({
            msg: "error",
            data: error,
          });
        });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
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

