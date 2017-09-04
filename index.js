/* eslint-disable no-tabs */
/* eslint-disable no-console */

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(8080, (err) => {
	if (err) {
		console.log("An error occured while connecting:", err);
	}
	console.log("App listening 👂🏽 on port 8080");
});

module.exports = app;
