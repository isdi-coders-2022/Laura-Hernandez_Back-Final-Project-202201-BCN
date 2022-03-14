const { Joi } = require("express-validation");

const validationBuzzJoi = {
  body: Joi.object({
    author: Joi.string().min(3).max(15).required(),
    text: Joi.string().min(3).max(200).required(),
    topic: Joi.string().default("general"),
    date: Joi.date().default(new Date()),
    likes: Joi.number().default(0),
    comments: Joi.array().items(Joi.string()).default([]),
  }),
};

module.exports = validationBuzzJoi;
