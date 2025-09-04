"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps, Inventory } from "@/utils/Types";

type InventoryProps = {
  securities: SecurityProps;
  inventory: Inventory;
};

const generateInventory = (securities: SecurityProps, inventory: Inventory) => {
  const securityMap = Object.keys(securities).reduce(
    (acc, key) => {
      acc[Number(key)] = inventory[Number(key)] || 0;
      return acc;
    },
    {} as { [key: number]: number },
  );
	securityMap[0] = inventory[0] || 0;

  return securityMap;
};

const InventoryCell = (props: InventoryProps) => {
  const [inventory, setInventory] = useState({});
  const { socket } = useSocket();

  useEffect(() => {
    setInventory(generateInventory(props.securities, props.inventory));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("inventory", (update) => {
        console.log(update);
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
      <h2 className="text-xl font-bold mb-4">Player Inventory</h2>
      <div className="text-lg space-y-2 overflow-y-auto h-full">
        {Object.entries(inventory).map(([sec_id, amount]: [any, any]) => (
          <div
            key={sec_id}
            className="flex justify-between items-center gaps-5"
          >
            {sec_id != 0 ? (
              <span>
                {props.securities[sec_id].name}: {amount}
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
