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
var router = express.Router();
//const currentDate = moment();

/* GET home page. */
router.get("/", function (req, res, next) {
  AdminValidator(req, res, "AdminLoadingStationLayout");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `
    SELECT 
    mls_station_id,
    msh_hub_code as mls_hub_code,
    mls_owner_name,
    mls_load_code,
    mls_load_address,
    msh_hub_name as mls_hub_name,
    mls_status,
    DATE_FORMAT(mls_create_date, '%Y-%m-%d %H:%i:%s') as mls_create_date
    FROM master_load_station
    INNER JOIN master_hub_station ON master_load_station.mls_hub_id = msh_hub_id`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mls_");
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
    let budget = 0;

    let createddate = GetCurrentDatetime();
    const {
      hub_code,
      owner_name,
      load_station_name,
      load_station_address,
      phone_number,
      email,
      username,
      password,
      notes,
    } = req.body;
    let hubcode = generateCode(5);

    let encrypted = EncrypterString(password);


    let sql = InsertStatement("master_load_station", "mls", [
      "hub_id",
      "load_name",
      "load_code",
      "owner_name",
      "load_address",
      "phone_number",
      "email",
      "budget",
      "username",
      "password",
      "create_date",
      "status",
      "notes",
    ]);

    let data = [
      [
        hub_code,
        load_station_name,
        hubcode,
        owner_name,
        load_station_address,
        phone_number,
        email,
        budget,
        username,
        encrypted,
        createddate,
        status,
        notes,
      ],
    ];

    let checkStatement = SelectStatement(
      "select * from master_load_station where mls_hub_id=? and mls_load_name=?",
      [hub_code, load_station_name]
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

router.post("/getloadstation", async (req, res) => {
  try {
    let load_station_id = req.body.load_station_id;
    let sql = `SELECT 
      *,
      DATE_FORMAT(mls_create_date, '%Y-%m-%d %H:%i:%s') as mls_format_create_date
      FROM master_load_station
      WHERE mls_station_id = '${load_station_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mls_");

        data[0].password = DecrypterString(data[0].password);

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

router.put("/edit", (req, res) => {
  try {
    const {
      load_id,
      hub_code,
      load_station_name,
      owner_name,
      load_station_address,
      phone_number,
      email,
      username,
      password,
      notes,
    } = req.body;

    let data = [];
    let columns = [];
    let arguments = [];

    if (hub_code) {
      data.push(hub_code);
      columns.push("hub_id");
    }

    if (load_station_name) {
      data.push(load_station_name);
      columns.push("load_name");
    }

    if (owner_name) {
      data.push(owner_name);
      columns.push("owner_name");
    }

    if (load_station_address) {
      data.push(load_station_address);
      columns.push("load_address");
    }

    if (phone_number) {
      data.push(phone_number);
      columns.push("phone_number");
    }

    if (email) {
      data.push(email);
      columns.push("email");
    }

    if (username) {
      data.push(username);
      columns.push("username");
    }

    if (password) {
      data.push(password);
      columns.push("password");
    }

    if (notes) {
      data.push(notes);
      columns.push("notes");
    }

    if (load_id) {
      data.push(load_id);
      arguments.push("station_id");
    }

    let updateStatement = UpdateStatement(
      "master_load_station",
      "mls",
      columns,
      arguments
    );
    let checkStatement = SelectStatement(
      "select * from master_load_station where mls_hub_id = ? and mls_load_name = ?",
      [hub_code, load_station_name]
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

router.post("/topup", (req, res) => {
  try {
    let createddate = GetCurrentDatetime();
    const { load_station_id, amount } = req.body;
    let load_station_code = generateCode(10);
    let refinedValue = refineCurrencyInput(amount);

    let sql = InsertStatement("load_station_reload", "lsr", [
      "load_station_id",
      "reference_code",
      "amount",
      "create_date",
      "date_response",
    ]);

    let data = [[load_station_id, load_station_code, refinedValue, createddate, createddate]];

    let checkStatement = SelectStatement(
      "select * from load_station_reload where lsr_load_station_id=? and lsr_reference_code=?",
      [load_station_id, load_station_code]
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

            let newStatus =
              parseFloat(amount) <= 0 ? "Not Credited" : "Credited";

            let updateStatusSQL = `UPDATE load_station_reload
                                               SET lsr_reload_status = ?
                                               WHERE lsr_load_station_id = ? AND lsr_reference_code = ?`;

            let updateStatusData = [newStatus, load_station_id, load_station_code];

            Update(updateStatusSQL, updateStatusData, (err, updateResult) => {
              if (err) {
                console.log(err);
                return res.json(JsonErrorResponse(err));
              }

              res.json(JsonSuccess());
            });
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

router.post("/gettopuphistory", (req, res) => {
  try {
    let load_station_id = req.body.load_station_id;
    let sql = `
        SELECT
        lsr_reference_code,
        lsr_amount,
        lrh_status as lsr_status,
        DATE_FORMAT(lrh_create_date, '%Y-%m-%d %H:%i:%s') as lsr_format_create_date
        FROM
        load_station_reload
        INNER JOIN load_reload_history ON load_station_reload.lsr_reload_id = lrh_reload_id
        INNER JOIN master_load_station ON load_station_reload.lsr_load_station_id = mls_station_id
        WHERE mls_station_id = '${load_station_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "lsr_");
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
