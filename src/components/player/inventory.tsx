"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps, Inventory } from "@/utils/Types";

type InventoryProps = {
  securities: SecurityProps;
  existing_inventory: Inventory;
  existing_cash: number;
  existing_position_value: number;
  existing_margin: number;
};

const InventoryCell: React.FC<InventoryProps> = ({
  securities,
  existing_inventory,
  existing_cash,
  existing_position_value,
  existing_margin
}) => {
  const [cash, setCash] = useState(existing_cash);
  const [positionValue, setPositionValue] = useState(existing_position_value);
  const [margin, setMargin] = useState(existing_margin);
  const [inventory, setInventory] = useState(existing_inventory);

  // Pass down outer component changes
  useEffect(() => {
    setCash(existing_cash);
    setPositionValue(existing_position_value);
    setInventory(existing_inventory);
    setMargin(existing_margin);
  }, [
    existing_margin,
    existing_inventory,
    existing_position_value,
    existing_cash
  ]);

  const { socket } = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on("inventory", (update) => {
        if ("securities" in update) {
          setInventory((state) => {
            return { ...state, ...update["securities"] };
          });
        }

        if ("cash" in update) {
          setCash(update["cash"]);
        }

        if ("position_value" in update) {
          setPositionValue(Math.round(update["position_value"]));
        }

        if ("margin" in update) {
          setMargin(Math.round(update["margin"]));
        }
      });

      return () => {
        socket.off("inventory");
      };
    }
  }, [socket]);

  let equity = Number(cash) + Number(positionValue);
  let excess = equity - Number(margin);

  return (
    <div className="flex flex-col text-white p-4 mx-auto rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Account</h2>
      <div className="text-lg space-y-2 overflow-y-auto h-full">
        <div>
          <span>Equity: ${equity}</span>
        </div>
        <div className="pl-7">
          <div>
            <span>Cash: ${cash}</span>
          </div>
          <div>
            <span>Position Value: ${positionValue}</span>
          </div>
        </div>

        <div>
          <span>Equity Required: ${margin}</span>
        </div>

        <div>
          <span>Equity Excess: </span>
          <span className={`${excess < 0 ? "text-red-500" : "text-white"}`}>
            ${excess}
          </span>
        </div>
      </div>
      <hr className="my-4" />
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
      </div>
    </div>
  );
};

export default InventoryCell;
