const { Joi } = require("express-validation");

const validationBuzzJoi = Joi.object({
  author: Joi.string().alphanum().min(3).max(15).required(),
  text: Joi.string().alphanum().min(3).max(200).required(),
  topic: Joi.string().default("general"),
  date: Joi.date().default(new Date()),
  likes: Joi.number().default(0),
  comments: Joi.array().items(Joi.string()).default([]),
});

module.exports = validationBuzzJoi;
