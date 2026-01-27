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
      published,
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
      published: published || false,
      userId: req.user?.id || null,
      authorName: req.user?.name || "Anonymous",
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   GET ALL BLOGS (CMS - User's own or Admin sees all)
======================= */
exports.getBlogs = async (req, res) => {
  try {
    let query = {};
    
    // If user is logged in and not admin, show only their blogs
    if (req.user && req.user.role !== "admin") {
      query.userId = req.user.id;
    }
    // Admin sees all blogs
    
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("GET BLOGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   GET PUBLIC BLOGS (Published only - for public users)
======================= */
exports.getPublicBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true, status: "approved" })
      .sort({ createdAt: -1 })
      .select("-userId"); // Don't expose userId to public
    res.status(200).json(blogs);
  } catch (error) {
    console.error("GET PUBLIC BLOGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
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
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("GET BLOG BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   GET PUBLIC BLOG BY ID (Published only)
======================= */
exports.getPublicBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id, published: true });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("GET PUBLIC BLOG BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
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
      published,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // Check ownership (unless admin)
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.user && req.user.role !== "admin" && blog.userId?.toString() !== req.user.id?.toString()) {
      return res.status(403).json({ message: "You can only edit your own blogs" });
    }

    const uploadedImageUrl = makeImageUrl(req);
    const updatedFields = {
      title,
      seoTitle,
      seoDescription,
      seoKeywords,
      content,
    };

    if (published !== undefined) {
      updatedFields.published = published;
    }

    if (uploadedImageUrl) {
      updatedFields.imageUrl = uploadedImageUrl;
    } else if (imageUrl) {
      updatedFields.imageUrl = imageUrl;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   PUBLISH / UNPUBLISH BLOG
======================= */
exports.togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check ownership (unless admin)
    if (req.user && req.user.role !== "admin" && blog.userId?.toString() !== req.user.id?.toString()) {
      return res.status(403).json({ message: "You can only publish your own blogs" });
    }

    blog.published = !blog.published;
    await blog.save();

    res.status(200).json({
      message: blog.published ? "Blog published" : "Blog unpublished",
      blog,
    });
  } catch (error) {
    console.error("TOGGLE PUBLISH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   DELETE BLOG
======================= */
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership (unless admin)
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.user && req.user.role !== "admin" && blog.userId?.toString() !== req.user.id?.toString()) {
      return res.status(403).json({ message: "You can only delete your own blogs" });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   GET ALL BLOGS (Admin only)
======================= */
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("GET ALL BLOGS ADMIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
