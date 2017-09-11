const path = require("path");

module.exports = {
  entry: "./client/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "index_bundle.js",
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.jsx$/, loader: "babel-loader", exclude: /node_modules/ },
    ],
  },
};
