import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure the JWT token is stored in localStorage

        if (!token) {
          alert("User not authenticated. Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:5001/transaction/history", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    fetchTransactionHistory();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction._id} className="mb-6 p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Transaction ID: {transaction._id}</h2>
            <p className="text-gray-600">Date: {new Date(transaction.date).toLocaleString()}</p>
            <p className="text-gray-600">Total Price: ₹{transaction.totalPrice}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Products:</h3>
              <ul className="list-disc list-inside">
                {transaction.products.map((product) => (
                  <li key={product.productId?._id} className="flex items-center gap-4">
                    {product.productId && (
                      <>
                        <img
                          src={`http://localhost:5001/${product.productId.image}`}
                          alt={product.productId.name}
                          className="w-16 h-16 object-contain rounded-lg shadow-md"
                        />
                        <div>
                          {product.productId.name} - Quantity: {product.quantity} - Price: ₹{product.price}
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionHistory;