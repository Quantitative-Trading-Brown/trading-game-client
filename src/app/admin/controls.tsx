"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const Controls = () => {
  const [paused, setPaused] = useState({});
  const { socket } = useSocket();

  const handleEndGame = () => {
    if (socket) {
      socket.emit("endgame");
    }
  }

  return (
    <div className="flex flex-col text-white p-4 max-w-lg w-[30em] mx-auto rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Control Panel</h2>
      <button
        onClick={handleEndGame}
        className="px-2 py-1 h-10 bg-gray-500 text-white shadow 
          border-gray-500 active:border-l-[2px] active:border-t-[2px]
          hover:bg-red-600 flex-grow"
      >
        End Game
      </button>
    </div>
  );
};

export default Controls;
