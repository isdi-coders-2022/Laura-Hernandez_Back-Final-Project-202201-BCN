const Joi = require("joi");

const schemaBuzzJoi = Joi.object({
  author: Joi.string().alphanum().min(3).max(15).required(),
  text: Joi.string().alphanum().min(3).max(200).required(),
  topic: Joi.string(),
  date: Joi.date(),
  likes: Joi.number(),
  comments: Joi.array().items(Joi.string()),
});

export default schemaBuzzJoi;
