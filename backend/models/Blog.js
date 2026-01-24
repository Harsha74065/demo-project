const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: String,
    content: {
      type: String,
      required: true,
    },
    imageUrl: String,
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
