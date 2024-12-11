const express = require("express");
const router = express.Router();
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  getProductbyID,
} = require("../controllers/productController");

// POST route to create a new product
router.post("/admin/create/product", createProduct);

// GET route to fetch all products
router.get("/admin/get/product", getAllProducts);

//GET route to fetch one product detail by ID
router.get("/admin/get/product/:id", getProductbyID);

// PUT route to update a product by ID
router.put("/admin/update/product/:productId", updateProduct);

// DELETE route to delete a product by ID
router.delete("/admin/delete/product/:productId", deleteProduct);

module.exports = router;

// http://localhost:5001/admin/update/product/:productId
