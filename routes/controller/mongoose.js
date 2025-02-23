const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();

const { CheckConnection } = require("../repository/lagonaDb");
const MongoDBSession = require("connect-mongodb-session")(session);
const dbconnect = require("../repository/dbconnect");
const MONGO_URI = process.env._MONGO_URI;
const SESSION_COLLECTION = process.env._SESSION_COLLECTION;

exports.SetMongo = (app) => {
  //mongodb
  mongoose.connect(MONGO_URI).then((res) => {
    console.log("MongoDB Connected!");
  });

  const store = new MongoDBSession({
    uri: MONGO_URI,
    collection: SESSION_COLLECTION,
  });

  //Session
  app.use(
    session({
      secret: "5L Secret Key",
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );

  //Check SQL Connection
  CheckConnection();
  dbconnect.CheckConnection();
};
