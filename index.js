/* eslint-disable no-console */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./server/routes");

const app = express();
const apiRouter = express.Router();

const env = process.env.NODE_ENV;
let port = 3000;
let db = "mongodb://localhost:27017/journalApp";

if (env === "test") {
  port = 5000;
  db = "mongodb://localhost:27017/journalApp-test";
}

mongoose.Promise = global.Promise;

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", routes(apiRouter));

app.get("/", (req, res) => {
  res.send("Hello World");
});

const mongoConnection = mongoose.connect(db, {
  useMongoClient: true,
});

mongoConnection.then(() => {
  console.log("Database connection successful");
}, (err) => {
  console.log("An error occured while connecting to the database:", err.message);
});

app.listen(port, (err) => {
  if (err) {
    console.log("An error occured while connecting:", err);
  }
  console.log(`App listening 👂🏽 on port ${port}`);
});

module.exports = app;
