const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Route to create a new category
router.post("/admin/create/category", categoryController.createCategory);

module.exports = router;
