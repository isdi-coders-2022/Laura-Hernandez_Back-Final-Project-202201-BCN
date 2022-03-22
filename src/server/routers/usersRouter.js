require("dotenv").config();
const express = require("express");
const auth = require("../../middlewares/auth");
const {
  loginUser,
  registerUser,
  getAllUsers,
} = require("../controllers/usersControllers");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/all", auth, getAllUsers);

module.exports = router;
