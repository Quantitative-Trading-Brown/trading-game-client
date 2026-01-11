import React, { useState } from "react";
import { useSocket } from "@/contexts/SocketContext";

type TradeBoxProps = {
  selectedSecurity: string;
};

const TradeCell: React.FC<TradeBoxProps> = ({ selectedSecurity }) => {
  const { socket } = useSocket();
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [side, setSide] = useState<"bid" | "ask">("bid");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

  const PlaceOrder = () => {
    if (!socket) return;
    if (orderType == "market") {
      socket.emit("market_order", selectedSecurity, side, quantity);
    } else if (orderType == "limit") {
      socket.emit("limit_order", selectedSecurity, side, price, quantity);
    } else {
      console.error("Invalid order type: " + orderType);
    }
  };

  const ChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuantity(Math.min(100, Math.max(1, Number(e.target.value))));
  const ChangePrice = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrice(Math.max(0, Number(e.target.value)));

  return (
    <div className="p-4 flex flex-col justify-between gap-4 h-full">
      <h2 className="font-bold text-xl">Trade</h2>
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

      <div className="flex justify-between items-center w-full gap-4">
        <div className="flex items-center flex-shrink-0">
          <span className="mr-2 whitespace-nowrap">Quantity (max 100):</span>
          <input
            id="quantity"
            type="number"
            placeholder="1"
            onChange={ChangeQuantity}
            className="px-2 py-1 bg-gray-700 w-[100px]"
          />
        </div>
        {orderType === "limit" && (
          <div className="flex flex-grow items-center justify-end gap-2">
            <label htmlFor="price" className="whitespace-nowrap">
              Price:
            </label>
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
