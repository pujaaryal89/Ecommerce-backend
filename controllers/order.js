const stripe = require("stripe")(process.env.STRIPE_KEY);
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
    try {
        const { cart_id, payment_method } = req.body;

        if (req.body && cart_id && payment_method) {
            const cart = await Cart.findById(cart_id);

            if (!cart) {
                return res.status(401).json({ message: "Cart Not Found" });
            }
            let order = {};
            const newCartObj = [];
            let total = 0;

            const product = await Product.find({});
            const seller = await User.find({});

            cart.items.forEach((item) => {
                const sellerObject = seller.find(
                    (e) => e._id.toString() == item.seller.toString()
                );
                if (sellerObject) {
                    item.item.forEach((i) => {
                        const productObject = product.find(
                            (e) => e._id.toString() == i.productId.toString()
                        );
                        console.log({ productObject });
                        if (productObject) {
                            newCartObj.push({
                                seller: {
                                    name: sellerObject.username,
                                    _id: sellerObject._id,
                                },
                                productId: productObject._id,
                                productName: productObject.name,
                                productQuantity: i.quantity,
                                subTotal: i.quantity * productObject.price,
                            });
                        }
                    });
                }
            });

            newCartObj.forEach((item) => {
                total = total + item.subTotal;
            });
            const user = await User.findById(cart.user);
            if (user) {
                order = await Order.create({
                    paymentMethod: payment_method,
                    userInfo: {
                        name: user.username,
                    },
                    products: newCartObj,
                    total,
                });

                await Cart.deleteOne({ _id: cart._id });
            }
            return res.status(200).json({
                message: "Order created successfully",
                order,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.orderConfirm = async (req, res) => {
    try {
        const { order_id, token, order_confirm } = req.body;
        if (order_confirm == true) {
            const order = await Order.findOne({ _id: order_id });
            if (!order) {
                return res.status(401).json({ message: "Order not found" });
            }

            const idempotencykey = uuid();
            return stripe.customers
                .create({
                    email: token.email,
                    source: token.id,
                })
                .then((customer) => {
                    stripe.charges
                        .create(
                            {
                                amount: order.total * 100,
                                currency: "uid",
                                customer: customer.id,
                                receipt_email: token.email,
                                description: `Order Id:${order._id}`,
                                shipping: {
                                    name: token.card.name,
                                    address: {
                                        country: token.card.country,
                                    },
                                },
                            },
                            { idempotencykey }
                        )
                        .then((result) => res.status(200).json(result))
                        .catch((err) => res.status(200).json(err));
                });
        } else {
            return res
                .status(500)
                .json({ message: "sorry your order is not submitted" });
        }
    } catch (err) {
        return res.status(200).json({ message: "err", err });
    }
};

exports.payment = async (req, res) => {
    try {
        const { product, token } = req.body;

        // *so that same user isnot charged twice
        const idempotencykey = uuid();
        return stripe.customers
            .create({
                email: token.email,
                source: token.id,
            })
            .then((customer) => {
                stripe.charges
                    .create(
                        {
                            amount: product.amount * 100,
                            currency: "uid",
                            customer: customer.id,
                            receipt_email: token.email,
                            description: `Product Id:${product.id},Product Name:${product.name}`,
                            shipping: {
                                name: token.card.name,
                                address: {
                                    country: token.card.country,
                                },
                            },
                        },
                        { idempotencykey }
                    )
                    .then((result) => res.status(200).json(result))
                    .catch((err) => res.status(200).json(err));
            });

        // return res.status(200).json({ status: "success" });
    } catch (err) {
        return res.status(500).json({ status: "error", err });
    }
};
