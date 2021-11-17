const mongoose = require("mongoose");

const cartShema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        items: [
            {
                seller: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
                item: [{
                    quantity: { type: Number, required: true },
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "product",
                    },
                }],
            },
        ],
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartShema);
module.exports = Cart;
