const mysql = require("mysql");
const { Encrypter, Decrypter } = require("./crytography");
const { Select, InsertTable } = require("./dbconnect");
require("dotenv").config();

let password = "";
Decrypter(process.env._PASSWORD_ADMIN, (err, encrypted) => {
  if (err) console.error("Error: ", err);
  // console.log(encrypted);
  password = encrypted;
});

Decrypter("1948f62b2d6f706c72be9dfc8437a874", (err, encrypted) => {
  if (err) console.error("Error: ", err);
  console.log(encrypted);
});

// Encrypter('101520122321', (err, encrypted) => {
//   if (err) console.error("Error: ", err);
//   console.log(encrypted);
// });

Encrypter("manasarias", (err, encrypted) => {
  if (err) console.error("Error: ", err);
  console.log(encrypted);
});

const connection = mysql.createConnection({
  host: process.env._HOST_ADMIN,
  user: process.env._USER_ADMIN,
  password: password,
  database: process.env._DATABASE_ADMIN,
  timezone: "PST",
});

exports.CheckConnection = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connection to MYSQL database: ", err);
      return;
    }
    console.log("MySQL database connection established successfully!");
  });
};


exports.mysqlQueryPromise = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};


exports.SelectPromise = (sql) => {
  return new Promise((resolve, reject) => {
    Select(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};


exports.InsertTablePromise = (sql, values) => {
  return new Promise((resolve, reject) => {
    InsertTable(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};


