require("dotenv").config();
const debug = require("debug")("skybuzz:server:buzzControllers");
const chalk = require("chalk");
const Buzz = require("../../db/models/Buzz");

const incrementLikes = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Buzz.updateOne({ _id: id }, { $inc: { likes: 1 } });
    if (result.modifiedCount === 1) {
      res.json({});
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

module.exports = { incrementLikes };
