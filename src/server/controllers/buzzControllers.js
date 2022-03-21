require("dotenv").config();
const debug = require("debug")("skybuzz:server:buzzControllers");
const chalk = require("chalk");
const Buzz = require("../../db/models/Buzz");
const getAuthor = require("../../utils/getAuthor");

const incrementLikes = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Buzz.updateOne({ _id: id }, { $inc: { likes: 1 } });
    if (result.modifiedCount === 1) {
      res.json(`Buzz liked correctly`);
      debug(chalk.greenBright(`Buzz liked correctly`));
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

const addComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const buzz = await Buzz.findById(id);
    debug(buzz);
    if (buzz) {
      const { text, topic } = req.body;
      const author = getAuthor(req.header("Authorization"));
      const createdComment = await Buzz.create({
        text,
        author,
        topic,
      });
      debug(createdComment);
      buzz.comments.push(createdComment.id);
      await buzz.save();
      res.json({ buzz });
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

module.exports = { incrementLikes, addComment };
