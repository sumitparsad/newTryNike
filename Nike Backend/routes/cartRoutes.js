const express = require("express");
const router = express.Router();
const {
  getCartByUserId,
  addProductToCart,
} = require("../controllers/cartController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Route to get the cart for a specific user
router.get("/:userId", getCartByUserId);

// Add product to cart route
router.post("/add", isAuthenticated, addProductToCart);

module.exports = router;
