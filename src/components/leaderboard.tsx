"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const LeaderboardCell = () => {
  const [rankings, setRankings] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("leaderboard", (rankings) => {
        setRankings(rankings);
      });

      socket.emit("leaderboard");

      return () => {
        socket.off("leaderboard");
      };
    }
  }, [socket]);

  return (
    <div className="overflow-y-auto h-full">
      <table className="ranking-table table-auto border-collapse w-full">
        <thead className="outline outline-1 outline-offset-0 sticky top-0">
          <tr className="bg-black">
            <th className="text-left px-4 py-2">Ranking</th>
            <th className="text-left px-4 py-2">Username</th>
            <th className="text-left px-4 py-2">Bankruptcies</th>
            <th className="text-left px-4 py-2">Ending $</th>
          </tr>
        </thead>
        <tbody className="border-separate">
          {rankings.map((player_info, index) => (
            <tr key={index} className={`border-b border-gray-300`}>
              <td className="px-4 h-10">{index + 1}</td>
              <td className="px-4 h-10">{player_info[0]}</td>
              <td className="px-4 h-10">{player_info[1]}</td>
              <td className="px-4 h-10">{player_info[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardCell;
