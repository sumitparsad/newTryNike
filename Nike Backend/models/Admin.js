const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Full name of the admin is mandatory
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email should be unique
    },
    password: {
      type: String,
      required: true, // Password is mandatory and will be encrypted before saving
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Moderator", "Admin"], // Define possible roles for the admin
      default: "Admin", // Default role
    },
  },
  { timestamps: true } // Automatically creates 'createdAt' and 'updatedAt' fields
);

module.exports = mongoose.model("Admin", adminSchema);
