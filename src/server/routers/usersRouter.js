require("dotenv").config();
const express = require("express");
const {
  loginUser,
  registerUser,
  getAllUsers,
} = require("../controllers/usersControllers");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/all", getAllUsers);

module.exports = router;
