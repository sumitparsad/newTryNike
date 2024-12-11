import React from "react";
import Men from "../assets/Collection_Men.png";
import Women from "../assets/Collection_Women.png";
import Kids from "../assets/Collection_Kids.png";

function ShopByCollection() {
  return (
    <div className="py-20 ">
      <h1 className="font-Anton text-5xl text-black text-left px-8 mb-12 ps-16">
        SHOP BY COLLECTION
      </h1>
      <div className="flex items-center justify-between h-[600px] px-8 lg:px-16">
        {/* Men Collection */}
        <div className="relative group w-[30%]">
          <img
            src={Men}
            alt="Men Collection"
            className="object-cover h-full w-full rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <a href="/men-products">
            <h1 className="absolute bottom-8 left-[50%] transform -translate-x-1/2 bg-white p-4 py-2 rounded-full text-lg shadow-lg font-semibold text-gray-800 transition-all duration-300 group-hover:bg-gray-800 group-hover:text-white">
              Men
            </h1>
          </a>
        </div>

        {/* Women Collection */}
        <div className="relative group w-[30%]">
          <img
            src={Women}
            alt="Women Collection"
            className="object-cover h-full w-full rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <a href="/women-products">
            <h1 className="absolute bottom-8 left-[50%] transform -translate-x-1/2 bg-white p-4 py-2 rounded-full text-lg shadow-lg font-semibold text-gray-800 transition-all duration-300 group-hover:bg-gray-800 group-hover:text-white">
              Women
            </h1>
          </a>
        </div>

        {/* Kids Collection */}
        <div className="relative group w-[30%]">
          <img
            src={Kids}
            alt="Kids Collection"
            className="object-cover h-full w-full rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <a href="/kids-products">
            <h1 className="absolute bottom-8 left-[50%] transform -translate-x-1/2 bg-white p-4 py-2 rounded-full text-lg shadow-lg font-semibold text-gray-800 transition-all duration-300 group-hover:bg-gray-800 group-hover:text-white">
              Kids
            </h1>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ShopByCollection;
