"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const Lobby = () => {
  const [settings, setSettings] = useState({});
  const { socket } = useSocket();

  const handleBookMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(
      Math.max(0, Math.min(1e3, Number(event.target.value))),
    );
    setSettings(state => {
      return {...state, "bookMin": value};
    });
  };

  const handleBookMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(
      Math.max(0, Math.min(1e3, Number(event.target.value))),
    );
    setSettings(state => {
      return {...state, "bookMax": value};
    });
  };

  const handleGameStart = (event) => {
    socket.emit("startgame", settings);
  };

  return (
    <div className="flex flex-col h-full p-8">
      <h1 className="text-4xl font-extrabold mb-8">Trading Game Admin Setup</h1>
      <div className="flex flex-col flex-grow">
        <div className="flex items-center p-2">
          <label htmlFor="book-min" className="mr-2">
            Book Minimum:{" "}
          </label>
          <input
            id="book-min"
            type="number"
            onChange={handleBookMinChange}
            className="setting w-[7em] px-2 py-1 bg-gray-700"
          />
        </div>
        <div className="flex items-center p-2">
          <label htmlFor="book-max" className="mr-2">
            Book Maximum:{" "}
          </label>
          <input
            id="book-max"
            type="number"
            onChange={handleBookMaxChange}
            className="setting w-[7em] px-2 py-1 bg-gray-700"
          />
        </div>
      </div>
      <div className="flex w-full h-[3em]">
        <button onClick={handleGameStart} className="w-full h-full bg-red-700">
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Lobby;
