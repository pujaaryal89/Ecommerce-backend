const { json } = require("express");
const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;
        const product_detail = await Product.findById({ _id: product_id });
        if (!product_detail) {
            return res.status(404).json({ message: "Not found" });
        }

        const isProductInCart = await Cart.findOne({
            user: user_id,
        });
        if (isProductInCart) {
            // isProductInCart = isProductInCart.toObject(); //conversion herne
            let updatedItems = isProductInCart.items.map((element) => {
                const elementSellerId = element.seller.toString();
                const productSellerId = product_detail.seller.toString();
                if (elementSellerId == productSellerId) {
                    const isSameInCart = element.item.some(
                        (e) =>
                            e.productId.toString() ==
                            product_detail._id.toString()
                    );
                    if (!isSameInCart) {
                        element.item.push({
                            quantity,
                            productId: product_detail._id,
                        });
                    }
                    return element;
                } else {
                    return {
                        seller: product_detail.seller,
                        item: [
                            {
                                quantity,
                                productId: product_detail._id,
                            },
                        ],
                    };
                }
            });

            isProductInCart.items = updatedItems;
            await isProductInCart.save();

            return res
                .status(200)
                .json({ status: "successful", isProductInCart });
        } else {
            const cart = await Cart.create({
                user: user_id,
                items: [
                    {
                        seller: product_detail.seller,
                        item: [
                            {
                                quantity: quantity,
                                productId: product_id,
                            },
                        ],
                    },
                ],
            });

            return res.status(200).json({ status: "successful", cart });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "error", err });
    }
};

exports.updateToCart = async (req, res) => {
    try {
        const { product_id, user_id, quantity } = req.body;
        const userCart = await Cart.findOne({ user: user_id });
        if (!userCart) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userCart) {
            const productToUpdate = userCart.items.map((element) => {
                const cartItems = element.item.map((e) => {
                    if (e.productId.toString() == product_id.toString()) {
                        e.quantity = quantity;
                    }
                    return e;
                });
                element.item = cartItems;
                return element;
            });
            userCart.items = productToUpdate;

            await userCart.save();
            return res.status(200).json({ message: "updated", userCart });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "error", err });
    }
};

exports.deleteCartProduct = async (req, res) => {
    try {
        if (req.query && req.query.product_id && req.query.user_id) {
            console.log("hello");
            const { product_id, user_id } = req.query;

            const userCart = await Cart.findOne({ user: user_id });

            if (!userCart) {
                return res.status(404).json({ message: "User not found" });
            }
            if (userCart) {
                const item = userCart.items.map((element) => {
                    const itemToDelete = element.item.filter(
                        (e) => e.productId.toString() !== product_id.toString()
                    );
                    element.item = itemToDelete;
                    return element;
                });
                userCart.items = item;

                await userCart.save();
                return res
                    .status(200)
                    .json({ message: "successfully deleted", userCart });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "error", err });
    }
};
