/* eslint-disable no-console */

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./server/routes");

const app = express();
const apiRouter = express.Router();

const env = process.env.NODE_ENV;
let port = 8080;
if (env === "test") {
  port = 5000;
}


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

app.listen(port, (err) => {
  if (err) {
    console.log("An error occured while connecting:", err);
  }
  console.log(`App listening 👂🏽 on port ${port}`);
});

module.exports = app;
