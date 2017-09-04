/* eslint-disable no-console */

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./server/routes");

const app = express();
const apiRouter = express.Router();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", routes(apiRouter));

app.get("/", (req, res) => {
  res.send("Hello World");
});

mongoose.connect("mongodb://localhost:27017/journalApp", (err) => {
  if (err) {
    console.log("An error occured while connecting to the database:", err.message);
  } else {
    console.log("Database connection successful");
  }
});

app.listen(8080, (err) => {
  if (err) {
    console.log("An error occured while connecting:", err);
  }
  console.log("App listening 👂🏽 on port 8080");
});

module.exports = app;
