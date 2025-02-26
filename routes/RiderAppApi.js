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
const { RiderLogin, generateCode } = require("./repository/helper");
const { EncrypterString, Encrypter } = require("./repository/crytography");
var router = express.Router();
const verifyJWT = require("../middleware/authenticator");
const sendMail = require("./utility/mailer");

module.exports = router;

//#region WitOut Token Api

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

//#endregion

//#region With Token Api

router.put("/getLocation", verifyJWT, (req, res) => {
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

router.post("/riderTopUp", verifyJWT, async (req, res) => {
  try {
    const { rider_id, station_id, amount, attachment } = req.body;
    let status = "Requested";
    let create_date = GetCurrentDatetime();

    let checkStationQuery = SelectStatement(
      "SELECT * FROM master_load_station WHERE mls_station_id=?",
      [station_id]
    );

    let stationExists = await Check(checkStationQuery);
    if (!stationExists || stationExists.length === 0) {
      return res.json(JsonWarningResponse(MessageStatus.NOTEXISTLOADSTATION));
    }

    let sql = InsertStatement("rider_reload", "rr", [
      "rider_id",
      "load_station_id",
      "amount",
      "attachment",
      "create_date",
      "reload_status",
    ]);

    let data = [
      [
        rider_id,
        station_id,
        amount,
        attachment,
        create_date,
        status,
      ],
    ];
    InsertTable(sql, data, (err, result) => {
      if (err) {
        console.log(err);
        return res.json(JsonErrorResponse(err));
      }
      res.json(JsonSuccess());
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

//#endregion

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
