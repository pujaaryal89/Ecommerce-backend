const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
    try {
        const { name, description } = req.body;
        const blog = await Blog.create({ name, description });
        return res.status(200).json({ status: "success", blog });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.listBlog = async (req, res) => {
    try {
        const blog = await Blog.find({});
        return res.status(200).json({ status: "success", blog });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.detailBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.body.id);
        return res.status(200).json({ status: "success", blog });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            { _id: req.body.id },
            req.body
        );
        return res.status(200).json({ status: "success", blog });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ _id: req.body.id });
        return res.status(200).json({ status: "success", blog });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};
