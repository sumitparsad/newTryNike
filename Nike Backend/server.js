const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cors = require("cors");
const userRoutes = require("./routes/user"); // Adjust the path if necessary
const categoryRoutes = require("./routes/categoryRoutes"); // Adjust the path if necessary
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cookieParser = require("cookie-parser");
const authr = require("./routes/authRoutes");
const Category = require("./models/Category"); // Import the Category model
const Product = require("./models/Product"); // Import the Product model
const multer = require("multer"); // Import multer for handling file uploads
const fs = require("fs"); // Import fs for file system operations
const Cart = require("./models/Cart"); // Import the Cart model
const jwt = require("jsonwebtoken"); // Import jwt
const Like = require("./models/Like"); // Ensure the Like model is correctly imported
const Transaction = require("./models/Transaction"); // Import the Transaction model correctly
const bcrypt = require("bcrypt"); // Import bcrypt for hashing

// Load environment variables
dotenv.config();

// Initialize app and database
const app = express();
connectDatabase();
// Enable CORS for all origins and methods
const corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  credentials: true, // Allow credentials (cookies, authorization headers)
};

// Apply CORS middleware globally
app.use(cors(corsOptions));
// Middleware
app.use(express.json());
// Use the product routes

app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
// Routes
app.use("/api/auth", authr); // Use auth routes

app.use(cookieParser());
// Use the category routes
app.use("/admin", categoryRoutes); // Use the category routes under /admin

// Ensure the uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },
});
const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Route to get all categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get products with categories that have men set to true
app.get("/products/men", async (req, res) => {
  try {
    const categories = await Category.find({ men: true });
    const categoryNames = categories.map((category) => category.name);
    const products = await Product.find({
      category: { $in: categoryNames },
    });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching men's products:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get products with categories that have women set to true
app.get("/products/women", async (req, res) => {
  try {
    const categories = await Category.find({ women: true });
    const categoryNames = categories.map((category) => category.name);
    const products = await Product.find({
      category: { $in: categoryNames },
    });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching women's products:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get products with categories that have kid set to true
app.get("/products/kids", async (req, res) => {
  try {
    const categories = await Category.find({ kid: true });
    const categoryNames = categories.map((category) => category.name);
    const products = await Product.find({
      category: { $in: categoryNames },
    });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching kids' products:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get the first 5 products
app.get("/products/new-arrivals", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get a single product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get a single product by ID
app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to add a new product
app.post("/admin/create/product", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    console.log("File:", req.file); // Log the uploaded file
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.file.path.replace(/\\/g, "/"), // Save the file path in the database
      category: req.body.category, // Ensure category is set correctly
      subcategory: req.body.subcategory,
      stock: req.body.stock,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({ product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error); // Log the error
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// DELETE route to remove a product by ID
app.delete("/admin/delete/product/:productID", async (req, res) => {
  const { productID } = req.params; // Extract productID from the request parameters

  try {
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productID);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product removed successfully",
        product: deletedProduct,
      });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ message: "Server error while removing product" });
  }
});

// Route to update a product
app.put(
  "/admin/update/product/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const productId = req.params.id;
      console.log("Product ID:", productId); // Log the product ID
      console.log("Request body:", req.body); // Log the request body
      console.log("File:", req.file); // Log the uploaded file

      const updatedData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.file ? req.file.path.replace(/\\/g, "/") : req.body.image, // Update the image if a new file is uploaded
        category: req.body.category,
        subcategory: req.body.subcategory,
        stock: req.body.stock,
      };

      console.log("Updated data:", updatedData); // Log the updated data

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error); // Log the error
      res.status(500).json({
        message: "Server Error",
        error: error.message,
      });
    }
  }
);

// Route to add a product to the cart
app.post("/cart/add/:productId", async (req, res) => {
  const { productId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    // Store in local storage if user is not authenticated
    const localCart = JSON.parse(req.body.localCart || "{}");
    localCart.products = localCart.products || [];
    const existingProduct = localCart.products.find((item) => item.productId === productId);

    if (existingProduct) {
      res.status(200).json({ message: "Product already in cart!" });
    } else {
      localCart.products.push({
        productId,
        price: req.body.price,
        quantity: req.body.quantity || 1,
      });
      localCart.totalPrice = localCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
      res.status(200).json({ message: "Product added to cart successfully!", cart: localCart });
    }
    return;
  }

  // If user is authenticated, store in database
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }

    const userId = user.id;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const cartItem = new Cart({
        userId,
        productId,
        price: req.body.price,
        quantity: req.body.quantity || 1,
      });

      await cartItem.save();
      res.status(201).json({ message: "Product added to cart successfully!", cartItem });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({
        message: "Failed to add product to cart.",
        error: error.message,
      });
    }
  });
});

app.post("/cart/remove", verifyToken, async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "Product ID and user ID are required." });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    return res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

app.get("/cart", verifyToken, async (req, res) => {
  const userId = req.user.id; // Ensure the user ID is correctly extracted from the token

  try {
    const cartItems = await Cart.find({ userId: new RegExp(`^${userId}-\\d{5}$`) }).populate("productId");
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    res.status(200).json({ products: cartItems, totalPrice });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      message: "Failed to fetch cart items.",
      error: error.message,
    });
  }
});

