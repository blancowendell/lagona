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
  GetCurrentDatetimeAdd1Hour,
} = require("./repository/customhelper");
const { DataModeling } = require("./model/lagonaDb");
const {
  AdminLogin,
  MerchantLogin,
  RiderLogin,
  CustomerLogin,
  generateCode,
} = require("./repository/helper");
const { EncrypterString, Encrypter } = require("./repository/crytography");
var router = express.Router();
const verifyJWT = require("../middleware/authenticator");
const e = require("express");
const { log } = require("winston");
const sendMail = require("../routes/utility/mailer");
//const currentDate = moment();

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("AdminLoginLayout", { title: "Express" });
// });

module.exports = router;

//#region Customer Api

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

router.post("/loadMerchantLimit", (req, res) => {
  try {
    let type = req.body.type;
    let sql = `
        SELECT
        mm_merchant_id,
        mm_merchant_code,
        mm_business_name,
        mm_business_branch
        FROM master_merchant
        WHERE mm_status = 'Active'
        AND mm_merchant_type = '${type}'
        LIMIT 10`;

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

router.post("/loadMerchantDetail", (req, res) => {
  try {
    let merchant_id = req.body.merchant_id;
    let sql = `
        SELECT
        mm_merchant_id,
        mm_merchant_code,
        mm_business_name,
        mm_business_branch,
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

router.post("/getTypeMerch", (req, res) => {
  try {
    let type = req.body.type;
    let sql = `
        SELECT 
        mm_merchant_id,
        mm_merchant_code,
        mm_business_name,
        mm_business_branch
        FROM master_merchant
        WHERE mm_merchant_type = '${type}'`;

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

router.get("/getSize", (req, res) => {
  try {
    let sql = `
    SELECT
    *
    FROM menu_size`;

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
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/getItem", (req, res) => {
  try {
    let merchant_id = req.body.merchant_id;
    let sql = `
    SELECT
    mi_item_id,
    mi_item_name,
    ms_size_name as mi_name,
    mc_category_name as mi_category,
    mi_item_price,
    mi_description
    FROM menu_item
    INNER JOIN menu_size ON menu_item.mi_size = ms_size_id
    INNER JOIN menu_category ON menu_item.mi_category_id = mc_category_id
    WHERE mi_is_available = 'Active'
    AND mi_merchant_id = '${merchant_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mi_");
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

router.post("/getItemImage", (req, res) => {
  try {
    let item_id = req.body.item_id;
    let sql = `
    SELECT
    mi_item_id,
    mi_item_image
    FROM menu_item
    WHERE mi_item_id = '${item_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mi_");
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

router.post("/getMenuSolo", (req, res) => {
  try {
    let merchant_id = req.body.merchant_id;
    let sql = `
    SELECT
    ms_solo_id,
    ms_solo_name,
    ms_description,
    ms_price
    FROM menu_solo
    WHERE ms_is_available = 'Active'
    AND ms_merchant_id = '${merchant_id}'`;

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
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/getMenuSoloImage", (req, res) => {
  try {
    let item_id = req.body.item_id;
    let sql = `
    SELECT
    ms_solo_id,
    ms_meal_image
    FROM menu_solo
    WHERE ms_solo_id = '${item_id}'`;

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
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/getCombo", (req, res) => {
  try {
    let merchant_id = req.body.merchant_id;
    let sql = `
    SELECT
    mc_combo_id,
    mc_combo_name,
    mc_description,
    mc_price
    FROM menu_combo
    WHERE mc_is_available = 'Active'
    AND mc_merchant_id = '${merchant_id}'`;

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

router.post("/geComboImage", (req, res) => {
  try {
    let combo_id = req.body.combo_id;
    let sql = `
    SELECT
    mc_combo_id,
    mc_meal_image
    FROM menu_combo
    WHERE mc_combo_id = '${combo_id}'`;

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

router.post("/getExtra", (req, res) => {
  try {
    let merchant_id = req.body.merchant_id;
    let sql = `
    SELECT
    me_extra_id,
    me_extra_name,
    me_description,
    me_extra_price
    FROM menu_extras
    WHERE me_is_available = 'Active'
    AND me_merchant_id = '${merchant_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "me_");
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

router.post("/geExtraImage", (req, res) => {
  try {
    let combo_id = req.body.combo_id;
    let sql = `
    SELECT
    me_extra_id,
    me_extra_image
    FROM menu_extras
    WHERE me_extra_id = '${combo_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "me_");
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

router.post("/getCompleteItem", (req, res) => {
  try {
    let item_id = req.body.item_id;
    let sql = `
        SELECT
        *
        FROM menu_item
        WHERE mi_is_available = 'Active'
        AND mi_item_id = '${item_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mi_");
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

router.post("/getCompleteSolo", (req, res) => {
  try {
    let solo_id = req.body.solo_id;
    let sql = `
        SELECT
        *
        FROM menu_solo
        WHERE ms_is_available = 'Active'
        AND ms_solo_id = '${solo_id}'`;

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
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/getCompleteCombo", (req, res) => {
  try {
    let combo_id = req.body.combo_id;
    let sql = `
        SELECT
        *
        FROM menu_combo
        WHERE mc_is_available = 'Active'
        AND mc_combo_id = '${combo_id}'`;

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

router.post("/getCompleteExtra", (req, res) => {
  try {
    let extra_id = req.body.extra_id;
    let sql = `
        SELECT
        *
        FROM menu_extras
        WHERE me_is_available = 'Active'
        AND me_extra_id = '${extra_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "me_");
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

router.post("/orderCheckout", (req, res) => {
  try {
    let;
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

//#endregion

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

//#region Rider Api

router.get("/loadHub", (req, res) => {
  try {
    let sql = ` 
    SELECT
        msh_hub_id,
        msh_hub_name,
        msh_hub_code,
        msh_hub_address
        FROM master_hub_station`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "msh_");
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

router.post("/riderSignUp", async (req, res) => {
  try {
    let rider_code = generateCode(10);
    let create_date = GetCurrentDatetime();
    let status = "Inactive";
    let budget = 0;
    let rider_account_status = "Inactive";
    const {
      first_name,
      hub_id,
      middle_name,
      last_name,
      address,
      mobile,
      email,
      username,
      password,
      selfie,
      driver_license,
      original_certificate,
      certificate_of_registration,
      vehicle_image,
      vehicle_type,
      gender,
      license_code,
    } = req.body;

    let encrypted = EncrypterString(password);
    let otp = generateCode(5);
    let rider_otp_valid = GetCurrentDatetimeAdd1Hour();

    let sql = InsertStatement("master_rider", "mr", [
      "rider_code",
      "hub_id",
      "first_name",
      "middle_name",
      "last_name",
      "address",
      "mobile_number",
      "email",
      "rider_otp",
      "rider_otp_valid",
      "rider_status",
      "user_name",
      "password",
      "rider_selfie",
      "driver_license",
      "OR",
      "CR",
      "vehicle_image",
      "vehicle_type",
      "rider_account_status",
      "rider_registration_date",
      "budget",
      "gender",
      "license_code",
    ]);

    let data = [
      [
        rider_code,
        hub_id,
        first_name,
        middle_name,
        last_name,
        address,
        mobile,
        email,
        otp,
        rider_otp_valid,
        status,
        username,
        encrypted,
        selfie,
        driver_license,
        original_certificate,
        certificate_of_registration,
        vehicle_image,
        vehicle_type,
        rider_account_status,
        create_date,
        budget,
        gender,
        license_code,
      ],
    ];

    let checkEmail = SelectStatement(
      "SELECT * FROM master_rider WHERE mr_email = ?",
      [email]
    );

    let checkStatement = SelectStatement(
      "select * from master_rider where mr_first_name=? and mr_last_name=? and mr_mobile_number=?",
      [first_name, last_name, mobile]
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
            JsonWarningResponse(MessageStatus.EXIST, MessageStatus.EXISTRIDER)
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
              "Congratulations! you are one step closer to becoming a rider",
              `Your OTP code is: ${otp} this will expire in 1 hour`
            );
            console.log("OTP sent to email: " + email);
          } catch (error) {
            console.error("Error sending OTP email:", error);
          }

          res.json(JsonDataResponse("Email sent successfully to: " + email));
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

router.post("/verifyOtpRider", async (req, res) => {
  try {
    const { email, otp } = req.body;
    let status = "Active";

    let sql = `
        SELECT 
        DATE_FORMAT(mr_rider_otp_valid, '%Y-%m-%d %H:%i:%s') as mr_rider_otp_valid
        FROM master_rider
        WHERE mr_email = '${email}'
        AND mr_rider_otp = '${otp}'`;

    if (result.length === 0) {
      return res.json(JsonWarningResponse("Invalid OTP or email"));
    }

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json(JsonErrorResponse(err));
      }

      if (result.length === 0) {
        return res.json(JsonWarningResponse("Invalid OTP or email"));
      }

      let otpValidTime = new Date(result[0].mr_rider_otp_valid);
      let currentTime = new Date();

      if (currentTime > otpValidTime) {
        return res.json(
          JsonWarningResponse("OTP has expired. Please request a new one.")
        );
      }

      let updateStatement = UpdateStatement(
        "master_rider",
        "mr",
        ["rider_status"],
        ["email"]
      );

      let data = [status, email];

      Update(updateStatement, data, (err, result) => {
        if (err) {
          console.error("Error updating rider status: ", err);
          return res.json(JsonErrorResponse(err));
        }
        return res.json(
          JsonDataResponse(
            "Your account has been activated successfully. Proceed to your hub for the budget."
          )
        );
      });
    });
  } catch (error) {
    console.error(error);
    res.json(JsonErrorResponse(error));
  }
});

router.put("/requestOtpRider", (req, res) => {
  try {
    const { email } = req.body;
    let otp = generateCode(5);
    let rider_otp_valid = GetCurrentDatetimeAdd1Hour();

    let data = [];
    let columns = [];
    let arguments = [];

    if (otp) {
      data.push(otp);
      columns.push("rider_otp");
    }

    if (rider_otp_valid) {
      data.push(rider_otp_valid);
      columns.push("rider_otp_valid");
    }

    if (email) {
      data.push(email);
      arguments.push("email");
    }

    let updateStatement = UpdateStatement(
      "master_rider",
      "mr",
      columns,
      arguments
    );
    let checkStatement = SelectStatement(
      "select * from master_rider where mr_email = ?",
      [email]
    );

    Check(checkStatement)
      .then((result) => {
        if ((result = 0)) {
          return res.json(JsonWarningResponse(MessageStatus.NOTEXISTEMAIL));
        } else {
          Update(updateStatement, data, async (err, result) => {
            if (err) console.error("Error: ", err);
            try {
              await sendMail(
                email,
                "Your New OTP Request",
                `Your OTP code is: ${otp} this will expire in 1 hour`
              );
              console.log("OTP sent to email: " + email);
            } catch (error) {
              console.error("Error sending OTP email:", error);
            }
            res.json(JsonDataResponse("New OTP has been sent to: " + email));
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

router.post("/riderLogin", (req, res) => {
  try {
    const { username, password } = req.body;
    let role_type = "Rider";

    Encrypter(password, (err, encrypted) => {
      if (err) return console.error("Error: ", err);

      let sql = `SELECT
          mr_rider_id as rider_id,
          CONCAT(mr_first_name,' ',mr_last_name) as rider_fullname,
          mr_rider_status as status
          FROM master_rider
          WHERE mr_user_name = '${username}'
          AND mr_password = '${encrypted}'`;

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

          let data = RiderLogin(result);

          data.forEach((user) => {
            const tokenPayload = {
              rider_id: user.rider_id,
              rider_fullname: user.rider_fullname,
            };

            const token = jwt.sign(tokenPayload, process.env._SECRET_KEY, {
              expiresIn: "1h",
            });
            const encryptedToken = EncrypterString(token, {});

            req.session.jwt = encryptedToken;
            req.session.rider_id = user.rider_id;
            req.session.rider_fullname = user.rider_fullname;
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

router.put("/getLocation", (req, res) => {
  try {
    const { latitude, longitude, rider_id } = req.body;

    let data = [];
    let columns = [];
    let arguments = [];

    if (latitude) {
      data.push(latitude);
      columns.push("latitude");
    }

    if (longitude) {
      data.push(longitude);
      columns.push("longitude");
    }

    if (rider_id) {
      data.push(rider_id);
      arguments.push("rider_id");
    }

    let updateStatement = UpdateStatement(
      "master_rider",
      "mr",
      columns,
      arguments
    );

    Update(updateStatement, data, (err, result) => {
      if (err) console.error("Error: ", err);
      res.json(JsonSuccess());
    });
  } catch (error) {}
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
