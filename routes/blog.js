const express = require("express");
const blogController = require("../controllers/blog");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/list-blog", blogController.listBlog);
router.post("/create-blog", auth, blogController.createBlog);
router.get("/detail-blog/:id", auth, blogController.deleteBlog);
router.put("/update-blog/:id", auth, blogController.updateBlog);
router.delete("/delete-blog/:id", auth, blogController.deleteBlog);

module.exports = router;
