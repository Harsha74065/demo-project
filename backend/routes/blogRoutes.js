const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const upload = require("../middleware/upload");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

/* ============ PUBLIC ROUTES (No auth needed) ============ */

// Get all published blogs (for public users to read)
router.get("/public", blogController.getPublicBlogs);

// Get single published blog by ID (for public users to read)
router.get("/public/:id", blogController.getPublicBlogById);

/* ============ PROTECTED ROUTES (Auth required) ============ */

// Get blogs (user sees own, admin sees all)
router.get("/", authMiddleware, blogController.getBlogs);

// Get single blog by ID
router.get("/:id", authMiddleware, blogController.getBlogById);

// Create blog
router.post("/", authMiddleware, upload.single("image"), blogController.createBlog);

// Update blog
router.put("/:id", authMiddleware, upload.single("image"), blogController.updateBlog);

// Toggle publish/unpublish
router.put("/:id/publish", authMiddleware, blogController.togglePublish);

// Delete blog
router.delete("/:id", authMiddleware, blogController.deleteBlog);

/* ============ ADMIN ROUTES ============ */

// Get all blogs (admin only)
router.get("/admin/all", authMiddleware, adminMiddleware, blogController.getAllBlogsAdmin);

module.exports = router;
