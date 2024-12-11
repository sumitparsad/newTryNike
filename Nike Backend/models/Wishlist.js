const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    wishlistId: {
      type: mongoose.Schema.Types.ObjectId, // Using ObjectId as unique identifier
      default: mongoose.Types.ObjectId, // Automatically generates a new ObjectId if not provided
      required: true,
      unique: true, // Unique identifier for the wishlist
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      required: true,
      ref: "User", // References the User model
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        ref: "Product", // References the Product model
      },
    ],
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
