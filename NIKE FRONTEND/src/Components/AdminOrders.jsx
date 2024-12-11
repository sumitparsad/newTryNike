
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure the JWT token is stored in localStorage

        if (!token) {
          alert("User not authenticated. Please log in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/admin/transactions",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
            },
          }
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Orders</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Order ID</th>
            <th className="py-2">User</th>
            <th className="py-2">Products</th>
            <th className="py-2">Total Price</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="py-2">{transaction._id}</td>
              <td className="py-2">{transaction.userId.name}</td>
              <td className="py-2">
                {transaction.products.map((product) => (
                  <div key={product.productId._id}>
                    {product.productId.name} - {product.quantity} x ₹{product.price}
                  </div>
                ))}
              </td>
              <td className="py-2">₹{transaction.totalPrice}</td>
              <td className="py-2">{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;