import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import shoe1 from "../assets/NewArrival_shoe1.png"; // Example image

const Cart = () => {
  const [cart, setCart] = useState(null); // State to hold cart data
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch cart data from the backend or local storage on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get("http://localhost:5001/cart", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
            },
          });

          const cartData = response.data;
          console.log("Fetched cart data from DB:", cartData);
          const productsWithDetails = await Promise.all(
            cartData.products.map(async (item) => {
              try {
                const productResponse = await axios.get(`http://localhost:5001/product/details/${item.productId._id}`);
                return {
                  ...item,
                  productDetails: productResponse.data,
                };
              } catch (error) {
                console.error(`Error fetching product details for product ID ${item.productId._id}:`, error.response?.data || error.message);
                return item;
              }
            })
          );

          const localCart = JSON.parse(localStorage.getItem("cart")) || { products: [], totalPrice: 0 };
          console.log("Local cart data:", localCart);
          const localProductsWithDetails = await Promise.all(
            localCart.products.map(async (item) => {
              try {
                const productResponse = await axios.get(`http://localhost:5001/product/details/${item.productId}`);
                return {
                  ...item,
                  productDetails: productResponse.data,
                };
              } catch (error) {
                console.error(`Error fetching product details for product ID ${item.productId}:`, error.response?.data || error.message);
                return item;
              }
            })
          );

          setCart({
            products: [...productsWithDetails, ...localProductsWithDetails],
            totalPrice: cartData.totalPrice + localCart.totalPrice,
          });
          console.log("Combined cart data:", { products: [...productsWithDetails, ...localProductsWithDetails], totalPrice: cartData.totalPrice + localCart.totalPrice });
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart")) || { products: [], totalPrice: 0 };
        const productsWithDetails = await Promise.all(
          localCart.products.map(async (item) => {
            try {
              const productResponse = await axios.get(`http://localhost:5001/product/details/${item.productId}`);
              return {
                ...item,
                productDetails: productResponse.data,
              };
            } catch (error) {
              console.error(`Error fetching product details for product ID ${item.productId}:`, error.response?.data || error.message);
              return item;
            }
          })
        );
        setCart({ ...localCart, products: productsWithDetails });
        console.log("Local cart data only:", { ...localCart, products: productsWithDetails });
      }
    };

    fetchCartData();
  }, []);

  const syncLocalCartToDB = async () => {
    const token = localStorage.getItem("token");
    const localCart = JSON.parse(localStorage.getItem("cart")) || { products: [], totalPrice: 0 };

    if (token && localCart.products.length > 0) {
      try {
        for (const product of localCart.products) {
          await axios.post(
            `http://localhost:5001/cart/add/${product.productId}`,
            { price: product.price, quantity: product.quantity },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
              },
            }
          );
        }
        localStorage.removeItem("cart"); // Clear local storage after syncing
      } catch (error) {
        console.error("Error syncing local cart to DB:", error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      syncLocalCartToDB();
    }
  }, []);

  if (!cart) {
    return <div>Loading...</div>; // Show loading if cart is not yet fetched
  }

  const { products = [], totalPrice = 0 } = cart; // Ensure products and totalPrice are defined

  // Calculate the total for each product and overall cart
  const deliveryFee = 750;
  const total = totalPrice + deliveryFee - discount;

  const handleQuantityChange = (index, change) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = Math.max(
      1,
      updatedProducts[index].quantity + change
    );
    updatedProducts[index].price = updatedProducts[index].productDetails.price * updatedProducts[index].quantity; // Update the price based on quantity
    const newTotalPrice = updatedProducts.reduce((acc, product) => acc + product.price, 0); // Recalculate total price
    setCart({ ...cart, products: updatedProducts, totalPrice: newTotalPrice }); // Update cart with new total price

    if (!localStorage.getItem("token")) {
      localStorage.setItem("cart", JSON.stringify({ products: updatedProducts, totalPrice: newTotalPrice }));
    }
  };

  const handleApplyCoupon = () => {
    if (coupon === "DISCOUNT10") {
      setDiscount(259); // Example: 10% discount
    } else {
      alert("Invalid Coupon");
    }
  };

  const handleAction = (action, index) => {
    if (action === "favourite") {
      alert("Item added to favourites!");
    } else if (action === "remove") {
      const updatedProducts = products.filter((_, i) => i !== index);
      const newTotalPrice = updatedProducts.reduce((acc, product) => acc + product.price, 0);
      setCart({ ...cart, products: updatedProducts, totalPrice: newTotalPrice });

      if (!localStorage.getItem("token")) {
        localStorage.setItem("cart", JSON.stringify({ products: updatedProducts, totalPrice: newTotalPrice }));
      }
      alert("Item removed from bag!");
    }
  };

  const handleAddToCart = (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || { products: [], totalPrice: 0 };
      const existingProduct = localCart.products.find((item) => item.productId === product.productId);

      if (existingProduct) {
        alert("Product already in cart!");
      } else {
        localCart.products.push({
          productId: product.productId,
          price: product.productId.price,
          quantity: 1,
        });
        localCart.totalPrice = localCart.products.reduce((acc, item) => acc + item.price, 0);
        localStorage.setItem("cart", JSON.stringify(localCart));
        setCart(localCart);
        alert("Product added to cart!");
      }
    } else {
      // Handle authenticated user case
      alert("User not authenticated. Please log in.");
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to proceed with the checkout.");
      navigate("/login"); // Redirect to login page
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/transaction",
        {
          products: products.map((product) => ({
            productId: product.productId._id,
            quantity: product.quantity,
            price: product.price,
          })),
          totalPrice: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        }
      );
      console.log("Transaction saved:", response.data);
      alert("Checkout successful!");

      // Remove items from cart after successful checkout
      await axios.post(
        "http://localhost:5001/cart/clear",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        }
      );

      navigate("/transaction-history"); // Redirect to transaction history page
    } catch (error) {
      console.error("Failed to complete checkout:", error.response?.data || error.message);
      alert("Failed to complete checkout.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 p-6 md:p-12 bg-gray-50 rounded-lg shadow-lg">
      {/* Bag Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">Bag</h2>
        {products.map((product, index) => (
          <div key={index} className="flex gap-6 border-b pb-6">
            {product.productDetails && (
              <img
                src={`http://localhost:5001/${product.productDetails.image}`} // Ensure the correct path to the image
                alt={product.productDetails.name || "Product Image"}
                className="w-48 h-48 object-contain rounded-lg shadow-lg"
              />
            )}
            <div className="flex flex-col justify-between py-4 gap-2">
              <h3 className="text-lg font-medium">{product.productDetails?.name}</h3> {/* Dynamic product name */}
              <p className="text-gray-600">{product.productDetails?.description}</p> {/* Dynamic product description */}
              <p className="font-semibold text-xl">₹{product.price}</p> {/* Dynamic price */}
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => handleQuantityChange(index, -1)}
                  className="border rounded-full px-4 py-2 hover:bg-gray-200 transition pt-1"
                >
                  -
                </button>
                <span className="font-semibold text-lg">{product.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(index, 1)}
                  className="border rounded-full px-4 py-2 hover:bg-gray-200 transition pt-1"
                >
                  +
                </button>
              </div>
              <div className="flex space-x-4 text-gray-600 underline font-medium text-sm mt-2">
                <button
                  onClick={() => handleAction("favourite", index)}
                  className="hover:underline transition"
                >
                  Favourites
                </button>
                <button
                  onClick={() => handleAction("remove", index)}
                  className="hover:underline transition"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="hover:underline transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span> {/* Dynamic subtotal */}
          </div>
          <div className="flex justify-between">
            <span>Quantity</span>
            <span>{products.reduce((acc, product) => acc + product.quantity, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Delivery (3-5 days)</span>
            <span>₹{deliveryFee * products.length}</span>
          </div>
          <div className="flex justify-between ">
            <span>Discount</span>
            <span className="text-green-500">₹{discount}</span>
          </div>
          <div className="flex justify-between font-semibold mt-4 text-xl">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="border p-2 w-full rounded mb-4"
          />
          <button
            onClick={handleApplyCoupon}
            className="w-full bg-gray-200 text-black py-2 rounded mb-4 hover:bg-gray-300 transition"
          >
            Apply Coupon
          </button>
          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Member Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;