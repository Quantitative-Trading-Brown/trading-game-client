"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const generateBook = (bookLim) => {
  return Array.from({ length: bookLim[1] - bookLim[0] + 1 }, (_, i) => ({
    [bookLim[1] - i]: 0,
  })).reduce((acc, curr) => Object.assign(acc, curr), {});
};

const Orderbook = ({ book, bookLim }) => {
  const [selectedSecurity, setSelectedSecurity] = useState(
    "Test Security",
  );
  const [bidAskQuantity, setBidAskQuantity] = useState(1);
  const [orderbook, setOrderbook] = useState(generateBook(bookLim));
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("orderbook", (msg: string) => {
        setOrderbook(existing => {return {...existing, ...msg}});
      });

      return () => {
        socket.off("orderbook");
      };
    }
  }, [socket]);

  // On refresh, load the starting state of the orderbook
  useEffect(() => {
    setOrderbook(existing => {return {...existing, ...book}});
  }, [])

  const handleBidAskQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBidAskQuantity(parseInt(Math.max(1, Math.min(1e+3, Number(event.target.value)))));
  };
  const handleSecurityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedSecurity(event.target.value);
  };

  const handleOrder = (order_type: string, price: string) => {
    // Handle bid and ask orders
    // console.log(`${order_type} ${bidAskQuantity} at ${price}`);
    socket.emit("order", order_type, Number(price), bidAskQuantity);
  };
  const handleCancelOrder = (price: number) => {
    // Handle cancel requests
    // console.log(`Cancel orders at ${price}`);
    socket.emit("cancel", price);
  };
  const handleCancelAllOrders = () => {
    // Handle cancel everything requests
    // console.log("Cancel all orders");
    socket.emit("cancel_all");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-10 justify-center items-center px-8 py-5">
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
            {["Test Security"].map((security) => (
              <option key={security} value={security}>
                {security}
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
          className="px-2 py-1 h-10 bg-gray-500 text-white shadow 
          border-gray-500 active:border-l-[2px] active:border-t-[2px]
          hover:bg-red-600 flex-grow"
        >
          Cancel All Orders
        </button>
      </div>
      <div className="overflow-y-auto h-[20em]">
        <table className="table-auto border-collapse w-full">
          <thead className="outline outline-1 outline-offset-0 outline-red sticky top-0">
            <tr className="bg-black">
              <th className="text-left px-4 py-2">
                Price
              </th>
              <th className="text-left px-4 py-2">
                Bid Vol
              </th>
              <th className="text-left px-4 py-2">
                Ask Vol
              </th>
              <th colSpan="3" className="text-center px-4 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="border-separate">
            {Object.entries(orderbook).toReversed().map(([price, vol]) => (
              <tr key={price} className="border-b border-gray-300">
                <td className="px-4 h-10">{price}</td>
                <td className={"px-4 h-10" + (vol > 0 ? " bg-green-700" : "")}>{Math.max(vol, 0)}</td>
                <td className={"px-4 h-10" + (vol < 0 ? " bg-red-700" : "")}>{-Math.min(vol, 0)}</td>
                <td className="h-10 p-0 border-x-white border-x w-[10em]">
                  <button
                    onClick={() => handleOrder("BUY", price)}
                    className="px-4 py-2 bg-gray-500 w-full h-full 
                    border-gray-500 active:border-l-[2px] active:border-t-[2px]
                    text-white hover:bg-blue-600 truncate"
                  >
                    Buy {bidAskQuantity}
                  </button>
                </td>
                <td className="h-10 p-0 border-x-white border-x w-[10em]">
                  <button
                    onClick={() => handleOrder("SELL", price)}
                    className="px-4 py-2 bg-gray-500 w-full h-full 
                    border-gray-500 active:border-l-[2px] active:border-t-[2px]
                    text-white hover:bg-blue-600 truncate"
                  >
                    Sell {bidAskQuantity}
                  </button>
                </td>
                <td className="h-10 p-0 border-x-white border-x w-[10em]">
                  <button
                    onClick={() => handleCancelOrder(price)}
                    className="px-4 py-2 bg-gray-500 w-full h-full 
                    border-gray-500 active:border-l-[2px] active:border-t-[2px]
                    text-white hover:bg-blue-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orderbook;
