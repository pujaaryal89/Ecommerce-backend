const express = require("express");
const cartController = require("../controllers/cart");
const auth = require("../middleware/auth");

const router = express.Router();

// router.get("/list-cart", cartController.listCart);
router.post("/add-to-cart", cartController.addToCart);
router.delete("/cartProduct-delete", cartController.deleteCartProduct);
router.put("/update-to-cart", cartController.updateToCart);

module.exports = router;
