import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
    address: "",
    telephone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/user/register",
        formData
      );
      alert(response.data.message || "Registered successfully!");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to Nike Ecommerce
          </h1>
          <p className="text-gray-300">
            Join us to explore exclusive products and deals.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-8">
        <div className="w-full max-w-md space-y-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name and Gender */}
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1">
                <select
                  id="gender"
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {/* Email */}
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {/* Password */}
            <div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {/* Address and Phone */}
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  id="address"
                  placeholder="Address"
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  id="telephone"
                  placeholder="Phone"
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-black rounded hover:bg-gray-800 focus:outline-none"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
