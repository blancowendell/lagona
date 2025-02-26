const mysql = require("./repository/lagonaDb");
//const moment = require('moment');
var express = require("express");
const { MerchantValidator } = require("./controller/middleware");
const verifyJWT = require("../middleware/authenticator");
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
  MerchantValidator(req, res, "MerchantOrdersLayout");
});

module.exports = router;

router.get("/getPendingOrders", (req, res) => {
  try {
    let merchant_id = req.session.merchant_id;
    let sql = `
    SELECT *,
    CONCAT(mc_first_name,' ',mc_last_name) as mo_fullname
    FROM master_order
    INNER JOIN master_customer ON master_order.mo_customer_id = mc_customer_id
    WHERE mo_merchant_id = '${merchant_id}'
    AND mo_order_status IN ('Pending','To Be Paid')`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      if (result != 0) {
        let data = DataModeling(result, "mo_");
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

router.post("/viewOrderDetails", (req, res) => {
  try {
    let order_id = req.body.order_id;
    let sql = `SELECT 
        od.od_details_id,
        mo.mo_order_code as od_order_code,
        od.od_order_category,
        od.od_product_id,
        od.od_quantity,
        od.od_status,
        DATE_FORMAT(od.od_create_date, '%d-%m-%Y %H:%i:%s') AS od_create_date,
        COALESCE(mi.mi_item_name, mc.mc_combo_name, ms.ms_solo_name, me.me_extra_name) AS od_product_name,
        COALESCE(mi.mi_item_image, mc.mc_meal_image, ms.ms_meal_image, me.me_extra_image) AS od_product_image,
        COALESCE(mi.mi_item_price, mc.mc_price, ms.ms_price, me.me_extra_price) AS od_product_price
    FROM order_details od
    INNER JOIN master_order mo ON od.od_order_id = mo.mo_order_id
    LEFT JOIN menu_item mi ON od.od_order_category = 'Item' AND od.od_product_id = mi.mi_item_id
    LEFT JOIN menu_combo mc ON od.od_order_category = 'Combo' AND od.od_product_id = mc.mc_combo_id
    LEFT JOIN menu_solo ms ON od.od_order_category = 'Solo' AND od.od_product_id = ms.ms_solo_id
    LEFT JOIN menu_extras me ON od.od_order_category = 'Extras' AND od.od_product_id = me.me_extra_id
    WHERE od_order_id = '${order_id}'`;
    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }
      console.log(result);
      if (result != 0) {
        let data = DataModeling(result, "od_");
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

router.post("/viewRiderStatus", (req, res) => {  
  try {
    const orderId = req.body.order_id;

    if (!orderId) {
      return res.status(400).json(JsonErrorResponse("Order ID is required"));
    }

    const customerQuery = `
      SELECT ca.ca_latitude, ca.ca_longitude, mo.mo_merchant_id
      FROM master_order mo
      INNER JOIN customer_address ca ON mo.mo_address_id = ca.ca_address_id
      WHERE mo.mo_order_id = '${orderId}'
    `;
    

    Select(customerQuery, (err, customerResult) => {
      if (err) {
        console.error(err);
        return res.json(JsonErrorResponse(err));
      }

      if (customerResult.length === 0) {
        return res.status(404).json(JsonErrorResponse("Customer address not found"));
      }

      const {
        ca_latitude: customerLatitude,
        ca_longitude: customerLongitude,
        mo_merchant_id: merchantId,
      } = customerResult[0];

      const merchantQuery = `
        SELECT mm_latitude, mm_longitude, mm_prio_rider
        FROM master_merchant
        WHERE mm_merchant_id = '${merchantId}'
      `;

      Select(merchantQuery, (err, merchantResult) => {
        if (err) {
          console.error(err);
          return res.json(JsonErrorResponse(err));
        }

        if (merchantResult.length === 0) {
          return res.status(404).json(JsonErrorResponse("Merchant not found"));
        }

        const {
          mm_latitude: merchantLatitude,
          mm_longitude: merchantLongitude,
          mm_prio_rider: prioRiderId,
        } = merchantResult[0];

        const riderQuery = `
          SELECT
            mr_rider_id,
            CONCAT(mr_first_name, ' ', mr_last_name) AS mr_fullname,
            mr_rider_selfie,
            mr_rider_code,
            mr_latitude,
            mr_longitude
          FROM master_rider
          WHERE mr_rider_status = 'Available'
            AND mr_rider_id = '${prioRiderId}'
        `;

        Select(riderQuery, (err, riderResult) => {
          if (err) {
            console.error(err);
            return res.json(JsonErrorResponse(err));
          }

          if (riderResult.length === 0) {
            const fallbackRiderQuery = `
              SELECT
                mr_rider_id,
                CONCAT(mr_first_name, ' ', mr_last_name) AS mr_fullname,
                mr_rider_selfie,
                mr_rider_code,
                mr_latitude,
                mr_longitude
              FROM master_rider
              WHERE mr_rider_status = 'Available'
              LIMIT 1
            `;
            Select(fallbackRiderQuery, (err, fallbackRiderResult) => {
              if (err) {
                console.error(err);
                return res.json(JsonErrorResponse(err));
              }

              if (fallbackRiderResult.length === 0) {
                return res.status(404).json(JsonErrorResponse("No available riders found"));
              }

              processRiderData(fallbackRiderResult[0]);
            });
          } else {
            processRiderData(riderResult[0]);
          }
        });

        function processRiderData(riderData) {
          const {
            mr_latitude: riderLatitude,
            mr_longitude: riderLongitude,
            mr_rider_id: riderId,
            mr_fullname: riderFullname,
            mr_rider_selfie: riderSelfie,
            mr_rider_code: riderCode,
          } = riderData;

          const distance = calculateHaversineDistance(
            parseFloat(merchantLatitude),
            parseFloat(merchantLongitude),
            parseFloat(customerLatitude),
            parseFloat(customerLongitude)
          );

          const deliveryFee = calculateDeliveryFee(distance);

          const responseData = {
            rider_id: riderId,
            fullname: riderFullname,
            image: riderSelfie,
            rider_code: riderCode,
            distance: distance.toFixed(2),
            delivery_fee: deliveryFee.toFixed(2), 
          };

          res.json(JsonDataResponse(responseData));
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(JsonErrorResponse("Internal server error"));
  }
});

router.post("/assignRider", (req, res) => {
  try {
    const { order_id, rider_id, delivery_fee, distance } = req.body;

    if (!order_id || !rider_id || !delivery_fee || !distance) {
      return res.status(400).json(JsonErrorResponse("All fields are required"));
    }

    const sanitizedDeliveryFee = parseFloat(
      delivery_fee.replace(/[^\d.-]/g, "")
    );

    if (isNaN(sanitizedDeliveryFee)) {
      return res.status(400).json(JsonErrorResponse("Invalid delivery fee"));
    }

    let order_take = GetCurrentDatetime();
    let status = "Pending";

    let sql = InsertStatement("order_riders_table", "ort", [
      "order_id",
      "rider_id",
      "status",
      "take_order_time",
      "distance",
      "del_fee",
    ]);

    let data = [[order_id, rider_id, status, order_take, distance, sanitizedDeliveryFee]];

    let checkStatement = SelectStatement(
      "select * from order_riders_table where ort_order_id=? and ort_rider_id=?",
      [order_id, rider_id]
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

router.post("/viewOderReadyToPay", (req, res) => {
  try {
    let order_id = req.body.order_id;
    let sql = `SELECT 
    mr_rider_code,
    mr_rider_selfie,
    concat(mr_first_name,' ',mr_last_name) as mr_fullname
    FROM order_riders_table
    INNER JOIN master_rider ON order_riders_table.ort_rider_id = mr_rider_id
    WHERE ort_order_id = '${order_id}'
    AND ort_status = 'Rider Accepted'`;

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
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.put("/sendPaidNotif", (req, res) => {
    try {
      const {
        order_id,
      } = req.body;
      let status = 'To Be Paid'
  
      let data = [];
      let columns = [];
      let arguments = []
  
      if (status) {
        data.push(status);
        columns.push("order_status");
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

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function calculateDeliveryFee(distance) {
  const baseFee = 65.0; 
  const additionalFeePerKm = 10.0; 
  if (distance <= 1) {
    return baseFee;
  } else {
    return baseFee + Math.ceil(distance - 1) * additionalFeePerKm;
  }
}

//#endregion
