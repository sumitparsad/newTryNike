import React from "react";

const Filter = () => {
  return (
    <div className="flex space-x-2 bg-white p-4 text-gray-700">
      <select className="appearance-none bg-white text-gray-700 hover:text-black px-4 py-2 border border-gray-300 rounded cursor-pointer">
        <option>Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <select className="appearance-none bg-white text-gray-700 hover:text-black px-4 py-2 border border-gray-300 rounded cursor-pointer">
        <option>Category</option>
        <option>Clothing</option>
        <option>Accessories</option>
        <option>Footwear</option>
      </select>

      <select className="appearance-none bg-white text-gray-700 hover:text-black px-4 py-2 border border-gray-300 rounded cursor-pointer">
        <option>Product type</option>
        <option>Shirts</option>
        <option>Pants</option>
        <option>Shoes</option>
      </select>

      <select className="appearance-none bg-white text-gray-700 hover:text-black px-4 py-2 border border-gray-300 rounded cursor-pointer">
        <option>Size</option>
        <option>Small</option>
        <option>Medium</option>
        <option>Large</option>
      </select>

      <select className="appearance-none bg-white text-gray-700 hover:text-black px-4 py-2 border border-gray-300 rounded cursor-pointer">
        <option>Price</option>
        <option>Low to High</option>
        <option>High to Low</option>
      </select>

      <select className="appearance-none bg-white text-gray-700 hover:text-black px-4 py-2 border border-gray-300 rounded cursor-pointer">
        <option>Color</option>
        <option>Red</option>
        <option>Blue</option>
        <option>Green</option>
      </select>

      <select className="appearance-none bg-white text-gray-700 hover:text-black px-4 py-2 border border-gray-300 rounded cursor-pointer">
        <option>More filters</option>
        <option>Newest</option>
        <option>Popular</option>
        <option>Discounted</option>
      </select>

      <select className="appearance-none bg-white text-gray-700 hover:text-black px-4 py-2 border border-gray-300 rounded cursor-pointer">
        <option>Sort by</option>
        <option>Relevance</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
    </div>
  );
};

export default Filter;
