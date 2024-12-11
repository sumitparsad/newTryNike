import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams(); // Extract 'id' from the URL
  const location = useLocation(); // Get location state
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(location.state?.inCart || false); // Initialize inCart from location state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/products/${id}` // Ensure this URL matches your backend server's address
        );
        console.log(response.data);
        setProduct(response.data);
      } catch (error) {
        if (error.response) {
          console.error("Error fetching product:", error.response.data.message);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
    };

    fetchProduct();
    checkCart(); // Check if the product is in the cart
  }, [id]);

  const checkCart = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    if (userId && token) {
      try {
        const response = await axios.get(`http://localhost:5001/cart`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        });
        const cart = response.data.products; // Access the products array from the response
        const productInCart = cart.find((item) => item.productId._id === id); // Compare with productId._id
        setInCart(!!productInCart);
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    }
  };

  const updateCartCount = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    if (userId && token) {
      try {
        const response = await axios.get(`http://localhost:5001/cart`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        });
        const cart = response.data.products; // Access the products array from the response
        const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        // Update the cart item count in the Navbar or global state
        // For example, using a context or a state management library
        // Assuming you have a context or state management setup to update the Navbar
        // Example: setCartItemCount(itemCount);
      } catch (error) {
        console.error("Error updating cart count:", error);
      }
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || { products: [], totalPrice: 0 };
      const existingProduct = localCart.products.find((item) => item.productId === id);

      if (existingProduct) {
        alert("Product already in cart!");
      } else {
        localCart.products.push({
          productId: id,
          price: product.price,
          quantity: 1,
        });
        localCart.totalPrice = localCart.products.reduce((acc, item) => acc + item.price, 0);
        localStorage.setItem("cart", JSON.stringify(localCart));
        setInCart(true);
        alert("Product added to cart successfully!");
      }
    } else {
      try {
        const response = await axios.post(
          `http://localhost:5001/cart/add/${id}`,
          { price: product.price },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Cart updated:", response.data);
        setInCart(true);
        updateCartCount();
        alert(response.data.message || "Product added to cart successfully!");
      } catch (error) {
        console.error("Failed to add product to cart:", error.response?.data || error.message);
        alert("Failed to add product to cart.");
      }
    }
  };

  const removeFromCart = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure the JWT token is stored in localStorage

      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/cart/remove",
        {
          productId: id, // Use the product ID from the URL
          userId: localStorage.getItem("userId"), // Replace with the actual user ID
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        }
      );
      console.log("Cart updated:", response.data);
      setInCart(false);
      updateCartCount();
      alert("Product removed from cart successfully!");
    } catch (error) {
      console.error(
        "Failed to remove product from cart:",
        error.response?.data || error.message
      );
      alert("Failed to remove product from cart.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // Determine the maximum quantity based on stock (max 5 or available stock)
  const maxQuantity = Math.min(product.stock, 5);

  return (
    <div className="flex flex-col lg:flex-row p-8 space-y-10 lg:space-y-0 lg:space-x-12">
      {/* Images Section */}
      <div className="grid grid-cols-2 gap-12 lg:w-1/2 ms-20">
        {product.image ? (
          <img
            src={`http://localhost:5001/${product.image}`} // Ensure the correct path to the image
            alt={product.name}
            className="w-full h-96 object-contain rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg shadow-lg">
            <p className="text-gray-500">Image not available</p>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="lg:w-1/2 space-y-4 pe-20">
        <p className="text-gray-600 text-sm">{product.category}</p>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold text-gray-800 pb-10">
          ${product.price}
        </p>
        <pre className="text-gray-600  text-wrap ">{product.description}</pre>
        <p className="text-gray-600 pb-2">{product.additionalInfo}</p>
        {/* Quantity Selector */}
        {/* Buttons */}
        <div className="flex items-center space-x-4 mt-6">
          {inCart ? (
            <button
              onClick={removeFromCart}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold"
            >
              REMOVE FROM CART
            </button>
          ) : (
            <button
              onClick={addToCart}
              className="bg-black text-white px-6 py-2 rounded-lg font-semibold"
              disabled={quantity > product.stock}
            >
              ADD TO CART
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;