require("dotenv").config();
const debug = require("debug")("skybuzz:server:buzzControllers");
const chalk = require("chalk");
const Buzz = require("../../db/models/Buzz");

const getAllBuzzs = async (req, res) => {
  const buzzs = await Buzz.find();
  res.json({ buzzs });
};

const deleteBuzz = async (req, res, next) => {
  const { id } = req.params;
  try {
    const buzz = await Buzz.findByIdAndRemove(id);
    if (buzz) {
      res.json({});
    } else {
      const error = new Error("Buzz not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const addBuzz = async (req, res, next) => {
  const { text, author, topic, date, comments } = req.body;
  try {
    await Buzz.create({
      text,
      author,
      topic,
      date,
      comments,
    });
    debug(chalk.greenBright(`Buzz published correctly`));
    return res.status(201).json({
      text,
      author,
      topic,
      date,
      comments,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAllBuzzs, deleteBuzz, addBuzz };
