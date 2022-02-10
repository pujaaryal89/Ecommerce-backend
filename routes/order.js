const express = require("express");
const orderController = require("../controllers/order");

const router = express.Router();

router.post("/payment", orderController.payment);
router.post("/create-order", orderController.createOrder);

module.exports = router;
