const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1h",
  });
};

// User Registration
exports.userRegister = async (req, res) => {
  const { name, email, password, address, telephone, gender } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      telephone,
      gender,
    });

    await newUser.save();

    // Generate JWT token after successful registration
    const token = generateToken(newUser._id, "User");

    // Send token in the response header
    res.status(201).header("Authorization", `Bearer ${token}`).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Registration
exports.adminRegister = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Email already registered" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || "Admin", // Default to "Admin" if no role is provided
    });

    await newAdmin.save();

    // Generate JWT token after successful registration
    const token = generateToken(newAdmin._id, "Admin");

    // Send token in the response header
    res.status(201).header("Authorization", `Bearer ${token}`).json({
      message: "Admin registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id, "User");
      // Send token in the response header
      res.status(200).header("Authorization", `Bearer ${token}`).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id, "Admin");

    // Send token in the response header
    res.status(200).header("Authorization", `Bearer ${token}`).json({
      message: "Admin logged in successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
