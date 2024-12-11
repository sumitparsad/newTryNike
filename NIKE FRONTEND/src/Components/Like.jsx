import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

function Like() {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (userId && token) {
        try {
          const headers = { Authorization: `Bearer ${token}` }; // Set the Authorization header
          const response = await axios.get(`http://localhost:5001/likes/${userId}`, { headers });
          setLikedProducts(response.data.likedProducts.map(like => like.productId));
        } catch (error) {
          console.error("Error fetching liked products:", error);
        }
      }
    };

    fetchLikedProducts();
  }, []);

  const handleLikeClick = async (productId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (userId && token) {
      try {
        const headers = { Authorization: `Bearer ${token}` }; // Set the Authorization header
        const isLiked = likedProducts.some(product => product._id === productId);
        if (isLiked) {
          await axios.post(`http://localhost:5001/likes/remove`, { userId, productId }, { headers });
          setLikedProducts(likedProducts.filter(product => product._id !== productId));
        } else {
          await axios.post(`http://localhost:5001/likes/add`, { userId, productId }, { headers });
          const response = await axios.get(`http://localhost:5001/products/${productId}`);
          setLikedProducts([...likedProducts, response.data]);
        }
      } catch (error) {
        console.error("Error updating likes:", error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="font-Anton text-6xl font-semibold mb-6">Liked Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-16 p-8">
        {likedProducts.map((product) => (
          <div
            key={product?._id}
            className="bg-white max-w-xs h-[350px] flex flex-col justify-between items-start relative p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-full h-[250px] flex justify-center items-center bg-zinc-200 rounded-lg overflow-hidden">
              {product && (
                <>
                  <img
                    src={`http://localhost:5001/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md cursor-pointer" onClick={() => handleLikeClick(product._id)}>
                    <FaHeart className="text-red-600" />
                  </div>
                </>
              )}
            </div>
            {product && (
              <>
                <h1 className="text-[#151414] font-Inter text-base font-semibold mt-3">
                  {product.name}
                </h1>
                <p className="text-sm text-[#838383]">{product.categoryId?.name}</p>
                <p className="text-[#151414] font-Inter text-base font-medium mt-2">
                  {`$${product.price}`}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Like;
