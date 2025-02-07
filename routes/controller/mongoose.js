const session = require("express-session");
const mongoose = require("mongoose");
const { CheckConnection } = require("../repository/lagonaDb");
const MongoDBSession = require("connect-mongodb-session")(session);
const dbconnect = require("../repository/dbconnect");

exports.SetMongo = (app) => {
  //mongodb
  mongoose.connect("mongodb://localhost:27017/LAGONA").then((res) => {
    console.log("MongoDB Connected!");
  });

  const store = new MongoDBSession({
    uri: "mongodb://localhost:27017/LAGONA",
    collection: "LAGONASessions",
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
