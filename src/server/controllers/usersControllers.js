require("dotenv").config();
const bcrypt = require("bcrypt");
const debug = require("debug")("skybuzz:usersControllers");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");
const encrypt = require("../../utils/encrypt");

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

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;
  const user = await User.findOne({ username });
  if (!username || !password || user) {
    const errorWPW = new Error(
      chalk.redBright(
        `Something went wrong or username ${username} already exists`
      )
    );
    errorWPW.code = 400;
    return next(errorWPW);
  }
  try {
    const encryptedPasword = await encrypt(password);
    const createdUser = await User.create({
      name,
      username,
      password: encryptedPasword,
    });
    debug(chalk.greenBright(`User ${username} was registered correctly`));
    return res.status(201).json(createdUser);
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

module.exports = { loginUser, registerUser, getAllUsers };
