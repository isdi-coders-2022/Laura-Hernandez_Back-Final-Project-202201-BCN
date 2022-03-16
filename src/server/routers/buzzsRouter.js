require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const { incrementLikes } = require("../controllers/buzzControllers");
const {
  getAllBuzzs,
  deleteBuzz,
  addBuzz,
  detailBuzz,
} = require("../controllers/buzzsControllers");
const validationBuzzJoi = require("../controllers/buzzValidation/buzzValidator");

const router = express.Router();

router.get("/", getAllBuzzs);
router.get("/:id", detailBuzz);
router.delete("/:id", deleteBuzz);
router.patch("/:id/like", incrementLikes);
router.post("/new", validate(validationBuzzJoi), addBuzz);

module.exports = router;
