const validationBuzzJoi = require("../server/controllers/buzzValidation/buzzValidator");
const { errorFunction } = require("./errors");

const buzzValidation = async (req, res, next) => {
  const buzzToCreate = req.body;
  const { error } = validationBuzzJoi.validate(buzzToCreate);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in Buzz Data : ${error.message}`)
    );
  }
  return next();
};

module.exports = buzzValidation;
