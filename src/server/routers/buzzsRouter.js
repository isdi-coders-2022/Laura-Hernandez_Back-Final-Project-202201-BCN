require("dotenv").config();
const express = require("express");
const { getAllBuzzs } = require("../controllers/buzzsControllers");

const router = express.Router();

router.get("/", getAllBuzzs);

module.exports = router;
