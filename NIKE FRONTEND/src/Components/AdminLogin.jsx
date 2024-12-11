import React, { useState } from "react";
import axios from "axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Form data
    const formData = { email, password };

    // Example login logic using axios
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/admin/login",
        formData
      );

      // Show success message and handle redirection based on response
      alert(response.data.message || "Login successful!");
      window.location.href = "http://localhost:5173/admin"; // Redirect to Admin Dashboard
    } catch (err) {
      setError(
        err.response?.data?.message || "Error during login, please try again"
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left section with welcome message */}
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome Back to Admin Portal
          </h1>
          <p className="text-gray-300">
            Login to manage products, orders, and more.
          </p>
        </div>
      </div>

      {/* Right section with Login form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-8">
        <div className="w-full max-w-md space-y-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Admin Login
          </h2>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>

          {/* Error Message */}
          {error && (
            <div className="text-center text-red-600 text-sm mb-4">{error}</div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-black rounded hover:bg-gray-800 focus:outline-none"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
