const express = require("express");
const blogController = require("../controllers/blog");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/list-blog", blogController.listBlog);
router.post("/create-blog", blogController.createBlog);
router.get("/detail-blog/:id", blogController.detailBlog);
router.put("/update-blog", blogController.updateBlog);
router.delete("/delete-blog/:id", blogController.deleteBlog);
router.get("/search-blog/", blogController.searchBlog);

module.exports = router;
