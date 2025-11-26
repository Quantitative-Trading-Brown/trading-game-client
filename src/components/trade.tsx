import React, { useState } from "react";
import { useSocket } from "@/contexts/SocketContext";

type TradeBoxProps = {
  selectedSecurity: number;
};

const TradeCell: React.FC<TradeBoxProps> = ({ securities }) => {
  const { socket } = useSocket();
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [side, setSide] = useState<"bid" | "ask">("bid");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSecurity, setSelectedSecurity] = useState(
    Number(Object.keys(securities)[0]),
  );

  const PlaceOrder = () => {
    if (!socket) return;
    if (orderType == "market") {
        socket.emit("market_order", selectedSecurity, side, quantity);
    } else if (orderType == "limit") {
        socket.emit("limit_order", selectedSecurity, side, price, quantity);
    } else {
        console.error("Invalid order type: " + orderType)
    }
  };

  const ChangeSecurity = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedSecurity(Number(e.target.value));
  const ChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuantity(Math.max(1, Number(e.target.value)));
  const ChangePrice = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrice(Math.max(0, Number(e.target.value)));


  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <h2 className="font-bold text-xl">Trade</h2>
      <div className="flex gap-10 justify-center items-center flex-wrap px-8 py-5">
        <div className="flex flex-1 items-center">
          <label htmlFor="security-select" className="mr-2">
            Select Security:
          </label>
          <select
            id="security-select"
            value={selectedSecurity}
            onChange={ChangeSecurity}
            className="px-4 py-2 bg-gray-700 flex-grow"
          >
            {Object.entries(securities).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <button
          className={`flex-1 py-2  ${orderType === "market" ? "bg-blue-600" : "bg-gray-700"} hover:bg-blue-700`}
          onClick={() => setOrderType("market")}
        >
          Market
        </button>
        <button
          className={`flex-1 py-2  ${orderType === "limit" ? "bg-blue-600" : "bg-gray-700"} hover:bg-blue-700`}
          onClick={() => setOrderType("limit")}
        >
          Limit
        </button>
      </div>

      <div className="flex justify-between gap-2">
        <button
          className={`flex-1 py-2  ${side === "bid" ? "bg-green-600" : "bg-gray-700"} hover:bg-green-700`}
          onClick={() => setSide("bid")}
        >
          Buy
        </button>
        <button
          className={`flex-1 py-2  ${side === "ask" ? "bg-red-600" : "bg-gray-700"} hover:bg-red-700`}
          onClick={() => setSide("ask")}
        >
          Sell
        </button>
      </div>

      <div className="flex justify-between">
        <div className="flex justify-left items-center pr-5">
          <span className="mr-2">Quantity:</span>
          <input
            id="quantity"
            type="number"
            placeholder="1"
            onChange={ChangeQuantity}
            className="px-2 py-1 bg-gray-700"
          />
        </div>
        {orderType === "limit" && (
          <div className="flex items-center gap-2">
            <label htmlFor="price">Price:</label>
            <input
              id="price"
              type="number"
              placeholder="0"
              onChange={ChangePrice}
              className="px-2 py-1 bg-gray-700"
            />
          </div>
        )}
      </div>

      <button
        onClick={PlaceOrder}
        className="py-2 bg-gray-600 hover:bg-gray-700 text-white"
      >
        Place Order
      </button>
    </div>
  );
};

export default TradeCell;
