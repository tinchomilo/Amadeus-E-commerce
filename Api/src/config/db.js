require("dotenv").config();
const { DB_URI } = process.env;

const mongoose = require("mongoose");

let connectionDB = () => {
  mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("open", (_) => {
    console.log("Database connected");
  });
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
};

module.exports = connectionDB;
