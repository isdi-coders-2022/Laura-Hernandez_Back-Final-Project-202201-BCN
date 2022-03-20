require("dotenv").config();
const debug = require("debug")("skybuzz:server:buzzsControllers");
const chalk = require("chalk");
const Buzz = require("../../db/models/Buzz");
const { notFoundError } = require("../../middlewares/errors");

const getAllBuzzs = async (req, res) => {
  const buzzs = await Buzz.find().populate("comments", "id").sort({ date: -1 });
  res.json({ buzzs });
};

const deleteBuzz = async (req, res, next) => {
  const { id } = req.params;
  try {
    const buzz = await Buzz.findByIdAndRemove(id);
    if (buzz) {
      res.json({});
      debug(chalk.greenBright(`Buzz deleted correctly`));
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
  try {
    const { text, author, topic, date, comments } = req.body;
    const createdBuzz = await Buzz.create({
      text,
      author,
      topic,
      date,
      comments,
    });
    res.status(201);
    res.json(createdBuzz);
    debug(chalk.greenBright(`Buzz published correctly`));
  } catch (error) {
    next(error);
  }
};

const detailBuzz = async (req, res, next) => {
  const { id } = req.params;
  try {
    const buzz = await Buzz.findById(id);
    if (buzz) {
      debug(chalk.greenBright("Buzz details ok"));
      res.json({ buzz });
    } else {
      debug(chalk.red("Buzz not found"));
      next(notFoundError);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBuzzs, deleteBuzz, addBuzz, detailBuzz };
