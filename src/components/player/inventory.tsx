"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps, Inventory, Cash } from "@/utils/Types";

type InventoryProps = {
  securities: SecurityProps;
  existing_inventory: Inventory;
  existing_cash: Cash;
};

const InventoryCell: React.FC<InventoryProps> = ({
  securities,
  existing_inventory,
  existing_cash
}) => {
  const [cash, setCash] = useState<Cash>(existing_cash);
  const [inventory, setInventory] = useState<Inventory>(existing_inventory);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("inventory", (update) => {
        setInventory((state) => {
          return { ...state, ...update["securities"] };
        });

        setCash((state) => {
          return { ...state, ...update["cash"] };
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
        {Object.entries(securities).map(([sec_id, props]: [any, any]) => (
          <div
            key={sec_id}
            className="flex justify-between items-center gaps-5"
          >
            <span>
              {sec_id}: {inventory[sec_id] || 0}
            </span>
          </div>
        ))}
        <div><span>Liquid: ${cash["cash"] ?? 0}</span></div>
        <div><span>Reserve: ${cash["reserve"] ?? 0}</span></div>
      </div>
    </div>
  );
};

export default InventoryCell;
