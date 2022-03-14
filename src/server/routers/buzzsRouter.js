require("dotenv").config();
const express = require("express");
const buzzValidation = require("../../middlewares/buzzValidation");
const {
  getAllBuzzs,
  deleteBuzz,
  addBuzz,
} = require("../controllers/buzzsControllers");

const router = express.Router();

router.get("/", getAllBuzzs);
router.delete("/:id", deleteBuzz);
router.post("/new", buzzValidation, addBuzz);

module.exports = router;
