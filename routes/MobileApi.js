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
  GetCurrentDatetime,
} = require("./repository/customhelper");
const { DataModeling } = require("./model/lagonaDb");
const {
  AdminLogin,
  MerchantLogin,
  CustomerLogin,
} = require("./repository/helper");
const { EncrypterString, Encrypter } = require("./repository/crytography");
var router = express.Router();
const verifyJWT = require("../middleware/authenticator");
const e = require("express");
const { log } = require("winston");
//const currentDate = moment();

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("AdminLoginLayout", { title: "Express" });
// });

module.exports = router;

router.post("/signUp", (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      validid,
      email,
      username,
      password,
      mobile,
    } = req.body;
    let status = "Active";
    let create_date = GetCurrentDatetime();

    let encrypted = EncrypterString(password);

    let sql = InsertStatement("master_customer", "mc", [
      "first_name",
      "middle_name",
      "last_name",
      "valid_id",
      "email",
      "username",
      "password",
      "mobile",
      "create_date",
      "status",
    ]);

    let data = [
      [
        first_name,
        middle_name,
        last_name,
        validid,
        email,
        username,
        encrypted,
        mobile,
        create_date,
        status,
      ],
    ];

    let validationQuery1 = SelectStatement(
      `SELECT 1 FROM master_customer WHERE mc_mobile = ?`,
      [mobile]
    );

    let validationQuery2 = SelectStatement(
      `SELECT 1 FROM master_customer WHERE mc_email = ?`,
      [email]
    );

    Check(validationQuery1)
      .then((result1) => {
        if (result1.length > 0) {
          return Promise.reject(
            JsonWarningResponse(MessageStatus.EXIST, MessageStatus.EXISTMOBILE)
          );
        }
        return Check(validationQuery2);
      })
      .then((result2) => {
        if (result2.length > 0) {
          return Promise.reject(
            JsonWarningResponse(MessageStatus.EXIST, MessageStatus.EXISTEMAIL)
          );
        }
        InsertTable(sql, data, (err, result) => {
          if (err) {
            console.log(err);
            return res.json(JsonErrorResponse(err));
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

router.get("/loadMerchant", (req, res) => {
  try {
    let sql = `
        SELECT
        mm_merchant_id,
        mm_merchant_code,
        mm_business_name,
        mm_business_branch
        FROM master_merchant
        WHERE mm_status = 'Active'`;

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
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/loadLogoMerchant", (req, res) => {
  try {
    let merchant_id = req.body.merchant_id;
    let sql = `
        SELECT
        mm_merchant_id,
        mm_logo
        FROM master_merchant
        WHERE mm_status = 'Active'
        AND mm_merchant_id = '${merchant_id}'`;

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
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/getCategoryMerch", (req, res) => {
  try {
    let merchant_id = req.body.merchant_id;
    let sql = `
        SELECT 
        *
        FROM menu_category
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
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

// router.post("/loginCustomer", (req, res) => {
//   try {
//     const { username, password } = req.body;
//     let role_type = "Customer";

//     Encrypter(password, (err, encrypted) => {
//       if (err) return console.error("Error: ", err);

//       let sql = `SELECT
//         mc_customer_id as cus_id,
//         CONCAT(mc_first_name,' ',mc_last_name) as cus_fullname,
//         mc_status as status
//         FROM master_customer
//         WHERE mc_username = '${username}'
//         AND mc_password = '${encrypted}'`;

//       mysql.mysqlQueryPromise(sql)
//         .then((result) => {
//           if (result.length === 0) {
//             return res.json({ msg: "incorrect" });
//           }

//           const user = result[0];

//           if (user.status !== "Active") {
//             return res.json({ msg: "inactive" });
//           }
//           result.forEach((row) => {
//             row.role_type = role_type;
//           });

//           let data = CustomerLogin(result);
//           data.forEach((user) => {
//             req.session.jwt = EncrypterString(
//               jwt.sign(
//                 JSON.stringify({
//                     cus_id: user.cus_id,
//                     cus_fullname: user.cus_fullname,
//                 }),
//                 process.env._SECRET_KEY
//               ),
//               {}
//             );
//             req.session.cus_id = user.cus_id;
//             req.session.cus_fullname = user.cus_fullname;
//             req.session.role_type = user.role_type;
//           });

//           console.log(data);

//           return res.json({ msg: "success", data: data });
//         })
//         .catch((error) => {
//           return res.json({ msg: "error", data: error });
//         });
//     });
//   } catch (error) {
//     console.log(error);
//     res.json(JsonErrorResponse(error));
//   }
// });

router.post("/loginCustomer", (req, res) => {
  try {
    const { username, password } = req.body;
    let role_type = "Customer";

    Encrypter(password, (err, encrypted) => {
      if (err) return console.error("Error: ", err);

      let sql = `SELECT
          mc_customer_id as cus_id,
          CONCAT(mc_first_name,' ',mc_last_name) as cus_fullname,
          mc_status as status
          FROM master_customer
          WHERE mc_username = '${username}'
          AND mc_password = '${encrypted}'`;

      mysql
        .mysqlQueryPromise(sql)
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

          let data = CustomerLogin(result);

          data.forEach((user) => {
            const tokenPayload = {
              cus_id: user.cus_id,
              cus_fullname: user.cus_fullname,
            };

            const token = jwt.sign(tokenPayload, process.env._SECRET_KEY, {
              expiresIn: "1h",
            });
            const encryptedToken = EncrypterString(token, {});

            req.session.jwt = encryptedToken;
            req.session.cus_id = user.cus_id;
            req.session.cus_fullname = user.cus_fullname;
            req.session.role_type = user.role_type;
            user.token = encryptedToken;
          });

          console.log(data);

          return res.json({ msg: "success", data: data });
        })
        .catch((error) => {
          return res.json({ msg: "error", data: error });
        });
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/logoutCustomer", (req, res) => {
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

router.post("/addAddress", verifyJWT, (req, res) => {
  try {
    const { customer_id, address, geo_code, latitude, longitude, type } =
      req.body;
    let create_date = GetCurrentDatetime();
    let status = "Active";

    let sql = InsertStatement("customer_address", "ca", [
      "customer_id",
      "address",
      "geo_code",
      "latitude",
      "longitude",
      "type",
      "status",
      "create_date",
    ]);

    let data = [
      [
        customer_id,
        address,
        geo_code,
        latitude,
        longitude,
        type,
        status,
        create_date,
      ],
    ];

    let checkStatement = SelectStatement(
      "select * from customer_address where ca_customer_id=? and ca_latitude=? and ca_longitude=?",
      [customer_id, latitude, longitude]
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
