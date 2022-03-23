require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const headerAuth = req.header("Authorization");

  if (!headerAuth) {
    const error = new Error("Token is missing");
    error.code = 401;
    next(error);
  } else {
    const userToken = headerAuth.replace("Bearer ", "");
    try {
      jwt.verify(userToken, process.env.JWT_SECRET);
      next();
    } catch (error) {
      error.code = 401;
      next(error);
    }
  }
};

module.exports = auth;
