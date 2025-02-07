const mysql = require("mysql");
const { Encrypter, Decrypter } = require("./crytography");
require("dotenv").config();

let password = "";
Decrypter(process.env._PASSWORD_ADMIN, (err, encrypted) => {
  if (err) console.error("Error: ", err);
  // console.log(encrypted);
  password = encrypted;
});

Decrypter("faa24d747e9fc5e9d98953d077be055e1e3d14ec438dacbd13254286791c1ae3", (err, encrypted) => {
  if (err) console.error("Error: ", err);
  console.log(encrypted);
});

// Encrypter('101520122321', (err, encrypted) => {
//   if (err) console.error("Error: ", err);
//   console.log(encrypted);
// });

Encrypter("dev2025zetaSoft", (err, encrypted) => {
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

