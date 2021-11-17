const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
    {
        slug: String,
        name: {
            type: String,
            index: true,
            unique: true,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            default: null,
        },
    },
    { timestamps: true }
);

categorySchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });

    next();
});

categorySchema.index({
    name: "text",
});

const Category = mongoose.model("category", categorySchema);
Category.createIndexes();

module.exports = Category;
