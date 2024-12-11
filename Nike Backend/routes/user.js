const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUsersByName,
  deleteUserById,
} = require("../controllers/userController");

// Route to get all users
router.get("/", getAllUsers);

// Route to get users by name
router.get("/:name", getUsersByName);

// Route to delete user by ID
router.delete("/delete/:id", deleteUserById);
module.exports = router;
