const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true,
  },
  tagDescription: {
    type: String,
  },
  course: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Category", TagsSchema);
