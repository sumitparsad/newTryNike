import React from "react";
import NewArrival from "./NewArrival";
import ShopByCollection from "./ShopByCollection";
import Slogan from "../Components/Slogan";
import Banner from "../assets/Home_Banner.png";

function Home() {
  const handleHeartClick = (productId) => {
    // Add the product to the liked products in the database
    console.log(`Product ${productId} added to liked products`);
  };

  return (
    <>
      <Slogan />
      <div>
        <img
          src={Banner}
          className="object-contain w-full h-[700px] "
          alt="Nike Air Max Pulse Banner"
        />
      </div>

      <div className="flex flex-col items-center justify-center text-center py-10 text-black">
        <h2 className="text-sm uppercase tracking-wide mb-4">First Look</h2>
        <h1 className="text-5xl font-bold tracking-wide mb-6">
          NIKE AIR MAX PULSE
        </h1>
        <p className="max-w-lg text-lg mb-8">
          Extreme comfort. Hyper durable. Max volume. Introducing the Air Max
          Pulse — designed to push you past your limits and help you go to the
          max.
        </p>

        <div className="flex space-x-4">
          <button className="px-6 py-2 text-white bg-black font-semibold rounded-full">
            Notify Me
          </button>
          <button className="px-6 py-2 bg-black border border-white text-white font-semibold rounded-full ">
            Shop Air Max
          </button>
        </div>
      </div>
      <NewArrival onHeartClick={handleHeartClick} />
      <ShopByCollection />
    </>
  );
}

export default Home;
