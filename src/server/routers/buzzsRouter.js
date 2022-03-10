require("dotenv").config();
const express = require("express");
const { getAllBuzzs, deleteBuzz } = require("../controllers/buzzsControllers");

const router = express.Router();

router.get("/", getAllBuzzs);
router.delete("/:id", deleteBuzz);

module.exports = router;
