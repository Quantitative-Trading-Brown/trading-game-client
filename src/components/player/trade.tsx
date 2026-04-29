import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";

type TradeBoxProps = {
  selectedSecurity: string;
};

const STEP_QTY = 1;
const STEP_PRICE = 1;

const TradeCell: React.FC<TradeBoxProps> = ({ selectedSecurity }) => {
  const { socket } = useSocket();
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [side, setSide] = useState<"bid" | "ask">("bid");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

  const qtyRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const PlaceOrder = () => {
    if (!socket) return;
    if (orderType === "market") {
      socket.emit("market_order", { sec_id: selectedSecurity, side, quantity });
    } else if (orderType === "limit") {
      socket.emit("limit_order", { sec_id: selectedSecurity, side, price, quantity });
    }
  };

  const ChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuantity(Math.min(100, Math.max(1, Number(e.target.value))));
  const ChangePrice = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrice(Math.max(0, Number(e.target.value)));

  // Vim-style keybindings (active when no input is focused)
  useEffect(() => {
    const isInputFocused = () => {
      const tag = document.activeElement?.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    };

    const handleKey = (e: KeyboardEvent) => {
      if (isInputFocused()) return;

      switch (e.key) {
        case "b":
          setSide("bid");
          break;
        case "s":
          setSide("ask");
          break;
        case "m":
          setOrderType("market");
          break;
        case "l":
          setOrderType("limit");
          break;
        case "j":
          setQuantity((q) => Math.max(1, q - STEP_QTY));
          break;
        case "k":
          setQuantity((q) => Math.min(100, q + STEP_QTY));
          break;
        case "h":
          setPrice((p) => Math.max(0, p - STEP_PRICE));
          break;
        case ";":
          setPrice((p) => p + STEP_PRICE);
          break;
        case "Enter":
          e.preventDefault();
          PlaceOrder();
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [socket, selectedSecurity, orderType, side, price, quantity]);

  // Sync input fields when state changes via keybindings
  useEffect(() => {
    if (qtyRef.current) qtyRef.current.value = String(quantity);
  }, [quantity]);
  useEffect(() => {
    if (priceRef.current) priceRef.current.value = String(price);
  }, [price]);

  return (
    <div className="p-4 flex flex-col justify-between gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">Trade</h2>
        <span className="text-xs text-gray-500">
          b/s side · m/l type · j/k qty · h/; price · Enter submit
        </span>
      </div>
      <div className="flex justify-between gap-2">
        <button
          className={`flex-1 py-2 ${orderType === "market" ? "bg-blue-600" : "bg-gray-700"} hover:bg-blue-700`}
          onClick={() => setOrderType("market")}
        >
          Market <span className="text-xs text-gray-300">[m]</span>
        </button>
        <button
          className={`flex-1 py-2 ${orderType === "limit" ? "bg-blue-600" : "bg-gray-700"} hover:bg-blue-700`}
          onClick={() => setOrderType("limit")}
        >
          Limit <span className="text-xs text-gray-300">[l]</span>
        </button>
      </div>

      <div className="flex justify-between gap-2">
        <button
          className={`flex-1 py-2 ${side === "bid" ? "bg-green-600" : "bg-gray-700"} hover:bg-green-700`}
          onClick={() => setSide("bid")}
        >
          Buy <span className="text-xs text-gray-300">[b]</span>
        </button>
        <button
          className={`flex-1 py-2 ${side === "ask" ? "bg-red-600" : "bg-gray-700"} hover:bg-red-700`}
          onClick={() => setSide("ask")}
        >
          Sell <span className="text-xs text-gray-300">[s]</span>
        </button>
      </div>

      <div className="flex justify-between items-center w-full gap-4">
        <div className="flex items-center flex-shrink-0">
          <span className="mr-2 whitespace-nowrap">Qty <span className="text-xs text-gray-400">[j/k]</span>:</span>
          <input
            ref={qtyRef}
            id="quantity"
            type="number"
            defaultValue={1}
            onChange={ChangeQuantity}
            className="px-2 py-1 bg-gray-700 w-[100px]"
          />
        </div>
        {orderType === "limit" && (
          <div className="flex flex-grow items-center justify-end gap-2">
            <label htmlFor="price" className="whitespace-nowrap">
              Price <span className="text-xs text-gray-400">[h/;]</span>:
            </label>
            <input
              ref={priceRef}
              id="price"
              type="number"
              defaultValue={0}
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
        Place Order <span className="text-xs text-gray-300">[Enter]</span>
      </button>
    </div>
  );
};

export default TradeCell;
