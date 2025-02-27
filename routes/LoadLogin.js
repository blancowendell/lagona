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
const { LoadStationLogin } = require("./repository/helper");
const { EncrypterString, Encrypter } = require("./repository/crytography");
var router = express.Router();
//const currentDate = moment();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("LoadLoginLayout", { title: "Express" });
});

module.exports = router;


router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    let role_type = "Load Station";

    Encrypter(password, (err, encrypted) => {
      if (err) return console.error("Error: ", err);

      let sql = `SELECT
      mls_station_id AS station_id,
      mls_load_name AS load_name,
      mls_status AS status,
      mls_load_code AS code
      FROM master_load_station
      WHERE mls_username = '${username}'
      AND mls_password = '${encrypted}'`;

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

          let data = LoadStationLogin(result);
          data.forEach((user) => {
            req.session.jwt = EncrypterString(
              jwt.sign(
                JSON.stringify({
                  station_id: user.station_id,
                  load_name: user.load_name,
                }),
                process.env._SECRET_KEY
              ),
              {}
            );
            req.session.station_id = user.station_id;
            req.session.load_name = user.load_name;
            req.session.role_type = user.role_type;
            req.session.status = user.status;
            req.session.code = user.code;
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

