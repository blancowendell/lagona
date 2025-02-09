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
const { DecrypterString, EncrypterString } = require("./repository/crytography");
var router = express.Router();
//const currentDate = moment();

/* GET home page. */
router.get("/", function (req, res, next) {
  AdminValidator(req, res, "AdminRidersLayout");
});

module.exports = router;


router.get("/load", (req, res) => {
  try {
    let sql = `
    SELECT
    mr_rider_id,
    mr_rider_code,
    CONCAT(mr_first_name,' ',mr_last_name) as mr_full_name,
    mr_address,
    mr_mobile_number,
    mr_rider_status,
    DATE_FORMAT(mr_rider_registration_date, '%Y-%m-%d %H:%i:%s') as mr_rider_registration_date
    FROM 
    master_rider`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mr_");
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    res.json(JsonErrorResponse(error));
  }
});


router.post("/getrider", (req, res) => {
  try {
    let rider_id = req.body.rider_id;
    let sql = `
    SELECT * FROM master_rider
    WHERE mr_rider_id = '${rider_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json(JsonErrorResponse(err));
      }

      if (result.length > 0) {
        let data = DataModeling(result, "mr_");

        data[0].password = DecrypterString(data[0].password);

        return res.json(JsonDataResponse(data));
      } else {
        return res.json(JsonDataResponse([]));
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});


router.put("/edit", (req, res) => {
  try {
    const {
      rider_id,
      first_name,
      middle_name,
      last_name,
      gender,
      address,
      phone_number,
      email,
      username,
      password,
      vehicle_type,
      rider_status,
      dl_code,
      rider_selfie,
      OR,
      CR,
      driver_license,
      vehicle_image,
    } = req.body;

    let data = [];
    let columns = [];
    let arguments = [];

    let encrypted = EncrypterString(password);

    if (first_name) {
      data.push(first_name);
      columns.push("first_name");
    }

    if (middle_name) {
      data.push(middle_name);
      columns.push("middle_name");
    }

    if (last_name) {
      data.push(last_name);
      columns.push("last_name");
    }

    if (gender) {
      data.push(gender);
      columns.push("gender");
    }

    if (address) {
      data.push(address);
      columns.push("address");
    }

    if (phone_number) {
      data.push(phone_number);
      columns.push("mobile_number");
    }

    if (email) {
      data.push(email);
      columns.push("email");
    }

    if (username) {
      data.push(username);
      columns.push("user_name");
    }

    if (encrypted) {
      data.push(encrypted);
      columns.push("password");
    }

    if (vehicle_type) {
      data.push(vehicle_type);
      columns.push("vehicle_type");
    }

    if (rider_status) {
      data.push(rider_status);
      columns.push("rider_status");
    }

    if (dl_code) {
      data.push(dl_code);
      columns.push("license_code");
    }

    if (rider_selfie) {
      data.push(rider_selfie);
      columns.push("rider_selfie");
    }

    if (OR) {
      data.push(OR);
      columns.push("OR");
    }

    if (CR) {
      data.push(CR);
      columns.push("CR");
    }

    if (driver_license) {
      data.push(driver_license);
      columns.push("driver_license");
    }

    if (vehicle_image) {
      data.push(vehicle_image);
      columns.push("vehicle_image");
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
    let checkStatement = SelectStatement(
      "select * from master_rider where mr_rider_id = ? and mr_rider_selfie = ? and mr_OR = ? and mr_CR = ? and mr_driver_license = ? and mr_vehicle_image = ? and mr_rider_status = ? and mr_gender = ? and mr_license_code = ? and mr_user_name = ? and mr_password = ? and mr_mobile_number = ? and mr_email = ?",
      [rider_id, rider_selfie, OR, CR, driver_license, vehicle_image, rider_status, gender, dl_code, username, password, phone_number, email]
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
