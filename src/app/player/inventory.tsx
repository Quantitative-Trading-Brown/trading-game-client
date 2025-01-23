"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const Inventory = () => {
  const [inventory, setInventory] = useState({});
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("inventory", (update) => {
        setInventory((state) => {
          return { ...state, ...update };
        });
      });

      return () => {
        socket.off("inventory");
      };
    }
  }, [socket]);

  return (
    <div className="flex flex-col text-white p-4 max-w-lg w-[30em] mx-auto rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Player Inventory</h2>
      <div className="space-y-2 overflow-y-auto h-[7em]">
        {Object.entries(inventory).map(([name, amount]) => (
          <div key={name} className="flex justify-between items-center gaps-5">
            {name}: {amount}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
