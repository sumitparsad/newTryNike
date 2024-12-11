const mongoose = require("mongoose");

// MongoDB connection URL from environment variables (ensure the URI is set in your .env file)
const MONGO_URI = process.env.MONGO_URI; // Update this with your DB URI

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/tryNike", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

// Export the connection function
module.exports = connectDB;
