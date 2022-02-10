const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        paymentMethod: {
            type: String,
            enum: ["card", "cashOnDelivery"],
            required: true,
        },
        userInfo: {
            name: String,
        },
        products: [
            {
                seller: {
                    name: String,
                    _id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
                },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "product",
                },
                productName: String,
                productQuantity: Number,
                subTotal: Number,
            },
        ],
        total: Number,
    },
    { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
