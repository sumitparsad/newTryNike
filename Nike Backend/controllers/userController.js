const User = require("../models/user"); // Replace with the correct path to your user model

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch users", details: error.message });
  }
};

// Get users by a specific name
exports.getUsersByName = async (req, res) => {
  const { name } = req.params;

  try {
    const users = await User.find({ name: new RegExp(name, "i") }); // Case-insensitive match
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found with the specified name" });
    }
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch users by name", details: error.message });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id); // Find user by ID and delete
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete user", details: error.message });
  }
};
