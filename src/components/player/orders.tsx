import React, { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { Securities, Orders } from "@/utils/Types";

type OrderProps = {
  securities: Securities;
  existingOrders: Orders;
};

const OrdersCell: React.FC<OrderProps> = ({ securities, existingOrders }) => {
  const { socket } = useSocket();
  const [orders, setOrders] = useState<OrderEntry[]>(existingOrders);

  const CancelAllOrders = () => socket?.emit("cancel_all");

  useEffect(() => {
    if (!socket) return;

    // Listen for order updates
    socket.on("orders", (updates) => {
      setOrders((prev) => {
        // Merge previous state with incoming updates
        const merged = { ...prev, ...updates };

        // Remove keys where the update value is -1
        for (const [key, value] of Object.entries(merged)) {
          if (value === -1) {
            delete merged[key];
          }
        }

        return merged;
      });
    });

    return () => {
      socket.off("orders");
    };
  }, [socket]);

  const cancelOrder = (order_id: string) => {
    if (!socket) return;
    socket.emit("cancel", order_id);
  };

  console.log(orders);
  return (
    <div className="p-4 text-white rounded-lg flex flex-col gap-2 overflow-y-auto h-full">
      <h2 className="font-bold text-xl">My Orders</h2>
      <div className="flex-grow overflow-y-auto">
        <div className="overflow-y-auto font-mono text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="h-6 font-semibold text-gray-300 border-b border-gray-600">
                <th className="w-1/4 text-left">Side</th>
                <th className="w-1/4 text-center">Price</th>
                <th className="w-1/4 text-center">Quantity</th>
                <th className="w-1/4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(orders).map(([oid, data]) => (
                <tr
                  key={oid}
                  className=""
                >
                  <td
                    className={
                      data.side === "bids"
                        ? "text-green-400 text-left"
                        : "text-red-400 text-left"
                    }
                  >
                    {data.side === "bids" ? "BUY" : "SELL"}
                  </td>

                  <td className="text-center">{data.price}</td>

                  <td className="text-center">{data.quantity}</td>

                  <td className="text-right">
                    <button
                      onClick={() => cancelOrder(oid)}
                      className="px-2 py-1 bg-gray-600 rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={CancelAllOrders}
        className="px-2 py-1 bg-gray-500 text-white shadow border-black active:border-l-[2px] active:border-t-[2px] hover:bg-red-600"
      >
        Cancel All Orders
      </button>
    </div>
  );
};

export default OrdersCell;
