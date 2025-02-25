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
const sendMail = require("./utility/mailer");

module.exports = router;

//#region WitOut Token Api

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

//#endregion

//#region With Token Api

router.post("/customerCheckout", verifyJWT, async (req, res) => {
  try {
    const {
      merchant_id,
      customer_id,
      order_type,
      lagona_fee,
      order_total,
      address_id,
      order_note,
      order_fee,
      order_details,
    } = req.body;

    if (
      !merchant_id ||
      !customer_id ||
      !order_type ||
      !lagona_fee ||
      !order_total ||
      !address_id ||
      !order_details ||
      !Array.isArray(order_details) ||
      order_details.length === 0
    ) {
      return res
        .status(400)
        .json(
          JsonErrorResponse(
            "All fields are required and order_details must be a non-empty array"
          )
        );
    }

    const checkMerchantQuery = SelectStatement(
      "SELECT * FROM master_merchant WHERE mm_merchant_id = ?",
      [merchant_id]
    );
    const merchantExists = await Check(checkMerchantQuery);

    if (!merchantExists || merchantExists.length === 0) {
      return res.status(400).json(JsonErrorResponse("Merchant does not exist"));
    }

    const checkCustomerQuery = SelectStatement(
      "SELECT * FROM master_customer WHERE mc_customer_id = ?",
      [customer_id]
    );
    const customerExists = await Check(checkCustomerQuery);

    if (!customerExists || customerExists.length === 0) {
      return res.status(400).json(JsonErrorResponse("Customer does not exist"));
    }

    const checkAddressQuery = SelectStatement(
      "SELECT * FROM customer_address WHERE ca_address_id = ? AND ca_customer_id = ?",
      [address_id, customer_id]
    );
    const addressExists = await Check(checkAddressQuery);

    if (!addressExists || addressExists.length === 0) {
      return res.status(400).json(JsonErrorResponse("Address does not exist"));
    }

    for (const item of order_details) {
      if (!item.category || !item.product_id) {
        return res
          .status(400)
          .json(JsonErrorResponse("Invalid order details format"));
      }

      let checkProductQuery;
      switch (item.category) {
        case "Item":
          checkProductQuery = SelectStatement(
            "SELECT * FROM menu_item WHERE mi_item_id = ?",
            [item.product_id]
          );
          break;
        case "Solo":
          checkProductQuery = SelectStatement(
            "SELECT * FROM menu_solo WHERE ms_solo_id = ?",
            [item.product_id]
          );
          break;
        case "Combo":
          checkProductQuery = SelectStatement(
            "SELECT * FROM menu_combo WHERE mc_combo_id = ?",
            [item.product_id]
          );
          break;
        case "Extra":
          checkProductQuery = SelectStatement(
            "SELECT * FROM menu_extras WHERE me_extra_id = ?",
            [item.product_id]
          );
          break;
        default:
          return res.status(400).json(JsonErrorResponse("Wrong category"));
      }

      const productExists = await Check(checkProductQuery);
      if (!productExists || productExists.length === 0) {
        return res
          .status(400)
          .json(
            JsonErrorResponse(
              `Invalid product_id for category ${item.category}`
            )
          );
      }
    }

    const orderCode = generateCode(5);
    const orderStatus = "Pending";
    const createDate = GetCurrentDatetime();

    const masterOrderData = {
      order_code: orderCode,
      merchant_id: merchant_id,
      customer_id: customer_id,
      order_type: order_type,
      order_type_charge: 0.0,
      order_details: JSON.stringify(order_details),
      order_note: order_note || "",
      order_fee: order_fee || 0.0,
      lagona_fee: lagona_fee,
      order_total: order_total,
      order_status: orderStatus,
      payment_screenshots: "",
      address_id: address_id,
    };

    const masterOrderSql = InsertStatement(
      "master_order",
      "mo",
      Object.keys(masterOrderData)
    );
    const masterOrderValues = [Object.values(masterOrderData)];

    InsertTable(masterOrderSql, masterOrderValues, (err, result) => {
      if (err) {
        console.error("Error inserting into master_order:", err);
        return res
          .status(500)
          .json(JsonErrorResponse("Failed to create order"));
      }

      const orderId = result[0].id;

      const orderDetailsData = order_details.map((item) => [
        orderId,
        item.category,
        item.product_id,
        item.quantity,
        "Pending",
        createDate,
      ]);

      const orderDetailsSql = InsertStatement("order_details", "od", [
        "order_id",
        "order_category",
        "product_id",
        "quantity",
        "status",
        "create_date",
      ]);

      InsertTable(orderDetailsSql, orderDetailsData, (err) => {
        if (err) {
          console.error("Error inserting into order_details:", err);
          return res
            .status(500)
            .json(JsonErrorResponse("Failed to add order details"));
        }

        res.json({
          success: true,
          message: "Order placed successfully",
          order_id: orderId,
        });
      });
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json(JsonErrorResponse("Internal server error"));
  }
});

router.post("/addAddress", verifyJWT, async (req, res) => {
  try {
    const { customer_id, address, geo_code, latitude, longitude, type } =
      req.body;
    let create_date = GetCurrentDatetime();
    let status = "Active";

    let checkCustomerQuery = SelectStatement(
      "SELECT * FROM customer_address WHERE ca_customer_id=?",
      [customer_id]
    );

    let customerExists = await Check(checkCustomerQuery);
    if (!customerExists || customerExists.length === 0) {
      return res.json(JsonWarningResponse(MessageStatus.NOTEXISTCUSTOMER));
    }

    let checkStatement = SelectStatement(
      "SELECT * FROM customer_address WHERE ca_customer_id=? AND ca_latitude=? AND ca_longitude=?",
      [customer_id, latitude, longitude]
    );

    let addressExists = await Check(checkStatement);
    if (addressExists && addressExists.length > 0) {
      return res.json(JsonWarningResponse(MessageStatus.EXIST));
    }
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

router.post("/getPaymentQrCode", verifyJWT, async (req, res) => {
  try {
    let customer_id = req.body.customer_id;

    let sql = `
    	SELECT 
      mm_business_name,
      mm_payment_qr_code,
      mm_merchant_code,
      mo_order_total as mm_total,
      ort_del_fee as mm_del_fee
      FROM master_merchant
      INNER JOIN master_order ON master_merchant.mm_merchant_id = mo_merchant_id
      INNER JOIN order_riders_table ON master_order.mo_order_id = ort_order_id
      WHERE mm_merchant_id = mo_merchant_id
      AND mo_order_id = ort_order_id
      AND mo_customer_id = '${customer_id}'
      AND mo_order_status = 'To Be Paid'`;

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

router.put("/sendPayment", verifyJWT, (req, res) => {
  try {
    const { order_id, payment_screenshots } = req.body;
    let paid_date = req.body.paid_date;

    if (!order_id || !payment_screenshots) {
      return res.json(
        JsonErrorResponse("Order ID and payment screenshots are required.")
      );
    }

    const checkQuery = `
      SELECT mo_payment_screenshots, mo_paid_date
      FROM master_order
      WHERE mo_order_id = '${order_id}'`;

    Select(checkQuery, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        return res.json(JsonErrorResponse(err));
      }

      if (result.length === 0) {
        return res.json(JsonErrorResponse("Order not found."));
      }

      const order = result[0];

      if (order.mo_payment_screenshots || order.mo_paid_date) {
        return res.json(
          JsonWarningResponse("Payment has already been made for this order.")
        );
      }

      let data = [];
      let columns = [];
      let arguments = [];

      if (paid_date) {
        data.push(paid_date);
        columns.push("paid_date");
      }

      if (payment_screenshots) {
        data.push(payment_screenshots);
        columns.push("payment_screenshots");
      }

      if (order_id) {
        data.push(order_id);
        arguments.push("order_id");
      }

      let updateStatement = UpdateStatement(
        "master_order",
        "mo",
        columns,
        arguments
      );

      Update(updateStatement, data, (err, result) => {
        if (err) console.error("Error: ", err);
        res.json(JsonSuccess());
      });
    });
  } catch (error) {
    console.log(error);
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
