const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

// isAuthenticated Middleware: Checks if the user is authenticated (valid JWT)
exports.isAuthenticated = async (req, res, next) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Received Token:", token); // Debugging

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  // // Check if the token is blacklisted
  // if (tokenBlacklist.has(token)) {
  //   return res
  //     .status(401)
  //     .json({ message: "Token is invalidated. Please log in again." });
  // }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // First, check if the token belongs to an admin
    const admin = await Admin.findById(decoded.id).select("-password");
    if (admin) {
      req.user = admin; // Attach admin to the request
      req.userType = "admin"; // Optional: Attach type for further middleware
      return next();
    }

    // If not an admin, check if it belongs to a user
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user; // Attach user to the request
      req.userType = "user"; // Optional: Attach type for further middleware
      return next();
    }

    // If neither, return an error
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
// isUser Middleware: Checks if the authenticated user is a normal user
exports.isUser = (req, res, next) => {
  if (req.user && req.user._id) {
    return next(); // Proceed if the user is authenticated
  }
  return res.status(403).json({
    message: "You are not authorized to access this resource as a user.",
  });
};

// isAdmin Middleware: Checks if the authenticated user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    // Check if the user is an admin
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(403).json({
        message: "You are not authorized to access this resource as an admin.",
      });
    }

    // If the user is an admin, check if they have a valid role (SuperAdmin, Admin, or Moderator)
    if (
      admin.role === "SuperAdmin" ||
      admin.role === "Moderator" ||
      admin.role === "Admin"
    ) {
      req.admin = admin; // Attach the admin to the request object
      return next(); // Proceed if the user is an admin
    }

    return res.status(403).json({
      message: "You do not have the required admin permissions.",
    });
  } catch (err) {
    res.status(500).json({ message: "Error verifying admin status." });
  }
};
