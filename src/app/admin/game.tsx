"use client";
import { useState, useEffect } from "react";
import orderbookData from "@/assets/mock.orderbook.json";

const Game = () => {
  const [selectedSecurity, setSelectedSecurity] = useState(
    orderbookData.securities[0].name,
  );
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

  const handleSecurityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedSecurity(event.target.value);
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
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Bid Vol</th>
            <th className="border border-gray-300 px-4 py-2">Ask Vol</th>
          </tr>
        </thead>
        <tbody>
          {orderbook.map((entry, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 h-10">
                {entry.price}
              </td>
              <td className="border border-gray-300 px-4 h-10">
                {entry.bidVolume}
              </td>
              <td className="border border-gray-300 px-4 h-10">
                {entry.askVolume}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Game;
