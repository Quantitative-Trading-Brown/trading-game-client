"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps } from "@/utils/Types";

type ResolutionProps = {
  securities: SecurityProps;
};

const Resolution = (props: ResolutionProps) => {
  const [prices, setPrices] = useState({});
  const { socket } = useSocket();

  const handlePriceChange = (sec_id : number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(event.target.value));
    setPrices((state) => {
      return { ...state, [sec_id]: value };
    });
  };

  const handleResolved = () => {
    if (socket) {
      socket.emit("rankgame", prices);
    }
  };

  return (
    <div className="flex flex-col h-full p-8">
      <h1 className="text-4xl font-extrabold mb-8">True Price Resolution</h1>
      <div className="flex flex-col flex-grow">
        {Object.entries(props.securities).map(([sec_id, amount]: [any, any]) => (
          <div key={sec_id} className="flex items-center p-2">
            <label htmlFor="book-min" className="mr-2">
              {props.securities[sec_id].name} True Price:{" "}
            </label>
            <input
              type="number"
              onChange={(e) => handlePriceChange(sec_id, e)}
              className="setting w-[7em] px-2 py-1 bg-gray-700"
            />
          </div>
        ))}
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
