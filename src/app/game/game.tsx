"use client";
import { useState, useEffect } from "react";
import orderbookData from "@/mock/mock.orderbook.json";

const Game = () => {
  const [selectedSecurity, setSelectedSecurity] = useState(
    orderbookData.securities[0].name,
  );
  const [bidAskQuantity, setBidAskQuantity] = useState(1);
  const [orderbook, setOrderbook] = useState(
    orderbookData.securities[0].prices,
  );

  useEffect(() => {
    const security = orderbookData.securities.find(
      (sec: { name: any }) => sec.name === selectedSecurity,
    );
    if (security) {
      setOrderbook(security.prices);
    }
  }, [selectedSecurity]);

  const handleBidAskQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBidAskQuantity(Number(event.target.value));
  };
  const handleCancelOrder = (price: number) => {
    console.log(`Cancel orders at ${price}`);
  };
  const handleSecurityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedSecurity(event.target.value);
  };
  const handleBid = (price: number) => {
    console.log(`Buy ${bidAskQuantity} at ${price}`);
  };
  const handleAsk = (price: number) => {
    console.log(`Sell ${bidAskQuantity} at ${price}`);
  };
  const handleCancelAllOrders = () => {
    console.log("Cancel all orders");
  };

  return (
    <div>
      <div className="flex gap-10 justify-center items-center px-5 m-4">
        <div>
          <label htmlFor="security-select" className="mr-2">
            Select Security:{" "}
          </label>
          <select
            id="security-select"
            value={selectedSecurity}
            onChange={handleSecurityChange}
            className="px-4 py-2 bg-gray-700"
          >
            {orderbookData.securities.map((security) => (
              <option key={security.name} value={security.name}>
                {security.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bid-ask-quantity" className="mr-2">
            Bid/Ask Quantity:{" "}
          </label>
          <input
            id="bid-ask-quantity"
            type="number"
            onChange={handleBidAskQuantityChange}
            className="w-[7em] px-2 py-1 bg-gray-700"
          />
        </div>
        <button
          onClick={handleCancelAllOrders}
          className="px-2 py-1 h-10 bg-gray-500 text-white shadow hover:bg-red-600 flex-grow"
        >
          Cancel All Orders
        </button>
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Buy</th>
            <th className="border border-gray-300 px-4 py-2">Sell</th>
            <th className="border border-gray-300 px-4 py-2">Bid Vol</th>
            <th className="border border-gray-300 px-4 py-2">Ask Vol</th>
            <th className="border border-gray-300 px-4 py-2">Order Clear</th>
          </tr>
        </thead>
        <tbody>
          {orderbook.map((entry, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 h-10">
                {entry.price}
              </td>
              <td className="border border-gray-300 h-10">
                <button
                  onClick={() => handleBid(entry.price)}
                  className="px-4 py-2 bg-gray-500 w-full h-full 
                  text-white shadow hover:bg-blue-600"
                >
                  Buy {bidAskQuantity}
                </button>
              </td>
              <td className="border border-gray-300 h-10">
                <button
                  onClick={() => handleAsk(entry.price)}
                  className="px-4 py-2 bg-gray-500 w-full h-full 
                  text-white shadow hover:bg-green-600"
                >
                  Sell {bidAskQuantity}
                </button>
              </td>
              <td className="border border-gray-300 px-4 h-10">
                {entry.bidVolume}
              </td>
              <td className="border border-gray-300 px-4 h-10">
                {entry.askVolume}
              </td>
              <td className="border border-gray-300 h-10">
                <button
                  onClick={() => handleCancelOrder(entry.price)}
                  className="px-4 py-2 bg-gray-500 w-full h-full text-white shadow hover:bg-red-600"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Game;
