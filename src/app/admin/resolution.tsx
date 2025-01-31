"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const Resolution = () => {
  const [prices, setPrices] = useState({});
  const { socket } = useSocket();

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(
      Math.max(0, Math.min(1e3, Number(event.target.value))),
    );
    setPrices(state => {
      return {...state, "security": value};
    });
  };

  const handleResolved = (event) => {
    socket.emit("rankgame", prices);
  };

  return (
    <div className="flex flex-col h-full p-8">
      <h1 className="text-4xl font-extrabold mb-8">True Price Resolution</h1>
      <div className="flex flex-col flex-grow">
        <div className="flex items-center p-2">
          <label htmlFor="book-min" className="mr-2">
            Security True Price:{" "}
          </label>
          <input
            id="book-min"
            type="number"
            onChange={handlePriceChange}
            className="setting w-[7em] px-2 py-1 bg-gray-700"
          />
        </div>
      </div>
      <div className="flex w-full h-[3em]">
        <button onClick={handleResolved} className="w-full h-full bg-red-700">
          Resolve to Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Resolution;
