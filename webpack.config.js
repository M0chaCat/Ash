// webpack.config.js
const path = require("path");

module.exports = {
  mode: "none", // prevents optimization (no minify, no tree-shake)
  entry: "./combined.js",
  output: {
    filename: "combined.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
