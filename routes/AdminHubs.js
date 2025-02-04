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
var router = express.Router();
//const currentDate = moment();

/* GET home page. */
router.get("/", function (req, res, next) {
  AdminValidator(req, res, "AdminHubsLayout");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `
        SELECT
        msh_hub_id,
        msh_hub_code,
        msh_hub_name,
        msh_owner_name,
        msh_email,
        msh_phone_number,
        msh_status,
        DATE_FORMAT(msh_create_date, '%Y-%m-%d %H:%i:%s') as msh_create_date
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
    res.json(JsonErrorResponse(error));
  }
});

router.post("/save", (req, res) => {
  try {
    let status = "Active";
    let createddate = GetCurrentDatetime();
    const {
      hubname,
      ownername,
      hubaddress,
      phonenumber,
      email,
      startingbudget,
      username,
      password,
    } = req.body;
    let hubcode = generateCode(5);

    let refinedValue = refineCurrencyInput(startingbudget);

    let sql = InsertStatement("master_hub_station", "msh", [
      "hub_name",
      "hub_code",
      "owner_name",
      "hub_address",
      "phone_number",
      "email",
      "budget",
      "username",
      "password",
      "create_date",
      "status",
    ]);

    let data = [
      [
        hubname,
        hubcode,
        ownername,
        hubaddress,
        phonenumber,
        email,
        refinedValue,
        username,
        password,
        createddate,
        status,
      ],
    ];

    let checkStatement = SelectStatement(
      "select * from master_hub_station where msh_hub_name=? and msh_owner_name=?",
      [hubname, ownername]
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

router.post("/gethub", async (req, res) => {
    try {
        let hub_id = req.body.hub_id;
        let sql = `SELECT
        *,
        DATE_FORMAT(msh_create_date, '%Y-%m-%d %H:%i:%s') as msh_format_create_date
        FROM master_hub_station
        WHERE msh_hub_id = '${hub_id}'`;

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


router.put("/edit", (req, res) => {
    try {
      const {
        hubname,
        ownername,
        hubaddress,
        phonenumber,
        email,
        username,
        password,
        hub_id,
      } = req.body;
  
      let data = [];
      let columns = [];
      let arguments = [];

      if (hubname) {
        data.push(hubname);
        columns.push("hub_name");
      }
  
      if (ownername) {
        data.push(ownername);
        columns.push("owner_name");
      }
  
      if (hubaddress) {
        data.push(hubaddress);
        columns.push("hub_address");
      }
  
      if (phonenumber) {
        data.push(phonenumber);
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
  
    
      if (hub_id) {
        data.push(hub_id);
        arguments.push("hub_id");
      }
  
      let updateStatement = UpdateStatement(
        "master_hub_station",
        "msh",
        columns,
        arguments
      );
      let checkStatement = SelectStatement(
        "select * from master_hub_station where msh_hub_name = ? and msh_owner_name = ?",
        [hubname, ownername]
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

router.post("/gettopup", async (req, res) => {
    try {
        let hub_id = req.body.hub_id;
        let sql = `SELECT
        *,
        DATE_FORMAT(msh_create_date, '%Y-%m-%d %H:%i:%s') as msh_format_create_date
        FROM master_hub_station
        WHERE msh_hub_id = '${hub_id}'`;

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

router.post("/topup", (req, res) => {
    try {
        let createddate = GetCurrentDatetime();
        const {
            hub_id,
            amount,
        } = req.body;
        let hubcode = generateCode(10);
        let refinedValue = refineCurrencyInput(amount);

        let sql = InsertStatement("hub_station_reload", "hsr", [
            "hub_station_id",
            "reference_code",
            "amount",
            "create_date",
            "date_response",
        ]);

        let data = [
            [
                hub_id,
                hubcode,
                refinedValue,
                createddate,
                createddate,
            ],
        ];

        let checkStatement = SelectStatement(
            "select * from hub_station_reload where hsr_hub_station_id=? and hsr_reference_code=?",
            [hub_id, hubcode]
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

                        let newStatus = parseFloat(amount) <= 0 ? 'Not Credited' : 'Credited';

                        let updateStatusSQL = `UPDATE hub_station_reload
                                               SET hsr_reload_status = ?
                                               WHERE hsr_hub_station_id = ? AND hsr_reference_code = ?`;

                        let updateStatusData = [newStatus, hub_id, hubcode];

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
        let hub_id = req.body.hub_id;
        let sql = `
        SELECT
        hsr_reference_code,
        hsr_amount,
        hrh_status as hsr_status,
        DATE_FORMAT(hrh_create_date, '%Y-%m-%d %H:%i:%s') as hsr_format_create_date
        FROM
        hub_station_reload
        INNER JOIN hub_reload_history ON hub_station_reload.hsr_reload_id = hrh_reload_id
        INNER JOIN master_hub_station ON hub_station_reload.hsr_hub_station_id = msh_hub_id
        WHERE msh_hub_id = '${hub_id}'`;

        Select(sql, (err, result) => {
            if (err) {
                console.error(err);
                res.json(JsonErrorResponse(err));
            }
            if (result != 0) {
                let data = DataModeling(result, "hsr_");
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
