require("dotenv").config();
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error(
      chalk.redBright("The password and/or username are not correct")
    );
    error.code = 401;
    return next(error);
  }
  const isRightPassword = await bcrypt.compare(password, user.password);
  if (!isRightPassword) {
    const errorWrongPwd = new Error(
      chalk.redBright("The password and/or username are not correct")
    );
    errorWrongPwd.code = 401;
    return next(errorWrongPwd);
  }
  const userData = {
    name: user.name,
    id: user.id,
  };
  const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token });
};

module.exports = { loginUser };
