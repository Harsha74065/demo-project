const Blog = require("../models/Blog");

const makeImageUrl = (req) => {
  if (req.file) {
    return `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  return undefined;
};

/* =======================
   CREATE BLOG
======================= */
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      seoTitle,
      seoDescription,
      seoKeywords,
      content,
      imageUrl,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const uploadedImageUrl = makeImageUrl(req);

    const newBlog = new Blog({
      title,
      seoTitle,
      seoDescription,
      seoKeywords,
      content,
      imageUrl: uploadedImageUrl || imageUrl,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully ✅",
      blog: newBlog,
    });
  } catch (error) {
    console.error("❌ CREATE BLOG ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* =======================
   GET ALL BLOGS
======================= */
exports.getBlogs = async (req, res) => {
  console.log("📋 GET /api/blogs HIT");

  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("❌ GET BLOGS ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* =======================
   GET SINGLE BLOG BY ID
======================= */
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("❌ GET BLOG BY ID ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* =======================
   UPDATE BLOG
======================= */
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      seoTitle,
      seoDescription,
      seoKeywords,
      content,
      imageUrl,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const uploadedImageUrl = makeImageUrl(req);
    const updatedFields = {
      title,
      seoTitle,
      seoDescription,
      seoKeywords,
      content,
    };

    if (uploadedImageUrl) {
      updatedFields.imageUrl = uploadedImageUrl;
    } else if (imageUrl) {
      updatedFields.imageUrl = imageUrl;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedFields, {
      new: true, // Return updated document
    });

    if (!updatedBlog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog updated successfully ✅",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("❌ UPDATE BLOG ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* =======================
   DELETE BLOG
======================= */
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog deleted successfully ✅",
    });
  } catch (error) {
    console.error("❌ DELETE BLOG ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};