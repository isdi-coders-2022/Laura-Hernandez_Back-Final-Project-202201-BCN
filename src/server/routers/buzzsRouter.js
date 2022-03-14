require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const {
  getAllBuzzs,
  deleteBuzz,
  addBuzz,
} = require("../controllers/buzzsControllers");
const validationBuzzJoi = require("../controllers/buzzValidation/buzzValidator");

const router = express.Router();

router.get("/", getAllBuzzs);
router.delete("/:id", deleteBuzz);
router.post("/new", validate(validationBuzzJoi), addBuzz);

module.exports = router;
