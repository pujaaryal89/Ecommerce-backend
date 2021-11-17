const { json } = require("express");
const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");
const e = require("express");

exports.createCategory = async (req, res) => {
    try {
        let category;
        if (req.body && req.body.parent_id && req.body.name) {
            const parent = await Category.findOne({ _id: req.body.parent_id });

            if (!parent) {
                return res.status(401).json({ status: "Parent not found" });
            }
            if (parent) {
                category = await Category.create({
                    name: req.body.name,
                    parent: parent._id,
                });
            }
        }
        if (req.body && req.body.name && !req.body.parent_id) {
            category = await Category.create({
                name: req.body.name,
            });
        }

        return res.status(200).json({ status: "success", category });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};
const categoryFunction = (allCat, parent) => {
    let category = [];

    const parentCategories = allCat.filter((e) => {
        if (e.parent?.toString() == parent) {
            return e;
        }
    });
    parentCategories.forEach((e) => {
        const subCat = categoryFunction(allCat, e._id.toString());
        e["subCat"] = subCat;
        category.push(e);
    });

    return category;
};

exports.listCategory = async (req, res) => {
    try {
        const allCat = await Category.find({}).lean();

        if (allCat.length) {
            const categories = categoryFunction(allCat, null);
            return res.status(200).json({
                status: "success",
                categories,
                // allCat,
                length: categories.length,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "error", err });
    }
};

exports.detailCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        return res.status(200).json({ status: "success", category });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        );
        return res.status(200).json({ status: "success", category });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ _id: req.body.id });
        return res.status(200).json({ status: "success", category });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.searchCategory = async (req, res) => {
    try {
        const category = await Category.find(
            { $text: { $search: req.query.keyword, $caseSensitive: false } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });
        return res.status(200).json({ status: "success", category });
    } catch (err) {
        console.log(err);

        return res.status(500).json({ status: "error", err });
    }
};

exports.createProduct = async (req, res, next) => {
    console.log(req.file);
    try {
        const { name, description, price, seller, category } = req.body;
        console.log({ description });

        const isSeller = await User.findById({ _id: seller });
        const isCategoryPresent = await Category.findById({
            _id: category,
        });
        if (isSeller.role === "seller") {
            if (isCategoryPresent) {
                const product = await Product.create({
                    name,
                    description,
                    price,
                    productImage: req.file.path,
                    seller: isSeller._id,
                    category: isCategoryPresent._id,
                });
                return res.status(200).json({ status: "success", product });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "error", err });
    }
};

exports.listProduct = async (req, res) => {
    try {
        let query = {};
        if (req.query && req.query.id) {
            query = {
                ...query,
                seller: req.query.id,
            };
        }

        if (req.query && req.query.category) {
            query = {
                ...query,
                category: req.query.category,
            };
        }
        const product = await Product.find(query).populate("category");
        return res
            .status(200)
            .json({ status: "success", product, length: product.length });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.detailProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            "category"
        );
        if (!product) {
            return res
                .status(404)
                .json({ status: "error", err: "product not found" });
        }
        return res.status(200).json({ status: "success", product });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let body = { ...req.body };
        if (req.file) {
            body = {
                ...body,
                productImage: req.file.path,
            };
        }
        const product = await Product.findOneAndUpdate(
            { _id: req.body.id },
            body
        );

        return res.status(200).json({ status: "success", product });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id });
        return res.status(200).json({ status: "success", product });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};

exports.searchProduct = async (req, res) => {
    try {
        const product = await Product.find(
            { $text: { $search: req.query.keyword, $caseSensitive: false } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });
        return res.status(200).json({ status: "success", product });
    } catch (err) {
        console.log(err);

        return res.status(500).json({ status: "error", err });
    }
};

exports.listOfProductsPerCategory = async (req, res) => {
    try {
        const product = Category.aggregate([
            {
                $lookup: {
                    from: Product,
                    let: { category_id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$category", "$$category_id"],
                                },
                            },
                        },
                        { $project: { category: 0 } },
                    ],
                    as: "products",
                },
            },
        ]);
        console.log({ product });
        return res.status(200).json({ status: "sucess", product });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "error", err });
    }
};
