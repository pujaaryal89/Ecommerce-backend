const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            index: true,
        },
        description: {
            type: String,
            index: true,
        },
    },
    { timestamps: true }
);

blogSchema.index({
    name: "text",
    description: "text",
});

const Blog = mongoose.model("blog", blogSchema);
Blog.createIndexes();

module.exports = Blog;
