const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Category name is mandatory
    },
    men: {
      type: Boolean,
      default: false, // Indicates if this category applies to Men
    },
    women: {
      type: Boolean,
      default: false, // Indicates if this category applies to Women
    },
    kid: {
      type: Boolean,
      default: false, // Indicates if this category applies to Kids
    },
    subcategories: {
      type: [String], // Store subcategories as an array of strings
      default: [], // Default to an empty array
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields
);

module.exports = mongoose.model("Category", categorySchema);
