require("dotenv").config();

const Buzz = require("../../db/models/Buzz");

const incrementLike = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Buzz.updateOne({ _id: id }, { $inc: { likes: 1 } });
    if (result.modifiedCount === 1) {
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

module.exports = { incrementLike };
