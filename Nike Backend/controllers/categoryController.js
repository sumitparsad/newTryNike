const Category = require("../models/Category");

// Controller function to create a category
exports.createCategory = async (req, res) => {
  try {
    // Destructure data from the request body
    const { name, men, women, kid } = req.body;

    // Create a new category instance
    const newCategory = new Category({
      name,
      men,
      women,
      kid,
    });

    // Save the category to the database
    const savedCategory = await newCategory.save();

    // Respond with the saved category data
    res.status(201).json({
      message: "Category created successfully!",
      category: savedCategory,
    });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Controller function to get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
