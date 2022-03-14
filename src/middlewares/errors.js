const debug = require("debug")("twitter:middlewares:errors");

const notFoundError = (req, res) => {
  res.status(404).json({ error: "Not found" });
};

// eslint-disable-next-line no-unused-vars
const generalError = (err, req, res, next) => {
  debug("Internal server error");
  res
    .status(err.code || 500)
    .json({ error: err.message || "General server error" });
};

const errorFunction = (errorBit, msg, data) => {
  if (errorBit) return { is_error: errorBit, message: msg };
  return { is_error: errorBit, message: msg, data };
};

module.exports = {
  notFoundError,
  generalError,
  errorFunction,
};
