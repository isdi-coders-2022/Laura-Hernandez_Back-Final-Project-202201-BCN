require("dotenv").config();
const express = require("express");
const {
  getAllBuzzs,
  deleteBuzz,
  addBuzz,
} = require("../controllers/buzzsControllers");

const router = express.Router();

router.get("/", getAllBuzzs);
router.delete("/:id", deleteBuzz);
router.post("/new", addBuzz);

module.exports = router;