app.post("/cart/clear", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Failed to clear cart.",
      error: error.message,
    });
  }
});

// Route to remove a product from the cart
app.post("/cart/remove", verifyToken, async (req, res) => {
  const { userId, productId } = req.body;
  userId = `${userId}-32400`;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "Product ID and user ID are required." });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    return res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get all items in the cart
app.get("/cart", verifyToken, async (req, res) => {
  const userId = req.user.id; // Ensure the user ID is correctly extracted from the token

  try {
    let cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ userId, products: [] });
      await cart.save();
    }
    const totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
    res.status(200).json({ products: cart.products, totalPrice });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      message: "Failed to fetch cart items.",
      error: error.message,
    });
  }
});

// Route to clear the cart after a successful transaction
app.post("/cart/clear", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Failed to clear cart.",
      error: error.message,
    });
  }
});

// Route to add a product to likes
app.post("/likes/add", verifyToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "Product ID and user ID are required." });
  }

  try {
    const likedProduct = await Like.findOne({ userId, productId });

    if (likedProduct) {
      return res.status(400).json({ message: "Product already liked" });
    } else {
      const newLike = await Like.create({ userId, productId });
      return res.status(201).json(newLike);
    }
  } catch (error) {
    console.error("Error adding product to likes:", error);
    return res.status(500).json({
      message: "Failed to add product to likes.",
      error: error.message,
    });
  }
});

// Route to remove a product from likes
app.post("/likes/remove", verifyToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "Product ID and user ID are required." });
  }

  try {
    const likedProduct = await Like.findOneAndDelete({ userId, productId });

    if (!likedProduct) {
      return res.status(404).json({ message: "Product not found in likes" });
    }

    return res.status(200).json({ message: "Product removed from likes" });
  } catch (error) {
    console.error("Error removing product from likes:", error);
    return res.status(500).json({
      message: "Failed to remove product from likes.",
      error: error.message,
    });
  }
});

// Route to get all liked products for a user
app.get("/likes/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const likedProducts = await Like.find({ userId }).populate("productId");
    res.status(200).json({ likedProducts });
  } catch (error) {
    console.error("Error fetching liked products:", error);
    res.status(500).json({
      message: "Failed to fetch liked products.",
      error: error.message,
    });
  }
});

// // Route to get all liked products for a user
// app.get("/likes/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const likedProducts = await Like.find({ userId }).populate("productId");
//     res.status(200).json({ likedProducts });
//   } catch (error) {
//     console.error("Error fetching liked products:", error);
//     res.status(500).json({
//       message: "Failed to fetch liked products.",
//       error: error.message,
//     });
//   }
// });

// Route to handle transaction history
app.post("/transaction", verifyToken, async (req, res) => {
  const { products, totalPrice } = req.body;
  const userId = req.user.id;

  try {
    const newTransaction = new Transaction({
      userId,
      products,
      totalPrice,
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({
      message: "Failed to save transaction.",
      error: error.message,
    });
  }
});

// Route to get transaction history for a user
app.get("/transaction/history", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await Transaction.find({ userId }).populate(
      "products.productId"
    );
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({
      message: "Failed to fetch transaction history.",
      error: error.message,
    });
  }
});

// Route to get all transactions for admin
app.get("/admin/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().populate(
      "userId products.productId"
    );
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      message: "Failed to fetch transactions.",
      error: error.message,
    });
  }
});

app.get("/someRoute", (req, res) => {
  console.log(req); // This should log the cookies object
  res.send("Cookies logged");
});

// Route to create a new category
app.post("/admin/create/category", async (req, res) => {
  try {
    const categoryName = req.body.name.toLowerCase();
    const subcategoryName = req.body.subcategory ? req.body.subcategory.toLowerCase() : "";

    // Check if the category already exists
    let category = await Category.findOne({ name: categoryName });

    if (category) {
      // If the category exists, add the subcategory to the array if it's not already present
      if (subcategoryName && !category.subcategories.includes(subcategoryName)) {
        category.subcategories.push(subcategoryName);
        await category.save();
      }
      res.status(200).json({ category });
    } else {
      // If the category does not exist, create a new one
      category = new Category({
        name: categoryName,
        subcategories: subcategoryName ? [subcategoryName] : [],
        men: req.body.men,
        women: req.body.women,
        kid: req.body.kid,
      });
      const savedCategory = await category.save();
      res.status(201).json({ category: savedCategory });
    }
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to search products by name
app.get("/products/search", async (req, res) => {
  const { name } = req.query;

  try {
    const query = name ? { name: { $regex: new RegExp(name, "i") } } : {};
    const products = await Product.find(query);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
});

// Route to get product details by product ID
app.get("/product/details/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      message: "Failed to fetch product details.",
      error: error.message,
    });
  }
});

// Route to fetch all products and filter by name
app.get("/products/filter", async (req, res) => {
  const { name } = req.query;

  try {
    const query = name ? { name: { $regex: new RegExp(name, "i") } } : {};
    const products = await Product.find(query);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
});

// Error handling and server setup
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});