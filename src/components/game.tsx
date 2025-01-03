import React, { useState, useEffect } from "react";
import orderbookData from "../mock/mock.orderbook.json";

const Game: React.FC = () => {
  const [selectedSecurity, setSelectedSecurity] = useState(
    orderbookData.securities[0].name
  );
  const [bidAskQuantity, setBidAskQuantity] = useState(1);
  const [orderbook, setOrderbook] = useState(
    orderbookData.securities[0].prices
  );

  useEffect(() => {
    const security = orderbookData.securities.find(
      (sec: { name: any }) => sec.name === selectedSecurity
    );
    if (security) {
      setOrderbook(security.prices);
    }
  }, [selectedSecurity]);

  const handleBidAskQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBidAskQuantity(Number(event.target.value));
  };
  const handleCancelOrder = (price: number) => {
    console.log(`Cancel orders at ${price}`);
  };
  const handleSecurityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSecurity(event.target.value);
  };
  const handleBid = (price: number) => {
    console.log(`Bid ${bidAskQuantity} at ${price}`);
  };
  const handleAsk = (price: number) => {
    console.log(`Ask ${bidAskQuantity} at ${price}`);
  };
  const handleCancelAllOrders = () => {
    console.log("Cancel all orders");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Trading Game</h1>
      <div className="mb-4">
        <label htmlFor="security-select" className="mr-2">
          Select Security:{" "}
        </label>
        <select
          id="security-select"
          value={selectedSecurity}
          onChange={handleSecurityChange}
          className="px-4 py-2 border rounded"
        >
          {orderbookData.securities.map((security) => (
            <option key={security.name} value={security.name}>
              {security.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="bid-ask-quantity" className="mr-2">
          Bid/Ask Quantity:{" "}
        </label>
        <input
          id="bid-ask-quantity"
          type="number"
          value={bidAskQuantity}
          onChange={handleBidAskQuantityChange}
          min="1"
          className="px-4 py-2 border rounded"
        />
      </div>
      <table className="table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">
              Bid {bidAskQuantity}
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Ask {bidAskQuantity}
            </th>
            <th className="border border-gray-300 px-4 py-2">Bid Volume</th>
            <th className="border border-gray-300 px-4 py-2">Ask Volume</th>
            <th className="border border-gray-300 px-4 py-2">Cancel Orders</th>
          </tr>
        </thead>
        <tbody>
          {orderbook.map((entry, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                {entry.price}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleBid(entry.price)}
                  className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                >
                  Bid
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleAsk(entry.price)}
                  className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
                >
                  Ask
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {entry.bidVolume}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {entry.askVolume}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleCancelOrder(entry.price)}
                  className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleCancelAllOrders}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
      >
        Cancel All Orders
      </button>
    </div>
  );
};

export default Game;
