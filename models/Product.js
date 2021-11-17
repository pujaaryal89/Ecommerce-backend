const mongoose = require("mongoose");
const User = require("./User");
const Category = require("./Category");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            index: true,
        },
        description: {
            type: String,
            index: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        productImage: { type: String, required: true },
        seller: {
            type: mongoose.Schema.ObjectId,
            ref: User,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: Category,
        },
    },
    { timestamps: true }
);

productSchema.index({
    name: "text",
    description: "text",
});

const Product = mongoose.model("product", productSchema);
Product.createIndexes();

module.exports = Product;
