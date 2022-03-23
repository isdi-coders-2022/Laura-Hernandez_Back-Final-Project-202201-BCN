require("dotenv").config();
const debug = require("debug")("skybuzz:server:buzzsControllers");
const chalk = require("chalk");
const Buzz = require("../../db/models/Buzz");
const { notFoundError } = require("../../middlewares/errors");
const getAuthor = require("../../utils/getAuthor");

const getAllBuzzs = async (req, res) => {
  const buzzs = await Buzz.find({ isComment: false })
    .populate({ path: "author", select: "name username" })
    .populate({
      path: "comments",
      select: "author id topic likes date text",
      populate: { path: "author", select: "name username" },
    })
    .sort({ date: -1 });
  res.json({ buzzs });
};

const deleteBuzz = async (req, res, next) => {
  const { id } = req.params;
  try {
    const author = getAuthor(req.header("Authorization"));
    const buzz = await Buzz.findById(id).populate({
      path: "author",
      select: "name",
    });

    if (buzz && buzz.author.id === author) {
      await Buzz.findByIdAndRemove(id);
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
    const { text, topic, date, comments } = req.body;
    const author = getAuthor(req.header("Authorization"));
    const createdBuzz = await Buzz.create({
      text,
      author,
      topic,
      date,
      comments,
    });

    const responseBuzz = await Buzz.findById(createdBuzz.id).populate(
      "author",
      "name username"
    );

    res.status(201);
    res.json(responseBuzz);
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
      buzz.populate("author", "name username").populate({
        path: "comments",
        select: "author id topic likes date text",
        populate: { path: "author", select: "name username" },
      });
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
