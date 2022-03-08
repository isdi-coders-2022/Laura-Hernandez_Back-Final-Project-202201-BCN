require("dotenv").config();
const Buzz = require("../../db/models/Buzz");

const getAllBuzzs = async (req, res) => {
  const buzzs = await Buzz.find();
  res.json({ buzzs });
};

module.exports = { getAllBuzzs };
