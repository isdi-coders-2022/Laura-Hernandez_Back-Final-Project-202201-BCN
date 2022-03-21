require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const auth = require("../../middlewares/auth");
const {
  incrementLikes,
  addComment,
} = require("../controllers/buzzControllers");
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
router.delete("/:id", auth, deleteBuzz);
router.patch("/:id/like", auth, incrementLikes);
router.put("/:id/comment", auth, addComment);
router.post("/new", auth, validate(validationBuzzJoi), addBuzz);

module.exports = router;
