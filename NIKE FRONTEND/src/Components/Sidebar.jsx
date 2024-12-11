import React, { useState } from "react";

const Sidebar = () => {
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isKidsOpen, setIsKidsOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  return (
    <div className="w-64 p-4 border-r">
      <div className="space-y-2">
        <div className="font-semibold">Categories</div>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>Shoes</li>
          <li>Sports Bras</li>
          <li>Tops & T-Shirts</li>
          <li>Hoodies & Sweatshirts</li>
          <li>Jackets</li>
          <li>Trousers & Tights</li>
          <li>Shorts</li>
          <li>Tracksuits</li>
          <li>Jumpsuits & Rompers</li>
          <li>Skirts & Dresses</li>
          <li>Socks</li>
          <li>Accessories & Equipment</li>
        </ul>
      </div>

      {/* Gender Filter */}
      <div className="mt-4">
        <div
          className="flex justify-between items-center font-semibold cursor-pointer"
          onClick={() => setIsGenderOpen(!isGenderOpen)}
        >
          Gender
          <span>{isGenderOpen ? "-" : "+"}</span>
        </div>
        {isGenderOpen && (
          <ul className="space-y-1 mt-2 text-sm text-gray-700">
            <li>
              <input type="checkbox" className="mr-2" />
              Men
            </li>
            <li>
              <input type="checkbox" className="mr-2" />
              Women
            </li>
            <li>
              <input type="checkbox" className="mr-2" />
              Unisex
            </li>
          </ul>
        )}
      </div>

      {/* Kids Filter */}
      <div className="mt-4">
        <div
          className="flex justify-between items-center font-semibold cursor-pointer"
          onClick={() => setIsKidsOpen(!isKidsOpen)}
        >
          Kids
          <span>{isKidsOpen ? "-" : "+"}</span>
        </div>
        {isKidsOpen && (
          <ul className="space-y-1 mt-2 text-sm text-gray-700">
            <li>
              <input type="checkbox" className="mr-2" />
              Boys
            </li>
            <li>
              <input type="checkbox" className="mr-2" />
              Girls
            </li>
          </ul>
        )}
      </div>

      {/* Price Filter */}
      <div className="mt-4">
        <div
          className="flex justify-between items-center font-semibold cursor-pointer"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
        >
          Shop By Price
          <span>{isPriceOpen ? "-" : "+"}</span>
        </div>
        {isPriceOpen && (
          <ul className="space-y-1 mt-2 text-sm text-gray-700">
            <li>
              <input type="checkbox" className="mr-2" />
              Under ₹ 2,500.00
            </li>
            <li>
              <input type="checkbox" className="mr-2" />₹ 2,501.00 - ₹ 5,000.00
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
