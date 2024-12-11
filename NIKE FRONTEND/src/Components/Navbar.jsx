import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Nike_Logo.png";
import SearchIcon from "../assets/Nav_Search.png"; // Using the SearchIcon image from your assets
import FavoriteIcon from "../assets/Nav_Favorite.png";
import CartIcon from "../assets/Nav_Cart.png";

function Navbar() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [searchText, setSearchText] = useState(""); // State to track search text
  const navigate = useNavigate();

  const fetchCartItemCount = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    if (userId && token) {
      setIsLoggedIn(true); // Set login status to true if token exists
      try {
        const response = await axios.get(`http://localhost:5001/cart`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        });
        const cart = response.data.products; // Access the products array from the response
        console.log(cart);
        const itemCount = cart.length;
        console.log(itemCount);
        setCartItemCount(itemCount);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5001/products`);
      const filteredProducts = response.data.products.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      navigate("/all-products", {
        state: { products: filteredProducts },
      });
    } catch (error) {
      console.error("Error searching products:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCartItemCount();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="h-[100px] flex">
      <div className="h-full px-12 flex items-center justify-center">
        {/* Wrap the logo in a Link to navigate to the home page */}
        <Link to="/">
          <img src={logo} alt="Nike Logo" />
        </Link>
      </div>
      {/* Central div to hold links and take remaining width */}
      <div className="flex-grow h-full flex justify-center items-center gap-12 text-lg font-semibold">
        <Link to="/all-products" className="font-Inter font-medium">
          All Products
        </Link>
        <Link to="/men-products" className="font-Inter font-medium">
          Men
        </Link>
        <Link to="/women-products" className="font-Inter font-medium">
          Women
        </Link>
        <Link to="/kids-products" className="font-Inter font-medium">
          Kids
        </Link>
      </div>

      <div className="flex h-full items-center p-8 gap-8">
        {/* Inline Search Bar with SearchIcon image */}
        <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-[220px]">
          <img src={SearchIcon} alt="Search Icon" className="w-[25px] h-5 mr-2" />
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-transparent outline-none text-gray-700 w-full ml-1 text-[16px]"
          />
        </form>

        <img
          src={FavoriteIcon}
          className="object-contain w-[25px] cursor-pointer"
          alt="Favorites"
          onClick={() => navigate("/like")}
        />
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <img src={CartIcon} className="object-contain w-[25px]" alt="Cart" />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cartItemCount}
            </span>
          )}
        </div>
        {isLoggedIn ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[25px] h-[25px] cursor-pointer"
              onClick={() => navigate("/transaction-history")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[25px] h-[25px] cursor-pointer"
              onClick={handleLogout}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </>
        ) : (
          <Link to="/login">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[25px] h-[25px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;