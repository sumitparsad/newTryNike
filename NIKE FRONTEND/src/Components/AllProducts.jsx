import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5001/products", {
          params: {
            name: selectedCategory ? "" : undefined,
            category: selectedCategory || undefined,
          },
        });
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (location.state?.products) {
      setProducts(location.state.products);
    } else {
      fetchProducts();
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:5001/likes/${userId}`)
        .then((response) => {
          setLikedProducts(response.data.likedProducts.map(like => like.productId) || []);
        })
        .catch((error) => {
          console.error("Error fetching liked products:", error);
        });
    }
  }, [selectedCategory, location.state?.products]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleProductClick = (productId) => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      navigate(`/product/${productId}`, { state: { product } });
    }
  };

  const handleLikeClick = async (e, productId) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        if (likedProducts.includes(productId)) {
          await axios.post(
            `http://localhost:5001/likes/remove`,
            { userId, productId },
            { headers }
          );
          setLikedProducts((prev) => prev.filter((id) => id !== productId));
        } else {
          await axios.post(
            `http://localhost:5001/likes/add`,
            { userId, productId },
            { headers }
          );
          setLikedProducts((prev) => [...prev, productId]);
        }
      } catch (error) {
        console.error("Error updating product likes:", error);
      }
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (categoryName === "All") {
      window.location.reload();
    } else {
      setSelectedCategory(categoryName);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div>
      <h1 className="font-Anton text-6xl font-semibold p-12">All Products</h1>
      <div className="flex overflow-x-auto p-4 space-x-4">
        <div
          onClick={() => handleCategoryClick("All")}
          className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-lg font-semibold">All</h2>
        </div>
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category.name)}
            className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold">{category.name}</h2>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-16 p-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="bg-white max-w-xs h-[400px] flex flex-col justify-between items-start relative p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="w-full h-[250px] flex justify-center items-center bg-zinc-200 rounded-lg overflow-hidden">
                <img
                  src={`http://localhost:5001/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-[#151414] font-Inter text-base font-semibold mt-3">
                {product.name}
              </h1>
              <p className="text-sm text-[#838383]">
                {product.category || "Unknown Category"}
              </p>
              <p className="text-sm text-[#838383]">
                {product.subcategory || "Unknown Subcategory"}
              </p>
              <p className="text-[#151414] font-Inter text-base font-medium mt-2">
                ${product.price}
              </p>
              <div
                className="flex justify-center items-center mt-2 cursor-pointer transition-transform duration-300 hover:scale-125"
                onClick={(e) => handleLikeClick(e, product._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={likedProducts.includes(product._id) ? "red" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
    
  );
};

export default AllProducts;