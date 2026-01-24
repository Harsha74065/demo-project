const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const upload = require("../middleware/upload");

/* GET ALL BLOGS */
router.get("/", blogController.getBlogs);

/* GET SINGLE BLOG BY ID */
router.get("/:id", blogController.getBlogById);

/* CREATE BLOG (WITH IMAGE) */
router.post(
  "/",
  upload.single("image"), // 👈 IMPORTANT
  blogController.createBlog
);

/* UPDATE BLOG */
router.put(
  "/:id",
  upload.single("image"),
  blogController.updateBlog
);

/* DELETE BLOG */
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
