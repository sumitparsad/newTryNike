const Cart = require("../models/Cart");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

// Controller function to get a cart by user ID
exports.getCartByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the userId from request parameters

    // Fetch the cart for the specific user
    const cart = await Cart.findOne({ userId: userId })
      .populate("userId", "name email") // Populate user info (optional)
      .populate("products.productId", "name price image"); // Populate product info (optional)

    // If no cart is found for the user
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    // Return the cart for the user
    return res.status(200).json(cart);
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Add a product to a user's cart using userId from the token
exports.addProductToCart = async (req, res) => {
  try {
    // Extract the token from the cookie
    // const token = req.cookies.token;

    // if (!token) {
    //   return res.status(401).json({ message: "Authentication token missing." });
    // }

    // Verify the token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    // const userId = decoded.id; // Extract userId from token payload
    // Extract productId and quantity from the request body
    const { productId, quantity, userId } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required." });
    }
    console.log("in the cart");
    // Fetch the product to get its price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const productPrice = product.price;

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex >= 0) {
      // If the product exists, update the quantity and price
      cart.products[existingProductIndex].quantity += quantity;
      cart.products[existingProductIndex].price += productPrice * quantity;
    } else {
      // Add the product to the cart
      cart.products.push({
        productId,
        quantity,
        price: productPrice * quantity,
      });
    }

    // Update the total price of the cart
    cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price, 0);

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ message: "Product added to cart successfully.", cart });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    res.status(500).json({ message: "Failed to add product to cart.", error });
  }
};
