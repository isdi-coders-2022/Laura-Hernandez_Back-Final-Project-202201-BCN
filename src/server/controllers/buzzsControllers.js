require("dotenv").config();
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

module.exports = { getAllBuzzs, deleteBuzz };
