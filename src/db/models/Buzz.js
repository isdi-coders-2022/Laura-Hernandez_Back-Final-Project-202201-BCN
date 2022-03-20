const { model, Schema } = require("mongoose");

const BuzzSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    min: 5,
    max: 200,
  },
  topic: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Buzz",
    },
  ],
});

const Buzz = model("Buzz", BuzzSchema, "buzzs");

module.exports = Buzz;
