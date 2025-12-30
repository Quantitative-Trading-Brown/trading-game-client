"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps, Inventory } from "@/utils/Types";

type InventoryProps = {
  securities: SecurityProps;
  existing_inventory: Inventory;
};

const generateInventory = (securities: SecurityProps, inventory: Inventory) => {
  const securityMap = Object.keys(securities).reduce(
    (acc, key) => {
      acc[key] = inventory[key] || 0;
      return acc;
    },
    {"USD": inventory["USD"] || 0} as { [key: number]: number }
  );

  return securityMap;
};

const InventoryCell: React.FC<TradeBoxProps> = ({ securities, existing_inventory }) => {
  const [inventory, setInventory] = useState({});
  const { socket } = useSocket();

  useEffect(() => {
    setInventory(generateInventory(securities, existing_inventory));
  }, []);

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
    <div className="flex flex-col text-white p-4 mx-auto rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Positions</h2>
      <div className="text-lg space-y-2 overflow-y-auto h-full">
        {Object.entries(inventory).map(([sec_id, amount]: [any, any]) => (
          <div
            key={sec_id}
            className="flex justify-between items-center gaps-5"
          >
            {sec_id != "USD" ? (
              <span>
                {sec_id}: {amount}
              </span>
            ) : (
              <span>${amount}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryCell;
