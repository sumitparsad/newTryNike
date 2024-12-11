import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/user/login",
        formData
      );
      console.log("Login response:", response);
      const { token, _id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);
      window.dispatchEvent(new Event("storage")); // Trigger storage event
      alert(response.data.message || "Login successful!");

      // Sync local cart to DB
      const localCart = JSON.parse(localStorage.getItem("cart")) || { products: [], totalPrice: 0 };
      console.log("Local cart before syncing:", localCart);
      if (localCart.products.length > 0) {
        const syncPromises = localCart.products.map(async (product) => {
          try {
            console.log("Syncing product to DB:", product);
            await axios.post(
              `http://localhost:5001/cart/add/${product.productId}`,
              {
                price: product.price,
                quantity: product.quantity,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (error) {
            console.error("Error syncing product to DB:", error.response?.data || error.message);
          }
        });
        await Promise.all(syncPromises); // Wait for all sync operations to complete
        localStorage.removeItem("cart"); // Clear local storage after syncing
      }

      // Fetch all cart products of the user
      const cartResponse = await axios.get("http://localhost:5001/cart", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched cart data from DB:", cartResponse.data);

      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Same layout */}
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-primary-foreground">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Welcome to <br />
            Nike Ecommerce Website
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-md shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Sign in to your account
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-gray-600">
            New here?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-center text-gray-600">
            Login as admin?{" "}
            <Link to="/adminlogin" className="text-blue-500 hover:underline">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;