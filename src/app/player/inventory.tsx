"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps } from "@/utils/Types";

type InventoryProps = {
  securities: SecurityProps;
};

const generateInventory = (securities: SecurityProps) => {
  const securityMap = Object.keys(securities).reduce(
    (acc, key) => {
      acc[Number(key)] = 0;
      return acc;
    },
    {} as { [key: number]: number },
  );
	securityMap[0] = 0;

  return securityMap;
};

const Inventory = (props: InventoryProps) => {
  const [inventory, setInventory] = useState({});
  const { socket } = useSocket();

  useEffect(() => {
    setInventory(generateInventory(props.securities));
  }, [props.securities]);

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

export default Inventory;
