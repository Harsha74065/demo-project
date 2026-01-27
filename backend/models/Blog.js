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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorName: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // for now, auto-approve
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
