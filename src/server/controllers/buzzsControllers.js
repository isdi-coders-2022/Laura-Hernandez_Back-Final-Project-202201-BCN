require("dotenv").config();
const chalk = require("chalk");

const getAllBuzzs = async (req, res) => {
  const buzzs = await Buzz.find();
  res.json({ buzzs });
};

module.exports = { getAllBuzzs };
