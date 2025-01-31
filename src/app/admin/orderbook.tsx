"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const generateBook = (bookLim) => {
  return Array.from({ length: bookLim[1] - bookLim[0] + 1 }, (_, i) => ({
    [bookLim[1] - i]: 0,
  })).reduce((acc, curr) => Object.assign(acc, curr), {});
};

const Orderbook = ({ book, bookLim }) => {
  const [selectedSecurity, setSelectedSecurity] = useState("Test Security");
  const [bidAskQuantity, setBidAskQuantity] = useState(1);
  const [orderbook, setOrderbook] = useState([0, 0]);
  const { socket } = useSocket();

  useEffect(() => {
    setOrderbook(generateBook(bookLim));
  }, [bookLim]);

  useEffect(() => {
    if (socket) {
      socket.on("orderbook", (msg: string) => {
        setOrderbook((existing) => {
          return { ...existing, ...msg };
        });
      });

      return () => {
        socket.off("orderbook");
      };
    }
  }, [socket]);

  // On refresh, load the starting state of the orderbook
  useEffect(() => {
    setOrderbook((existing) => {
      return { ...existing, ...book };
    });
  }, []);

  const handleSecurityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedSecurity(event.target.value);
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
      </div>
      <div className="overflow-y-auto h-[20em]">
        <table className="table-auto border-collapse w-full">
          <thead className="outline outline-1 outline-offset-0 outline-red sticky top-0">
            <tr className="bg-black">
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-left px-4 py-2">Bid Vol</th>
              <th className="text-left px-4 py-2">Ask Vol</th>
            </tr>
          </thead>
          <tbody className="border-separate">
            {Object.entries(orderbook)
              .toReversed()
              .map(([price, vol]) => (
                <tr key={price} className="border-b border-gray-300">
                  <td className="px-4 h-10">{price}</td>
                  <td
                    className={"px-4 h-10" + (vol > 0 ? " bg-green-700" : "")}
                  >
                    {Math.max(vol, 0)}
                  </td>
                  <td className={"px-4 h-10" + (vol < 0 ? " bg-red-700" : "")}>
                    {-Math.min(vol, 0)}
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
