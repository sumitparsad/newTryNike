const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const {} = require("../controllers/adminController");

// Middleware to verify token and check admin role
router.use(isAuthenticated, isAdmin);

module.exports = router;
