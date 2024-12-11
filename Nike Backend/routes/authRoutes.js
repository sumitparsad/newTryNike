const express = require("express");
const {
  loginUser,
  adminLogin,
  userRegister,
  adminRegister,
} = require("../controllers/authController");
const {
  isAuthenticated,
  isUser,
  isAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// User Registration Route
router.post("/user/register", userRegister);

// Admin Registration Route
router.post("/admin/register", adminRegister);

// User Login Route
router.post("/user/login", loginUser);

// Admin Login Route
router.post("/admin/login", adminLogin);

// Example protected routes
router.get("/user/profile", isAuthenticated, isUser, (req, res) => {
  res.status(200).json({ message: "Welcome User! This is your profile" });
});

router.get("/admin/dashboard", isAuthenticated, isAdmin, (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome Admin! This is the Admin Dashboard" });
});

module.exports = router;
