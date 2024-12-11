const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true, // Unique identifier for each subcategory
    },
    name: {
      type: String,
      required: true, // Subcategory name is mandatory
    },
    categoryId: {
      type: String,
      required: true, // Reference to the parent category
      ref: "Category", // References the Category model
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
