const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Controller to create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    // Create a new product
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      categoryId,
      stock,
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// Controller to get all products
const getAllProducts = async (req, res) => {
  try {
    const categoryFilter = req.query.category; // assuming you pass category via query parameters
    const products = await Product.find(
      categoryFilter ? { categoryId: categoryFilter } : {}
    )
      .populate("categoryId", "name")
      .exec();

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
const getProductbyID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller to delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find and delete the product by its ID
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// Controller to update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Product ID from request parameters
    const updateData = req.body; // Updated product data from request body
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Find the product by ID and update it with the new data
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true } // Return the updated document and validate the updates
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Controller function to get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId");
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProductbyID,
  upload,
};
