const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Store userId as a string
      required: true,
      unique: true, // Ensure userId is unique
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
      required: true,
      ref: "Product", // References the Product model
    },
    price: {
      type: Number,
      required: true, // Price of the product at the time it's added to the cart
    },
    quantity: {
      type: Number,
      default: 1, // Default quantity is 1
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields
);

// Append random 5-digit number to userId before saving
cartSchema.pre("save", function (next) {
  if (this.isModified("userId")) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
    this.userId = `${this.userId}-${randomSuffix}`;
  }
  next();
});

// Method to compare userId
cartSchema.methods.compareUserId = function (candidateUserId) {
  const storedUserId = this.userId.slice(0, -6); // Remove the last 6 characters (including the hyphen)
  return storedUserId === candidateUserId;
};

module.exports = mongoose.model("Cart", cartSchema);
