"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const Leaderboard = ({ admin }) => {
  const [rankings, setRankings] = useState([]);
  const [buffer, setBuffer] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("leaderboard", (rankings) => {
        setRankings(rankings)
      });

      return () => {
        socket.off("leaderboard");
      };
    }
  }, [socket]);

  return (
    <div className="flex flex-col text-white p-4 h-full mx-auto rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Leaderboard</h2>
      <div className="flex-grow space-y-2 overflow-y-auto">
        {rankings.map((playerData, index) => (
          <div key={index} className="flex justify-between items-center gaps-5">
            <p className="text-sm text-gray-300">{index+1}</p>
            <span className="text-xs text-gray-500">{playerData}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
